// import all we need
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import {createDriverInstance} from './driver';
import MiewPage from './pages/miew.page';
import golden from './golden';
import goldenCfg from './golden.cfg';

chai.use(dirtyChai);

// get all things that are required for a process
var representationTests = require('./terminal_tests/reps'),
  colourTests = require('./terminal_tests/color_params'),
  materialTests = require('./terminal_tests/materials'),
  modeParamsTests = require('./terminal_tests/mode_params'),
  selectorTests = require('./terminal_tests/selectors'),
  loadingTests = require('./terminal_tests/loading');

// make a title for a report that will contain all images and their
// comparisons after tests are done
// do not forget they have to be different for each test set
const cfg = Object.assign({}, goldenCfg, {
  title: 'Representations Tests',
  report: 'report-terminal-tests.html',
});

let driver, page;

// collect all tests into one function to call it once every time
function TestingWithCurrentSettings() {
  representationTests.RepresentationTests();
  colourTests.ColourTests();
  materialTests.MaterialTests();
  modeParamsTests.ModeParamsTests();
  selectorTests.SelectorTests();
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

// run tests for settings by default
  describe('use standard settings during testing', function() {

// we need a molecule to experiment at, we upload it here
// and more important, we need to open the terminal
    it('load 1AID with an appropriate orientation, scale and settings', function() {
      return page.openTerminal()
        .then(() => page.runScript(`\
set interpolateViews false
load 1AID
view "18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ=="`))
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid', this));
    });

// run tests on the current molecule
// I believe we shall change a molecule during testing few times
    describe('start testing with current settings', function() {
      TestingWithCurrentSettings();
    });
  });

// well, just repeat all we have done before but with changed palette
  describe.skip('use VMD palette colours during testing', function() {

    it('load 1AID with an appropriate orientation, scale and settings', function() {
      return page.openTerminal()
        .then(() => page.runScript(`\
set interpolateViews false
set palette VM
load 1AID
view "18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ=="`))
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid', this));
    });

    describe('start testing with current settings', function() {
      TestingWithCurrentSettings();
    });
  });

// well, just repeat all we have done before but with changed background
  describe.skip('use light theme during testing', function() {

    it('load 1AID with an appropriate orientation, scale and settings', function() {
      return page.openTerminal()
        .then(() => page.runScript(`\
set interpolateViews false
set theme light
load 1AID
view "18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ=="`))
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid', this));
    });

    describe('start testing with current settings', function() {
      TestingWithCurrentSettings();
    });
  });

// well, just repeat all we have done before but without a fog
  describe.skip('use fog absence during testing', function() {

    it('load 1AID with an appropriate orientation, scale and settings', function() {
      return page.openTerminal()
        .then(() => page.runScript(`\
set interpolateViews false
set fog false
load 1AID
view "18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ=="`))
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid', this));
    });

    describe('start testing with current settings', function() {
      TestingWithCurrentSettings();
    });
  });

// well, just repeat all we have done before but with ambient occlusion
// somewhere near here user you must know that for some reason we can not
// fixate more than 999 images. You can fix it swiftly hopefully...
  describe.skip('use ambient occlusion during testing', function() {

    it('load 1AID with an appropriate orientation, scale and settings', function() {
      return page.openTerminal()
        .then(() => page.runScript(`\
set interpolateViews false
set ao true
load 1AID
view "18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ=="`))
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid', this));
    });

    describe('start testing with current settings', function() {
      TestingWithCurrentSettings();
    });
  });

// well, just repeat all we have done before but with clip plane on
  describe.skip('use clip plane during testing', function() {

    it('load 1AID with an appropriate orientation, scale and settings', function() {
      return page.openTerminal()
        .then(() => page.runScript(`\
set interpolateViews false
set draft.clipPlane true
load 1AID
view "18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ=="`))
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid', this));
    });

    describe('start testing with current settings', function() {
      TestingWithCurrentSettings();
    });
  });
});

// Hail to the ES6! Hail to the looped links!
export {driver, page};
