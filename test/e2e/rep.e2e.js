import chai from 'chai';
import dirtyChai from 'dirty-chai';
import {createDriverInstance} from './driver';
import MiewPage from './pages/miew.page';
import golden from './golden';
import goldenCfg from './golden.cfg';

chai.use(dirtyChai);

var representationTests = require('./terminal_tests/reps'),
  colourTests = require('./terminal_tests/color_params'),
  materialTests = require('./terminal_tests/materials'),
  modeParamsTests = require('./terminal_tests/mode_params'),
  selectorTests = require('./terminal_tests/selectors'),
  loadingTests = require('./terminal_tests/loading');

const cfg = Object.assign({}, goldenCfg, {
  title: 'Representations Tests',
  report: 'report-terminal-tests.html',
});

let driver, page;

function TestingWithCurrentSettings() {
  representationTests.RepresentationTests();
  colourTests.ColourTests();
  materialTests.MaterialTests();
  modeParamsTests.ModeParamsTests();
  selectorTests.SelectorTests();
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

  describe('use standard settings during testing', function() {

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

    describe('start testing with current settings', function() {
      TestingWithCurrentSettings();
    });
  });

  describe('use VMD palette colours during testing', function() {

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

  describe('use light theme during testing', function() {

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

  describe('use fog absence during testing', function() {

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

  describe('use ambient occlusion during testing', function() {

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

  describe('use clip plane during testing', function() {

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

export {driver, page};
