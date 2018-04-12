// import all we need
import {until} from 'selenium-webdriver';
import golden from '../golden';
import {driver, page} from '../menu.e2e';
import {menu, fillInArray} from './adds';
import identifiers from '../static';
import _ from 'lodash';
/////////////////////////////////////////////////////////////
//Uses the same construction as in the terminal tests.     //
//Switches material via Menu -> Representations -> Material//
/////////////////////////////////////////////////////////////
exports.MaterialTests = function() {
// run tests for materials
  describe('Statr checking materials', function() {

    let suite = this;

    before(function() {
// we want to know all materials names beforehand
      let materials = fillInArray(menu.materialNames, identifiers.materialIdentifiers);
// create a test for every material
      _.each(materials, (material) => {
        suite.addTest(it(`checking ${material.identifier}`, function() {
          return driver.wait(until.elementLocated(menu.openButton), 5 * 1000, "Can not find Menu button, sorry")
            .then(() => driver.findElement(menu.openButton).click())
            .then(() => driver.findElement(menu.representationTab).click())
            .then(() => driver.wait(until.elementLocated(menu.materialTab), 5 * 1000, "Can not find Material tab, please open it for me"))
            .then(() => driver.findElement(menu.materialTab).click())
            .then(() => driver.findElement(material.css).click())
            .then(() => driver.findElement(menu.closeButton).click())
            .then(() => page.waitUntilRebuildIsDone())
            .then(() => golden.shouldMatch(`1aid_QS_EL_${material.identifier}`, this));
        }));
      });
    });

// we need a molecule to colour it. We can use Menu -> Load but link is faster (do not forget that IE is slo-ow)
    it('load apropriate molecule structure', function() {
      return driver.get('http://localhost:8008/?l=1AID&r=0&m=QS!scale:1,isoValue:0.5&r=1&s=all&m=BS&c=EL&mt=SF&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false')
        .then(() => page.waitUntilTitleContains('1AID'))
        .then(() => page.waitUntilRebuildIsDone())
        .then(() => golden.shouldMatch('1aid_QS_EL', this));
    });
  });
};
