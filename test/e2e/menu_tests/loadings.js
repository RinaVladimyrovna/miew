import {driver, page} from '../menu.e2e';
import {until} from 'selenium-webdriver';
import {menu} from './adds';
import _ from 'lodash';
import golden from '../golden';
import identifiers from '../static';
////////////////////////////////////////////////////
//Takes addresses from static.js and tries to load//
//every listed molecule using Menu -> Load tab    //
////////////////////////////////////////////////////
exports.LoadingTests = function() {
// run tests for loading
  describe('Start checking available sources, e. g.', function() {

    let suite = this;

    before(function() {
// we want to know all source and molecule names beforehand
      let loads = identifiers.loadList;
      _.each(loads, (load) => {
        suite.addTest(it(`${load.source}`, function() {
          return driver.wait(until.elementLocated(menu.openButton), 5 * 1000)
            .then(() => driver.findElement(menu.openButton).click())
            .then(() => driver.findElement(menu.loadTab).click())
            .then(() => driver.wait(until.elementLocated(menu.loadField), 5 * 1000))
            .then(() => driver.findElement(menu.loadField).sendKeys(`${load.link}`))
            .then(() => driver.wait(until.elementLocated(menu.loadOpenButton)))
            .then(() => driver.findElement(menu.loadOpenButton).click())
            .then(() => page.waitUntilTitleContains(`${load.moleculeId}`))
            .then(() => page.waitUntilRebuildIsDone())
            .then(() => golden.shouldMatch(`${load.format}`, this));
        }));
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
