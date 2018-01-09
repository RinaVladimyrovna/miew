//
import webdriver from 'selenium-webdriver';
import chai from 'chai';
import dirtyChai from 'dirty-chai';
//import _ from 'lodash';
import {By} from 'selenium-webdriver';
import MiewPage from './pages/miew.page';
import golden from './golden';
chai.use(dirtyChai);
import goldenCfg from './golden.cfg';
import {createDriverInstance} from './driver';

const domic = {
  menu: {
    button: By.className('btn btn-default btn-titlebar'),
    repTab: By.xpath('/html/body/div[2]/div[5]/div[1]/div[1]/div[2]/a[3]')//('miew-menu-panel-representation')
  }
};

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

  it('push Menu button', function() {
    return driver.findElement(domic.menu.button).click()
      .then(() => driver.findElement(domic.menu.repTab).click())
      .then(() => driver.sleep(10000));
  });
});

