import _ from 'lodash';
import staticConf from '../static';
import golden from '../golden';
import {page} from '../rep.e2e';

describe('check correct colour parameters work', function() {

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

  it('apply "small" preset', function() {
    return page.runScript('preset small')
      .then(() => page.waitUntilTitleContains('1AID'))
      .then(() => page.waitUntilRebuildIsDone())
      .then(() => golden.shouldMatch('1aid_BS_EL', this));
  });
});
