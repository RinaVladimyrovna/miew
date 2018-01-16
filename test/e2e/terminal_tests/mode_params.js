import _ from 'lodash';
import staticConf from '../static';
import golden from '../golden';
import {page} from '../rep.e2e';

describe('check correct mode parameters work', function() {

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
