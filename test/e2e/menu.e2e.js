// import all we need
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import MiewPage from './pages/miew.page';
import golden from './golden';
import goldenCfg from './golden.cfg';
import {createDriverInstance} from './driver';
//import _ from 'lodash';

chai.use(dirtyChai);

// get all things that are required for a process
var representationTests = require('./menu_tests/reps'),
  displayTests = require('./menu_tests/display'),
  materialTests = require('./menu_tests/materials'),
  //modeParamsTests = require('./menu_tests/mode_params'),
  //selectorTests = require('./menu_tests/selectors'),
  loadingTests = require('./menu_tests/loadings');

// make a title for a report that will contain all images and their
// comparisons after tests are done
// do not forget they have to be different for each test set
const cfg = Object.assign({}, goldenCfg, {
  title: 'Representations Tests',
  report: 'report-menu-tests.html',
});

let driver, page;

// collect all tests into one function to call it once every time
function TestingWithCurrentSettings() {
  representationTests.RepresentationTests();
  displayTests.DisplayTests();
  materialTests.MaterialTests();
  //modeParamsTests.ModeParamsTests();
  //selectorTests.SelectorTests();
  loadingTests.LoadingTests();
}

// run main describe
describe('As a power user, I want to', function() {

  this.timeout(0);
  this.slow(1000);

// build new selenium instance and get our app there
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

// terminate used selenium instance
  after(function() {
    return golden.shutdown();
  });

// make an entry note before every... Why each?
  beforeEach(function() {
    golden.report.context.desc = this.currentTest.title;
  });

// let's wait till the default molecule is represented
// we must test the app only after it
  it('see 1CRN by default', function() {
    return page.waitUntilTitleContains('1CRN')
      .then(() => page.waitUntilRebuildIsDone())
      .then(() => golden.shouldMatch('1crn', this));
  });

// run all our tests written in the function above
  describe('experiment', function() {
    TestingWithCurrentSettings();
  });
});

// Hail to the ES6! Hail to the looped links!
export {driver, page};
