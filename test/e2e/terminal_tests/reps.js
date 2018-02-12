// import all we need
import _ from 'lodash';
import golden from '../golden';
import {page} from '../rep.e2e';
import {expect} from 'chai';

exports.RepresentationTests = function() {
// run tests for mode type + colorer type pairs
// yes, we have another manner to change colour and mode
// we have three in total. Menu, Display buttons, the terminal.
// these test set is for terminal
  describe('assign all combinations of modes and colorers via terminal, i.e.', function() {

    let retrieve = {};
    const suite = this;

// good old legacy function
// better get rid of it to prevent missing something in case there is a misprint in the code.
// Better to use our static file with our misprints we can correct at any moment.
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

    before(function() {
// use old legacy function to make up mode + colorer pairs
      return Promise.all([retrieve.modes, retrieve.colorers]).then(([modes, colorers]) => {
        _.each(modes, (mode) => {
          _.each(colorers, (colorer) => {
// create test for every pair
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

// pay attention to the fact we do not load a new molecule here
// we only change a representation mode for it
// but we still use a molecule loaded in the main file (rep.e2e.js)
// so do not make mistakes with that inconvenience
    it('apply "small" preset', function() {
      return page.runScript('preset small')
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_BS_EL', this));
    });
  });
};
