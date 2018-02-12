// import all we need
import _ from 'lodash';
import golden from '../golden';
import {page} from '../rep.e2e';
import {expect} from 'chai';

exports.MaterialTests = function() {
// run material test set
  describe('assign all materials via terminal, i.e.', function() {

    const suite = this;
    let retrieve = {};

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
      return retrieve.materials.then((materials) => {
// use old legacy function to list all materials
        _.each(materials, (material) => {
// create a test for every material
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

// pay attention to the fact we do not load a new molecule here
// we only add a representation for it to have an opportunity to
// change material for one of them an see another in case of 
// trancparency of the former
// but we still use a molecule loaded in the main file (rep.e2e.js)
// so do not make mistakes with that inconvenience
    it('add a surface', function() {
      return page.runScript('add m=QS')
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_QS_EL', this));
    });
  });
};
