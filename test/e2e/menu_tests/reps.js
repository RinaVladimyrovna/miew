// import all we need
import {driver, page} from '../menu.e2e';
import {menu, modeColorPairs, fillInArray} from './adds';
import golden from '../golden';
import _ from 'lodash';
import identifiers from '../static';
//////////////////////////////////////////////////////////
//Uses Menu -> Representations to switch mode and color.//
//Makes up mode + color pairs and pictures every pair.  //
//////////////////////////////////////////////////////////
exports.RepresentationTests = function() {
// run tests for color and mode pairs
  describe('Start checking combinations', function() {

    let suite = this;

    before(function() {
// before tests we want to know all colour names and all mode names
      let modes = fillInArray(menu.modeNames, identifiers.modeIdentifiers);
      let colours = fillInArray(menu.colorNames, identifiers.colorIdentifiers);
// create a test for every pair
      _.each(modes, (mode) => {
        _.each(colours, (colour, index) => {
// change color type only when mode type have already been chosen
          if (index > 0) {
            suite.addTest(it(`checking ${colour.identifier} color with ${mode.identifier} mode`, function() {
              return modeColorPairs(1, colour, mode);
            }));
          } else {
// do not forget to change a mode type in case when no color types have been chosen yet or all color types have been chosen already
            suite.addTest(it(`checking ${colour.identifier} color with ${mode.identifier} mode`, function() {
              return modeColorPairs(0, colour, mode);
            }));
          }
        });
      });
    });

// we need a molecule to colour it. We can use Menu -> Load but link is faster (do not forget that IE is slo-ow)
    it('use prearranged URL', function() {
// need to get port and host from golden or golden.cfg to prevent host/port replacing by hand
      return driver.get('http://localhost:8008/?l=1AID&p=small&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false')
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_BS_EL', this));
    });
  });
};
