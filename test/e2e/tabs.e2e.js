import chai, {expect} from 'chai';
import dirtyChai from 'dirty-chai';
import {createDriverInstance} from './driver';
import MiewPage from './pages/miew.page';
import golden from './golden';
import goldenCfg from './golden.cfg';
import {locator, completeArray} from './tabs_tests/tabs_locators';
import {until, By} from 'selenium-webdriver';
import _ from 'lodash';

chai.use(dirtyChai);

const cfg = Object.assign({}, goldenCfg, {
  title: 'Tabs Tests',
  report: 'tabs-containment-tests.html',
});

let driver, page;

function getDescenders(rootElement, xPath) {
  let descendents = [];
  return driver.findElement(rootElement).findElements(xPath)
    .then((result) => {
      descendents = result;
      return descendents;
    });
}

function getElementsText(elementsToIterate) {
  let textsArray = [];
  elementsToIterate.forEach((elem) => elem.getText().then((elemText) => textsArray.push(elemText)));
  return textsArray;
}

function getHtmlElementValue(htmlElement) {
  return htmlElement.getAttribute('innerText').then((value) => value);
};

function getHtmlElementVisiability(htmlElement) {
  return htmlElement.isDisplayed().then((result) => console.log(result));
};
/////////////////////////////////////////////////////////////
function takeElementsText(elementToTakeTextOf) {
  let singleElementText = elementToTakeTextOf.getAttribute('innerText');
  return singleElementText;
}

function findElementsFirstDescendents(elementToFindDescendentsOf) {
  return elementToFindDescendentsOf.findElements(By.xpath('./*'))
    .then((firstStageDescendents) => {
      let descendents = [];
      descendents = descendents.concat(firstStageDescendents);
      return descendents;
    });
}

function takeEveryDescentsText(elementToOperateOn) {
  return findElementsFirstDescendents(elementToOperateOn)
    .then((firstStateDescendents) => {
      let descendentsText = [];
      firstStateDescendents.forEach((descendent) => {
        return takeElementsText(descendent)
          .then((singleDescendentText) => descendentsText.push(singleDescendentText));
      });
      return descendentsText;
    });
}

function replaceOriginalElementsTextParts(originalElement) {
  let originalElementText;
  return takeElementsText(originalElement)
    .then((singleElementText) => {
      originalElementText = singleElementText;
      return takeEveryDescentsText(originalElement);
    })
    .then((everyDescentsText) => {
      everyDescentsText.map((descentText) => {
        originalElementText = originalElementText.replace(descentText, '');
      });
      //console.log(1, originalElementText);
      return originalElementText;
    });
}

function getAllDescentElementsUniqueText(elementsArrayToIterateIn) {
  let resultString = [];
  elementsArrayToIterateIn.forEach((singleElement) => {
    return replaceOriginalElementsTextParts(singleElement)
      .then((result) => resultString.push(result));
  });
  return resultString;
}
///////////////////////////////////////////////////////////////////
describe('As a power user, I want to check menu functionality, e. g.', function() {

  this.timeout(0);
  this.slow(1000);

  before(function() {
    driver = createDriverInstance();
    return golden.startup(driver, cfg)
      .then((url) => {
        page = new MiewPage(driver, url);
        return page.waitForMiew();
      })
      .then((version) => {
        golden.report.data.version = version;
      });
  });

  after(function() {
    return golden.shutdown();
  });

  beforeEach(function() {
    golden.report.context.desc = this.currentTest.title;
  });

  it('see 1CRN by default', function() {
    return page.waitUntilTitleContains('1CRN')
      .then(() => page.waitUntilRebuildIsDone())
      .then(() => golden.shouldMatch('1crn', this));
  });

  it('have Menu button visible', function() {
    return driver.wait(until.elementLocated(locator.openMenuButton), 5 * 1000)
      .then(() => driver.findElement(locator.openMenuButton).isDisplayed())
      .then((state) => expect(state).to.equal(true));
  });

  let tabs = completeArray(locator.leftPanel.tabs.selector, locator.leftPanel.tabs.names);

  describe('have all tabs visible', function() {

    let suite = this;

    before(function() {
      tabs.forEach((tab) => {
        suite.addTest(it(`${tab.name} is displayed`, function() {
          return driver.findElement(tab.css).isDisplayed()
            .then((state) => expect(state).to.equal(true));
        }));
      });
    });

    it('see Info tab after Menu is opend', function() {
      return driver.findElement(locator.openMenuButton).click()
        .then(() => driver.wait(until.elementLocated(locator.leftPanel.css), 5 * 1000))
        .then(() => driver.findElement(tabs[0].css).getAttribute('class'))
        .then((attribute) => expect(attribute.split(/\s/).slice(-1)[0]).to.equal('active'));
    });

  });

  describe('Info panel', function() {

    let suite = this;

    before(function() {
      _.each(locator.infoPanel.body.descendent.xPath, (xPath, index) => {
        suite.addTest(it(`get Info panel body descendents text ${index}`, function() {
          return getDescenders(locator.infoPanel.body.css, xPath)
            .then((descendentArray) => getElementsText(descendentArray))
            .then((array) => _.isEqual(array, locator.infoPanel.body.descendent.innerText[index]))
            .then((result) => expect(result).to.be.equal(true));
        }));
      });
    });

    it('check Info panel total text length', function() {
      return driver.findElement(locator.infoPanel.panel.css).getText()
        .then((panelText) => {
          //console.log(panelText);
          expect(panelText.length).to.equal(locator.infoPanel.panel.textLength);
        });
    });

  });

  describe('Load panel', function() {

    let suite = this;

    before(function() {
      _.each(locator.loadPanel.body.descendent.xPath, (xPath, index) => {
        suite.addTest(it(`get Load panel body descendents text ${index}`, function() {
          return getDescenders(locator.loadPanel.body.css, xPath)
            .then((descendentArray) => getElementsText(descendentArray))
            .then((array) => _.isEqual(array, locator.loadPanel.body.descendent.innerText[index]))
            .then((result) => expect(result).to.be.equal(true));
        }));
      });
    });

    it('open Load panel', function() {
      return driver.findElement(tabs[1].css).click()
        .then(() => driver.findElement(tabs[1].css).getAttribute('class'))
        .then((attribute) => expect(attribute.split(/\s/).slice(-1)[0]).to.equal('active'));
    });
//hidden cancel button? disabled load button?
    it('check Load panel total text length', function() {
      return driver.findElement(locator.loadPanel.panel.css).getText()
        .then((panelText) => {
          //console.log(panelText);
          expect(panelText.length).to.equal(locator.loadPanel.panel.textLength);
        });
    });

  });

  describe('Representations panel', function() {

    let suite = this;

    before(function() {
      _.each(locator.representationsPanel.body.descendent.xPath, (xPath, index) => {
        suite.addTest(it(`get Representations panel body descendents text ${index}`, function() {
          return getDescenders(locator.representationsPanel.body.css, xPath)
            .then((descendentArray) => getElementsText(descendentArray))
            .then((array) => {
              //console.log(array);
              return _.isEqual(array, locator.representationsPanel.body.descendent.innerText[index]);
            })
            .then((result) => expect(result).to.be.equal(true));
        }));
      });
    });

    it('open Representations panel', function() {
      return driver.findElement(tabs[2].css).click()
        .then(() => driver.findElement(tabs[2].css).getAttribute('class'))
        .then((attribute) => expect(attribute.split(/\s/).slice(-1)[0]).to.equal('active'));
    });
//deprecate///////////////////////////
    it.skip('check Representations panel total text length', function() {
      return driver.findElement(locator.representationsPanel.panel.css).getText()
        .then((panelText) => panelText.replace(/\n/g, ''))
        .then((oneString) => oneString.replace(/\s+/g, ''))
        .then((string) => expect(string.length).to.equal(locator.representationsPanel.panel.textLength));
    });
/////////////////////////////////////////////
    it('compare all descendents', function() {
      return driver.findElement(locator.representationsPanel.panel.css).findElements(By.xpath('.//*'))
        .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
        .then((resultArray) => {
          let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
          return resultString;
        })
        .then((result) => expect(result).to.be.equal(locator.representationsPanel.panel.summary));
    });
  });
});

/*create tests that check tabs elements presence and their containment:
//may be make up a function(tabName, tabSelector, elementSelectors, elementText)???
  describe('corresponding tab', function() {})
    //it('open that tab', function() {}); done
    //it('check whether every tab sign contains right name', function() {}); done
    //it('check every panel has corresponding number of descendents', function() {}); why?
    //it('check every elements needed are visible', function() {}); to do
    //it('check every element is located at the right place', function() {}); manually
    //it('check every element has the right size', function() {});??? negative

//create tests that check tabs elements size and location if needed??? Or is it part of unit tests?*/
