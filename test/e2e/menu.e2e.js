import chai from 'chai';
import dirtyChai from 'dirty-chai';
import _ from 'lodash';
import {By, until} from 'selenium-webdriver';
import MiewPage from './pages/miew.page';
import golden from './golden';
import goldenCfg from './golden.cfg';
import {createDriverInstance} from './driver';
import identifiers from './static';

chai.use(dirtyChai);

const menu = {
  openButton: By.css('div.btns-miew-titlebar:nth-child(3) > button:nth-child(1)'),
  closeButton: By.css('div.col-sm-3:nth-child(1) > div:nth-child(1) > button:nth-child(1)'),
  representationTab: By.css('div.col-sm-3:nth-child(1) > div:nth-child(2) > a:nth-child(3)'),
  loadTab: By.css('div.col-sm-3:nth-child(1) > div:nth-child(2) > a:nth-child(2)'),
  loadField: By.css('.main > form:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)'),
  modeTab: By.css('div.in:nth-child(2) > ul:nth-child(1) > li:nth-child(2)'),
  colorTab: By.css('div.in:nth-child(2) > ul:nth-child(1) > li:nth-child(3)'),
  materialTab: By.css('div.in:nth-child(2) > ul:nth-child(1) > li:nth-child(5)'),
  returnButton: By.css('div.col-xs-12:nth-child(8) > div:nth-child(1) > button:nth-child(1)'),
  loadOpenButton: By.css('span.btn:nth-child(2)'),
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

const display = {
  modeButton: By.css('button.blog-nav-item:nth-child(1)'),
  colorButton: By.css('button.blog-nav-item:nth-child(2)'),
  modeNames: {
    constPathPart: 'div.toolbar:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a:nth-child',
    listLength: 12
  },
  colorNames: {
    constPathPart: 'div.toolbar:nth-child(3) > div:nth-child(1) > div:nth-child(2) > a:nth-child',
    listLength: 12
  }
};

const cfg = Object.assign({}, goldenCfg, {
  title: 'Representations Tests',
  report: 'report-menu-rep.html',
});

let driver, page;

function fillInArray(arrMinutiae, identifierArr) {
  let holder = [];
  for (let i = 1; i <= arrMinutiae.listLength; ++i) {
    let newElement = {};
    let semiElement = arrMinutiae.constPathPart + '(' + i + ')';
    newElement.css = By.css(semiElement);
    newElement.identifier = identifierArr[i - 1];
    holder.push(newElement);
  }
  return holder;
}

function modeColorPairs(caseSwitch, colour, mode) {
  return driver.wait(until.elementLocated(menu.openButton), 5 * 1000)
    .then(() => {
      if (caseSwitch) {
        return driver.findElement(menu.openButton).click();
      } else {
        return driver.findElement(menu.openButton).click()
          .then(() => driver.findElement(menu.representationTab).click())
          .then(() => driver.wait(until.elementLocated(menu.modeTab), 5 * 1000))
          .then(() => driver.findElement(menu.modeTab).click())
          .then(() => driver.findElement(mode.css).click())
          .then(() => driver.sleep(1000));
      }
    })
    .then(() => driver.wait(until.elementLocated(menu.colorTab), 5 * 1000))
    .then(() => driver.findElement(menu.colorTab).click())
    .then(() => driver.findElement(colour.css).click())
    .then(() => driver.findElement(menu.closeButton).click())
    .then(() => page.waitUntilRebuildIsDone())
    .then(() => golden.shouldMatch(`1aid_${mode.identifier}_${colour.identifier}`, this));
}

function modeColorDisplay(caseSwitch, colour, mode) {
  return Promise.resolve()
    .then(() => {
      if (!caseSwitch) {
        return driver.findElement(display.modeButton).click()
          .then(() => driver.wait(until.elementLocated(mode.css), 5 * 1000))
          .then(() => driver.findElement(mode.css).click());
      } else {
        return Promise.resolve();
      }
    })
    .then(() => driver.wait(until.elementLocated(display.colorButton), 5 * 1000))
    .then(() => driver.findElement(display.colorButton).click())
    .then(() => driver.wait(until.elementLocated(colour.css), 5 * 1000))
    .then(() => driver.findElement(colour.css).click())
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

  describe('check an opportunity of loading from different sources, e. g.', function() {

    let suite = this;

    before(function() {
      let loads = identifiers.loadList;
      _.each(loads, (load) => {
        suite.addTest(it(`from ${load.source}`, function() {
          return driver.wait(until.elementLocated(menu.openButton), 5 * 1000)
            .then(() => driver.findElement(menu.openButton).click())
            .then(() => driver.findElement(menu.loadTab).click())
            .then(() => driver.wait(until.elementLocated(menu.loadField)))
            .then(() => driver.findElement(menu.loadField).sendKeys(`${load.link}`))
            .then(() => driver.wait(until.elementLocated(menu.loadOpenButton)))
            .then(() => driver.findElement(menu.loadOpenButton).click())
            .then(() => page.waitUntilTitleContains(`${load.moleculeId}`))
            .then(() => page.waitUntilRebuildIsDone())
            .then(() => golden.shouldMatch(`${load.format}`, this));
        }));
      });
    });

    it('use prearranged URL', function() {
      return driver.get(`http://localhost:${cfg.localPort}/?l=1AID&p=small&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false`)
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_BS_EL', this));
    });
  });

  describe('check all combinations of mode and colour via Menu', function() {

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

    it('use prearranged URL', function() {
      return driver.get(`http://localhost:${cfg.localPort}/?l=1AID&p=small&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false`)
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_BS_EL', this));
    });
  });

  describe('check all combinations of mode and colour via Display buttons', function() {

    let suite = this;

    before(function() {
      let modes = fillInArray(display.modeNames, identifiers.modeIdentifiers);
      let colours = fillInArray(display.colorNames, identifiers.colorIdentifiers);
      _.each(modes, (mode) => {
        _.each(colours, (colour, index) => {
          if (index > 0) {
            suite.addTest(it(`check ${colour.identifier} color with ${mode.identifier} mode`, function() {
              return modeColorDisplay(1, colour, mode);
            }));
          } else {
            suite.addTest(it(`check ${colour.identifier} color with ${mode.identifier} mode`, function() {
              return modeColorDisplay(0, colour, mode);
            }));
          }
        });
      });
    });

    it('use prearranged URL', function() {
      return driver.get(`http://localhost:${cfg.localPort}/?l=1AID&p=small&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false`)
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_BS_EL', this));
    });
  });

  describe('check all materials, e. g.', function() {

    let suite = this;

    before(function() {
      let materials = fillInArray(menu.materialNames, identifiers.materialIdentifiers);
      _.each(materials, (material) => {
        suite.addTest(it(`${material.identifier}`, function() {
          return driver.wait(until.elementLocated(menu.openButton), 5 * 1000)
            .then(() => driver.findElement(menu.openButton).click())
            .then(() => driver.findElement(menu.representationTab).click())
            .then(() => driver.wait(until.elementLocated(menu.materialTab), 5 * 1000))
            .then(() => driver.findElement(menu.materialTab).click())
            .then(() => driver.findElement(material.css).click())
            .then(() => driver.findElement(menu.closeButton).click())
            .then(() => page.waitUntilRebuildIsDone())
            .then(() => golden.shouldMatch(`1aid_QS_EL_${material.identifier}`, this));
        }));
      });
    });

    it('load apropriate molecule structure', function() {
      return driver.get(`http://localhost:${cfg.localPort}/?l=1AID&r=0&m=QS!scale:1,isoValue:0.5&r=1&s=all&m=BS&c=EL&mt=SF&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false`)
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_QS_EL', this));
    });
  });
});
