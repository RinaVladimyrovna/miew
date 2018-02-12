import golden from '../golden';
import {driver, page} from '../menu.e2e';
import {fillInArray, modeColorDisplay, display} from './adds';
import identifiers from '../static';
import _ from 'lodash';
////////////////////////////////////////////////////////////////////////////
//Loads 1AID in the same state as in the terminal tests and creates tests //
//for mode + color pairs. Uses display buttons to switch mode and/or color//
////////////////////////////////////////////////////////////////////////////
exports.DisplayTests = function() {
// run tests for color and mode pairs
// do not be confused. Remember those little buttons in upper right corner?
// yes, they serve the same purpose as Menu -> Representations -> Mode/Color
// and they should be tested as well
  describe('Start checking combinations', function() {

    let suite = this;

    before(function() {
// before tests we want to know all colour names and all mode names
      let modes = fillInArray(display.modeNames, identifiers.modeIdentifiers);
      let colours = fillInArray(display.colorNames, identifiers.colorIdentifiers);
// create a test for every pair
      _.each(modes, (mode) => {
        _.each(colours, (colour, index) => {
// change color type only when mode type have already been chosen
          if (index > 0) {
            suite.addTest(it(`checking ${colour.identifier} color and ${mode.identifier} mode pair`, function() {
              return modeColorDisplay(1, colour, mode);
            }));
          } else {
// do not forget to change a mode type in case when no color types have been chosen yet or all color types have been chosen already
            suite.addTest(it(`checking ${colour.identifier} color and ${mode.identifier} mode pair`, function() {
              return modeColorDisplay(0, colour, mode);
            }));
          }
        });
      });
    });

// we need a molecule to colour it. We can use Menu -> Load but link is faster (do not forget that IE is slo-ow)
    it('use prearranged URL', function() {
      return driver.get('http://localhost:8008/?l=1AID&p=small&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false')
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_BS_EL', this));
    });
  });
};
