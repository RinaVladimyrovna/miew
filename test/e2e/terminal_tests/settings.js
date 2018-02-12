// import all we need
import _ from 'lodash';
import staticConf from '../static';
import golden from '../golden';
import {page} from '../rep.e2e';

exports.SettingsTests = function() {
// run tests for mode parameters a-la atom size, ribbon width
  describe('use diffenet settings combinations', function() {

    const suite = this;

    before(function() {
// take all values we need from static file
// we need static file. Just imaging the situation when
// something is amiss in the code. In that case if we were to take
// commands from the code we would miss something too.
      _.each(staticConf.modeSettings, (mode) => {
        _.each(mode.settingNames, (setCommand) => {
// create a test for every mode type + command pair
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

// do not forget to make a ground (molecule) to experiment on beforehand
    it('let us take a smaller part of the molecule for tests', function() {
      return page.runScript(`\
  clear
  load "mmtf:1aid"
  preset small
  view "18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ=="
  selector "chain B"`)
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_B_small', this));
    });
  });
};
