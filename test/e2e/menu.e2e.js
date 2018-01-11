import chai from 'chai';
import dirtyChai from 'dirty-chai';
import _ from 'lodash';
import {By, until} from 'selenium-webdriver';
import MiewPage from './pages/miew.page';
import golden from './golden';
chai.use(dirtyChai);
import goldenCfg from './golden.cfg';
import {createDriverInstance} from './driver';
import identifiers from './static';

const menu = {
  openButton: By.css('div.btns-miew-titlebar:nth-child(3) > button:nth-child(1)'),
  closeButton: By.css('div.col-sm-3:nth-child(1) > div:nth-child(1) > button:nth-child(1)'),
  representationTab: By.css('div.col-sm-3:nth-child(1) > div:nth-child(2) > a:nth-child(3)'),
  modeTab: By.css('div.in:nth-child(2) > ul:nth-child(1) > li:nth-child(2)'),
  colorTab: By.css('div.in:nth-child(2) > ul:nth-child(1) > li:nth-child(3)'),
  returnButton: By.css('div.col-xs-12:nth-child(8) > div:nth-child(1) > button:nth-child(1)'),
  modeNames: {
    constPathPart: 'div.col-xs-12:nth-child(8) > div:nth-child(2) > div:nth-child(1) > a:nth-child',
    listLength: 12
  },
  colorNames: {
    constPathPart: 'div.col-xs-12:nth-child(9) > div:nth-child(2) > div:nth-child(1) > a:nth-child',
    listLength: 12
  },
  materialNames: {
    constPathPart: 'div.col-xs-12:nth-child(11) > div:nth-child(2) > div:nth-child(1) > a:nth-child',
    listLength: 6
  }
};

const cfg = Object.assign({}, goldenCfg, {
  title: 'Representations Tests',
  report: 'report-menu-rep.html',
});

let driver;
let page;

function fillInArray(arrDetales, identifierArr) {
  let holder = [];
  for (let i = 1; i <= arrDetales.listLength; ++i) {
    let newElement = {};
    let semiElement = arrDetales.constPathPart + '(' + i + ')';
    newElement.css = By.css(semiElement);
    newElement.identifier = identifierArr[i-1];
    holder.push(newElement);
  }
  return holder;
}

function modeColorPairs(caseSwitch, colour, mode) {
  return driver.wait(until.elementLocated(menu.openButton), 5 * 1000)
    .then(() => {
      if (caseSwitch) {
        console.log('Just change colour and do not warry =-)');
        return driver.findElement(menu.openButton).click();
      } else {
        console.log('Change mode first!');
        return driver.findElement(menu.openButton).click()
          .then(() => driver.findElement(menu.representationTab).click())
          .then(() => driver.wait(until.elementLocated(menu.modeTab), 5 * 1000))
          .then(() => driver.findElement(menu.modeTab).click())
          .then(() => driver.findElement(mode.css).click());
      }
    })
    .then(() => driver.wait(until.elementLocated(menu.colorTab), 5 * 1000))
    .then(() => driver.findElement(menu.colorTab).click())
    .then(() => driver.findElement(colour.css).click())
    .then(() => driver.findElement(menu.closeButton).click())
    .then(() => page.waitUntilRebuildIsDone())
    .then(() => golden.shouldMatch(`1aid_${mode.identifier}_${colour.identifier}`, this));
}

describe('As a power user, I want to', function() {

  this.timeout(0);
  this.slow(1000);

  before(function() {
    driver = createDriverInstance();
    return golden.startup(driver, cfg)
      .then((url) => {
        page = new MiewPage(driver, url);
        return page.waitForMiew();
      })
      .then((version) => {
        golden.report.data.version = version;
      });
  });

  let suite = this;

  before(function() {
    let modes = fillInArray(menu.modeNames, identifiers.modeIdentifiers);
    let colours = fillInArray(menu.colorNames, identifiers.colorIdentifiers);
    _.each(modes, (mode) => {
      _.each(colours, (colour, index) => {
        if (index > 0) {
          suite.addTest(it(`check ${colour.identifier} color with ${mode.identifier} mode`, function() {
            return modeColorPairs(1, colour, mode);
          }));
        } else {
          suite.addTest(it(`check ${colour.identifier} color with ${mode.identifier} mode`, function() {
            return modeColorPairs(0, colour, mode);
          }));
        }
      });
    });
  });

  after(function() {
    return golden.shutdown();
  });

  beforeEach(function() {
    golden.report.context.desc = this.currentTest.title;
  });

  it('see 1CRN by default', function() {
    return page.waitUntilTitleContains('1CRN')
      .then(() => page.waitUntilRebuildIsDone())
      .then(() => golden.shouldMatch('1crn', this));
  });

  it('use prearranged URL', function() {
    return driver.get(`http://localhost:${cfg.localPort}/?l=1AID&p=small&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false`)
      .then(() => page.waitUntilTitleContains('1AID'))
      .then(() => page.waitUntilRebuildIsDone())
      .then(() => golden.shouldMatch('1aid', this));
  });
});

