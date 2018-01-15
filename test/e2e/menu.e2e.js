import chai from 'chai';
import dirtyChai from 'dirty-chai';
import _ from 'lodash';
import MiewPage from './pages/miew.page';
import golden from './golden';
import goldenCfg from './golden.cfg';
import {createDriverInstance} from './driver';

chai.use(dirtyChai);

const cfg = Object.assign({}, goldenCfg, {
  title: 'Representations Tests',
  report: 'report-menu-rep.html',
});

let driver, page;

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

  describe('be able to load molecules from different sources', function() {
    require('./menu_tests/loadings');
  });

  describe('list all mode + color combinations via Menu', function() {
    require('./menu_tests/menu');
  });

  describe('list all mode + color combinations via Display buttons', function() {
    require('./menu_tests/display');
  });

  describe('list all materials', function() {
    require('./menu_tests/materials');
  });
});

export {driver, page};
