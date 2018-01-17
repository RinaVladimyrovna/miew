import chai from 'chai';
import dirtyChai from 'dirty-chai';
import MiewPage from './pages/miew.page';
import golden from './golden';
import goldenCfg from './golden.cfg';
import {createDriverInstance} from './driver';
//import _ from 'lodash';

chai.use(dirtyChai);

var representationTests = require('./menu_tests/reps'),
  displayTests = require('./menu_tests/display'),
  materialTests = require('./menu_tests/materials'),
  //modeParamsTests = require('./menu_tests/mode_params'),
  //selectorTests = require('./menu_tests/selectors'),
  loadingTests = require('./menu_tests/loadings');

const cfg = Object.assign({}, goldenCfg, {
  title: 'Representations Tests',
  report: 'report-menu-tests.html',
});

let driver, page;

function TestingWithCurrentSettings() {
  representationTests.RepresentationTests();
  displayTests.DisplayTests();
  materialTests.MaterialTests();
  //modeParamsTests.ModeParamsTests();
  //selectorTests.SelectorTests();
  loadingTests.LoadingTests();
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

  describe('experiment', function() {
    TestingWithCurrentSettings();
  });
});

export {driver, page};
