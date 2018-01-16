import chai from 'chai';
import dirtyChai from 'dirty-chai';
import {createDriverInstance} from './driver';
import MiewPage from './pages/miew.page';
import golden from './golden';
import goldenCfg from './golden.cfg';

chai.use(dirtyChai);

const cfg = Object.assign({}, goldenCfg, {
  title: 'Representations Tests',
  report: 'report-terminal-tests.html',
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

  it('load 1AID with an appropriate orientation and scale', function() {
    return page.openTerminal()
      .then(() => page.runScript(`\
set interpolateViews false
load 1AID
view "18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ=="`))
      .then(() => page.waitUntilTitleContains('1AID'))
      .then(() => page.waitUntilRebuildIsDone())
      .then(() => golden.shouldMatch('1aid', this));
  });

  describe('reps', function() {
    require('./terminal_tests/reps');
  });

  describe('color params', function() {
    require('./terminal_tests/color_params');
  });

  describe('materials', function() {
    require('./terminal_tests/materials');
  });

  describe('mode_params', function() {
    require('./terminal_tests/mode_params');
  });

  describe('selectors', function() {
    require('./terminal_tests/selectors');
  });

  describe('loading', function() {
    require('./terminal_tests/loading');
  });
});

export {driver, page};
