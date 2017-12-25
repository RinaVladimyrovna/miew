import chai, {expect} from 'chai';
import dirtyChai from 'dirty-chai';
import _ from 'lodash';
import staticConf from './static';
import {createDriverInstance} from './driver';
import MiewPage from './pages/miew.page';
import golden from './golden';

chai.use(dirtyChai);

import goldenCfg from './golden.cfg';

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

  let retrieve = {};
  [
    ['modes', 'BS'],
    ['colorers', 'EL'],
    ['materials', 'SF'],
  ].forEach(([listName, sampleId]) => {
    it(`retrieve a list of ${listName} including "${sampleId}"`, function() {
      retrieve[listName] = page.getValueFor(`miew.constructor.${listName}.descriptions`);
      return retrieve[listName].then((list) => {
        expect(list).to.be.an('Array');
        expect(list).to.be.not.empty();
        _.each(list, (entry) => {
          expect(entry).to.include.all.keys(['id', 'name']);
        });
        expect(_.map(list, entry => entry.id)).to.include(sampleId);
      });
    });
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

  describe('assign all combinations of modes and colorers via terminal, i.e.', function() {

    it('apply "small" preset', function() {
      return page.runScript('preset small')
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_BS_EL', this));
    });

    const suite = this;
    before(function() {
      return Promise.all([retrieve.modes, retrieve.colorers]).then(([modes, colorers]) => {
        _.each(modes, (mode) => {
          _.each(colorers, (colorer) => {
            const command = `clear\nrep 0 m=${mode.id} c=${colorer.id}`;
            suite.addTest(it(`set ${mode.name} mode with ${colorer.name} coloring`, function() {
              return page.runScript(command)
                .then(() => page.waitUntilTitleContains('1AID'))
                .then(() => page.waitUntilRepresentationIs(0, mode.id, colorer.id))
                .then(() => golden.shouldMatch(`1aid_${mode.id}_${colorer.id}`, this));
            }));
          });
        });
      });
    });
  });

  describe('check correct colour parameters work', function() {

    it('apply "small" preset', function() {
      return page.runScript('preset small')
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_BS_EL', this));
    });

    const suite = this;
    before(function() {
      _.each(staticConf.colourSettings, (colour) => {
        _.each(colour.settingNames, (setCommand) => {
          const command = `clear\nmode BS\ncolor ${colour.colorId} ${setCommand}`;
          suite.addTest(it(`set ${setCommand} for ${colour.colorId}`, function() {
            return page.runScript(command)
              .then(() => page.waitUntilTitleContains('1AID'))
              .then(() => page.waitUntilRepresentationIs(0, 'BS', colour.colorId))
              .then(() => golden.shouldMatch(`1aid_${colour.colorId}_${setCommand.split(/\W+/)[1]}`, this));
          }));
        });
      });
    });
  });

  describe('assign all materials via terminal, i.e.', function() {

    it('apply "small" preset', function() {
      return page.runScript('preset small')
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_BS_EL', this));
    });

    it('add a surface', function() {
      return page.runScript('add m=QS')
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_QS_EL', this));
    });

    const suite = this;
    before(function() {
      return retrieve.materials.then((materials) => {
        _.each(materials, (material) => {
          const command = `clear\nrep 1 m=QS mt=${material.id}`;
          suite.addTest(it(`set ${material.name} material`, function() {
            return page.runScript(command)
              .then(() => page.waitUntilTitleContains('1AID'))
              .then(() => page.waitUntilRepresentationIs(1, 'QS', 'EL'))
              .then(() => golden.shouldMatch(`1aid_QS_EL_${material.id}`, this));
          }));
        });
      });
    });
  });

  describe('check correct mode parameters work', function() {

    it('let us take a smaller part of the molecule for tests', function() {
      return page.runScript(`\
clear\nload "mmtf:1aid"
preset small
view "18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ=="
selector "chain B"`)
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_B_small', this));
    });

    const suite = this;
    before(function() {
      _.each(staticConf.modeSettings, (mode) => {
        _.each(mode.settingNames, (setCommand) => {
          const command = `clear\ncolor ${mode.colorId}\nmode ${mode.modeId} ${setCommand}`;
          suite.addTest(it(`set ${setCommand} for ${mode.modeId}`, function() {
            return page.runScript(command)
              .then(() => page.waitUntilTitleContains('1AID'))
              .then(() => page.waitUntilRepresentationIs(0, mode.modeId, mode.colorId))
              .then(() => golden.shouldMatch(`1aid_${mode.modeId}_${setCommand.split(/\s\W+/)[0]}`, this));
          }));
        });
      });
    });
  });

  describe('assign all combinations of seltors and modes via terminal, i. e.', function() {
    describe('aminoacidic, none, hetatm, name, elem, residue, altloc, hydrogenic', function() {
      it('load 5VHG with an appropriate orientation and scale', function() {
        return page.openTerminal()
          .then(() => page.runScript(`\
clear\n
set interpolateViews false
load 5vhg
remove 1
view "1S4GJwX0/TcFCYCLBwi4aPQAAAAAAAACAAAAAgA=="`))
          .then(() => page.waitUntilTitleContains('5VHG'))
          .then(() => page.waitUntilRebuildIsDone())
          .then(() => golden.shouldMatch('5vhg', this));
      });

      const suite = this;
      before(function() {
        return Promise.all([retrieve.modes, staticConf.selectorList]).then(([modes, selectors]) => {
          _.each(modes, (mode) => {
            _.each(selectors, (selector) => {
              const command = `clear\nrep 0 m=${mode.id} s="${selector}" c=RT`;
              suite.addTest(it(`set ${mode.name} mode with ${selector} selection`, function() {
                return page.runScript(command)
                  .then(() => page.waitUntilTitleContains('5VHG'))
                  .then(() => page.waitUntilRepresentationIs(0, mode.id, 'RT'))
                  .then(() => golden.shouldMatch(`5vhg_${mode.id}_${selector.split(/\s\w+/)[0]}`, this));
              }));
            });
          });
        });
      });
    });

    describe('serial, sequence, chain, nucleic, purine, pyrimidine', function() {
      it('load 1UTF with an appropriate orientation and scale', function() {
        return page.openTerminal()
          .then(() => page.runScript(`\
clear\n
set interpolateViews false
load 1utf
remove 1
view "1g9IOwe1yGb6xlIzCvSyiPOsKW7y4hzU/3MgGvg=="`))
          .then(() => page.waitUntilTitleContains('1UTF'))
          .then(() => page.waitUntilRebuildIsDone())
          .then(() => golden.shouldMatch('1utf', this));
      });

      const suite = this;
      before(function() {
        return Promise.all([retrieve.modes, staticConf.colomnSelectors]).then(([modes, selectors]) => {
          _.each(modes, (mode) => {
            _.each(selectors, (selector) => {
              const command = `clear\nrep 0 m=${mode.id} s="${selector.name}${selector.val}" c=${selector.colorId}`;
              suite.addTest(it(`set ${mode.name} mode with ${selector.name} selection`, function() {
                return page.runScript(command)
                  .then(() => page.waitUntilTitleContains('1UTF'))
                  .then(() => page.waitUntilRepresentationIs(0, mode.id, selector.colorId))
                  .then(() => golden.shouldMatch(`1utf_${mode.id}_${selector.name}`, this));
              }));
            });
          });
        });
      });
    });
  });
});
