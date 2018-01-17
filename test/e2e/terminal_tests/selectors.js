import _ from 'lodash';
import {expect} from 'chai';
import staticConf from '../static';
import golden from '../golden';
import {page} from '../rep.e2e';

exports.SelectorTests = function() {
  describe('assign all combinations of seltors and modes via terminal, i. e.', function() {

    let retrieve = {};

    before(function() {
      [
        ['modes', 'BS'],
        ['colorers', 'EL'],
        ['materials', 'SF'],
      ].forEach(([listName, sampleId]) => {
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

    describe('aminoacidic, none, hetatm, name, elem, residue, altloc, hydrogenic', function() {

      const suite = this;

      before(function() {
        return Promise.all([retrieve.modes, staticConf.vhgSelectors]).then(([modes, selectors]) => {
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

      it('load 5VHG with an appropriate orientation and scale', function() {
        return page.openTerminal()
          .then(() => page.runScript(`\
  clear
  load 5vhg
  remove 1
  view "1S4GJwX0/TcFCYCLBwi4aPQAAAAAAAACAAAAAgA=="`))
          .then(() => page.waitUntilTitleContains('5VHG'))
          .then(() => page.waitUntilRebuildIsDone())
          .then(() => golden.shouldMatch('5vhg', this));
      });
    });

    describe('serial, sequence, chain, nucleic, purine, pyrimidine', function() {

      const suite = this;

      before(function() {
        return Promise.all([retrieve.modes, staticConf.egkSelectors]).then(([modes, selectors]) => {
          _.each(modes, (mode) => {
            _.each(selectors, (selector) => {
              const command = `clear\nrep 0 m=${mode.id} s="${selector.name}" c=${selector.colorId}`;
              suite.addTest(it(`set ${mode.name} mode with ${selector.name} selection`, function() {
                return page.runScript(command)
                  .then(() => page.waitUntilTitleContains('1EGK'))
                  .then(() => page.waitUntilRepresentationIs(0, mode.id, selector.colorId))
                  .then(() => golden.shouldMatch(`1egk_${mode.id}_${selector.name.split(/\s\w+/)[0]}`, this));
              }));
            });
          });
        });
      });

      it('load 1EGK with an appropriate orientation and scale', function() {
        return page.openTerminal()
          .then(() => page.runScript(`\
  clear
  load "mmtf:1egk"
  remove 1
  view "1phhnwNej58H4SfBB3HjrPHDAbj7JfwHAbBkxvg=="`))
          .then(() => page.waitUntilTitleContains('1EGK'))
          .then(() => page.waitUntilRebuildIsDone())
          .then(() => golden.shouldMatch('1egk', this));
      });
    });
  });
};
