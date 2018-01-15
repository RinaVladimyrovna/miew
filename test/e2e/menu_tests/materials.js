import {By, until} from 'selenium-webdriver';
import golden from '../golden';
import {driver, page} from '../menu.e2e';
import {menu, fillInArray} from './adds';
import identifiers from '../static';
import _ from 'lodash';
/////////////////////////////////////////////////////////////
//Uses the same construction as in the terminal tests.     //
//Switches material via Menu -> Representations -> Material//
/////////////////////////////////////////////////////////////
describe('Statr checking materials', function() {

  let suite = this;

  before(function() {
    let materials = fillInArray(menu.materialNames, identifiers.materialIdentifiers);
    _.each(materials, (material) => {
      suite.addTest(it(`checking ${material.identifier}`, function() {
        return driver.wait(until.elementLocated(menu.openButton), 5 * 1000)
          .then(() => driver.findElement(menu.openButton).click())
          .then(() => driver.findElement(menu.representationTab).click())
          .then(() => driver.wait(until.elementLocated(menu.materialTab), 5 * 1000))
          .then(() => driver.findElement(menu.materialTab).click())
          .then(() => driver.findElement(material.css).click())
          .then(() => driver.findElement(menu.closeButton).click())
          .then(() => page.waitUntilRebuildIsDone())
          .then(() => golden.shouldMatch(`1aid_QS_EL_${material.identifier}`, this));
      }));
    });
  });

  it('load apropriate molecule structure', function() {
    return driver.get(`http://localhost:8008/?l=1AID&r=0&m=QS!scale:1,isoValue:0.5&r=1&s=all&m=BS&c=EL&mt=SF&v=18KeRwuF6IsJGtmPAkO9IPZrOGD9xy0I/ku/APQ%3D%3D&interpolateViews=false`)
      .then(() => page.waitUntilTitleContains('1AID'))
      .then(() => page.waitUntilRebuildIsDone())
      .then(() => golden.shouldMatch('1aid_QS_EL', this));
  });
});