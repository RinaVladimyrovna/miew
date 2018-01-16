import golden from '../golden';
import {driver, page} from '../menu.e2e';
import {fillInArray, modeColorDisplay, display} from './adds';
import identifiers from '../static';
import _ from 'lodash';
////////////////////////////////////////////////////////////////////////////
//Loads 1AID in the same state as in the terminal tests and creates tests //
//for mode + color pairs. Uses display buttons to switch mode and/or color//
////////////////////////////////////////////////////////////////////////////
describe('Start checking combinations', function() {

  let suite = this;

  before(function() {
    let modes = fillInArray(display.modeNames, identifiers.modeIdentifiers);
    let colours = fillInArray(display.colorNames, identifiers.colorIdentifiers);
    _.each(modes, (mode) => {
      _.each(colours, (colour, index) => {
        if (index > 0) {
          suite.addTest(it(`checking ${colour.identifier} color and ${mode.identifier} mode pair`, function() {
            return modeColorDisplay(1, colour, mode);
          }));
        } else {
          suite.addTest(it(`checking ${colour.identifier} color and ${mode.identifier} mode pair`, function() {
            return modeColorDisplay(0, colour, mode);
          }));
        }
      });
    });
  });

  it('use prearranged URL', function() {
    return driver.get('http://localhost:8008/?l=1AID&p=small&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false')
      .then(() => page.waitUntilTitleContains('1AID'))
      .then(() => page.waitUntilRebuildIsDone())
      .then(() => golden.shouldMatch('1aid_BS_EL', this));
  });
});
