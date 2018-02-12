// import all we need
import _ from 'lodash';
import staticConf from '../static';
import golden from '../golden';
import {page} from '../rep.e2e';

exports.ColourTests = function() {
// run tests for colorer parameters a-la subset colour, gradient change
  describe('check correct colour parameters work', function() {

    const suite = this;

    before(function() {
// take all values we need from static file
// we need static file. Just imaging the situation when
// something is amiss in the code. In that case if we were to take
// commands from the code we would miss something too.
      _.each(staticConf.colourSettings, (colour) => {
        _.each(colour.settingNames, (setCommand) => {
// create a test for every mode type + command pair
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

// pay attention to the fact we do not load a new molecule here
// we only add a representation for it to have an opportunity to
// change material for one of them an see another in case of 
// trancparency of the former
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
