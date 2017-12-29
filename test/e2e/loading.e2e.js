import chai from 'chai';
import dirtyChai from 'dirty-chai';
import _ from 'lodash';
import staticConf from './static';
import {createDriverInstance} from './driver';
import MiewPage from './pages/miew.page';
import golden from './golden';

chai.use(dirtyChai);

import goldenCfg from './golden.cfg';

const cfg = Object.assign({}, goldenCfg, {
  title: 'Molecule loading Tests',
  report: 'report-loadings.html',
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

  describe('have an opportunity to load molecule from different sources, e. g.', function() {

    it('load a molecule with an appropriate orientation', function() {
      return page.openTerminal()
        .then(() => page.runScript('set interpolateViews false'))
        .then(() => page.waitUntilTitleContains('1CRN'))
        .then(() => page.waitUntilRebuildIsDone());
    });

    const suite = this;
    before(function() {
      _.each(staticConf.loadList, (loads) => {
        suite.addTest(it(`load a molecule from ${loads.source} in ${loads.format} format`, function() {
          return page.runScript(`load "${loads.link}"\nview "${loads.view}"`)
            .then(() => page.waitUntilTitleContains(`${loads.moleculeId}`))
            //.then(() => page.waitUntilRebuildIsDone())
            .then(() => golden.shouldMatch(`${loads.moleculeId}`, this));
        }));
      });
    });
  });
});
