import {driver, page} from '../menu.e2e';
import {menu, modeColorPairs, fillInArray} from './adds';
import golden from '../golden';
import _ from 'lodash';
import identifiers from '../static';
//////////////////////////////////////////////////////////
//Uses Menu -> Representations to switch mode and color.//
//Makes up mode + color pairs and pictures every pair.  //
//////////////////////////////////////////////////////////
describe('Start checking combinations', function() {

  let suite = this;

  before(function() {
    let modes = fillInArray(menu.modeNames, identifiers.modeIdentifiers);
    let colours = fillInArray(menu.colorNames, identifiers.colorIdentifiers);
    _.each(modes, (mode) => {
      _.each(colours, (colour, index) => {
        if (index > 0) {
          suite.addTest(it(`checking ${colour.identifier} color with ${mode.identifier} mode`, function() {
            return modeColorPairs(1, colour, mode);
          }));
        } else {
          suite.addTest(it(`checking ${colour.identifier} color with ${mode.identifier} mode`, function() {
            return modeColorPairs(0, colour, mode);
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
