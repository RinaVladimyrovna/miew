import _ from 'lodash';
import golden from '../golden';
import {page} from '../rep.e2e';
import {expect} from 'chai';

describe('assign all materials via terminal, i.e.', function() {

  const suite = this;
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
        console.log(retrieve);
      });
    });
  });

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
});
