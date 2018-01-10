import chai from 'chai';
import dirtyChai from 'dirty-chai';
import _ from 'lodash';
import {By, until} from 'selenium-webdriver';
import MiewPage from './pages/miew.page';
import golden from './golden';
chai.use(dirtyChai);
import goldenCfg from './golden.cfg';
import {createDriverInstance} from './driver';

const domic = {
  menu: {
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
  }
};

function fillInArray(arrDetales) {
  let holder = [];
  for (let i = 1; i <= arrDetales.listLength; ++i) {
    let semiElement = arrDetales.constPathPart + '(' + i + ')';
    let newElement = By.css(semiElement);
    holder.push(newElement);
  }
  return holder;
}

function repeat(colour) {
  return driver.findElement(domic.menu.openButton).isDisplayed()
    .then((visible) => {
      if (visible) {
        return driver.findElement(domic.menu.openButton).click();
      } else {
        return Promise.resolve();
      }
    })
    .then(() => driver.wait(until.elementLocated(domic.menu.colorTab), 5 * 1000))
    .then(() => driver.findElement(domic.menu.colorTab).click())
    .then(() => driver.findElement(colour).click())
    .then(() => driver.findElement(domic.menu.closeButton).click())
    .then(() => page.waitUntilRebuildIsDone());
}

const cfg = Object.assign({}, goldenCfg, {
  title: 'Representations Tests',
  report: 'report-rep.html',
});

let driver;
let page;

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
    let modes = fillInArray(domic.menu.modeNames);
    let colours = fillInArray(domic.menu.colorNames);
    _.each(modes, (mode) => {
      suite.addTest(it('check mode function', function() {
        //open Menu, select representation tab
        return driver.findElement(domic.menu.openButton).click()
          .then(() => driver.findElement(domic.menu.representationTab).click())
          //Select representation mode
          .then(() => driver.wait(until.elementLocated(domic.menu.modeTab), 5 * 1000))
          .then(() => driver.findElement(domic.menu.modeTab).click())
          .then(() => driver.findElement(mode).click())
          //Select representation colour
          .then(() => colours.forEach(repeat));
      }));
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
});

