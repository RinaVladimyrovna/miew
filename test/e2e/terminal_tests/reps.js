import _ from 'lodash';
import golden from '../golden';
import {page} from '../rep.e2e';
import {expect} from 'chai';

describe('assign all combinations of modes and colorers via terminal, i.e.', function() {

  let retrieve = {};
  const suite = this;

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

  it('apply "small" preset', function() {
    return page.runScript('preset small')
      .then(() => page.waitUntilTitleContains('1AID'))
      .then(() => page.waitUntilRebuildIsDone())
      .then(() => golden.shouldMatch('1aid_BS_EL', this));
  });
});
