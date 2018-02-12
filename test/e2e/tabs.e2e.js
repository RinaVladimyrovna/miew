// import all we need
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

// make something with those functions
function getDescenders(rootElement, xPath) {
  let descendants = [];
  return driver.findElement(rootElement).findElements(xPath)
    .then((result) => {
      descendants = result;
      return descendants;
    });
}

function getElementsText(elementsToIterate) {
  let textsArray = [];
  elementsToIterate.forEach((elem) => elem.getText().then((elemText) => textsArray.push(elemText)));
  return textsArray;
}

function getHtmlElementVisiability(htmlElement) {
  return htmlElement.isDisplayed().then((result) => console.log(result));
};
/////////////////////////////////////////////////////////////
function takeElementsText(elementToTakeTextOf) {
  let singleElementText = elementToTakeTextOf.getAttribute('innerText');
  return singleElementText;
}

function findElementsFirstDescendants(elementToFindDescendantsOf) {
  return elementToFindDescendantsOf.findElements(By.xpath('./*'))
    .then((firstStageDescendants) => {
      let descendants = [];
      descendants = descendants.concat(firstStageDescendants);
      return descendants;
    });
}

function takeEveryDescentsText(elementToOperateOn) {
  return findElementsFirstDescendants(elementToOperateOn)
    .then((firstStateDescendants) => {
      let descendantsText = [];
      firstStateDescendants.forEach((descendant) => {
        return takeElementsText(descendant)
          .then((singleDescendantText) => descendantsText.push(singleDescendantText));
      });
      return descendantsText;
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
///////is it needed???
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

    it('see Info panel after Menu is opened', function() {
      return driver.findElement(locator.openMenuButton).click()
        .then(() => driver.wait(until.elementLocated(locator.leftPanel.css), 5 * 1000))
        .then(() => driver.findElement(tabs[0].css).getAttribute('class'))
        .then((attribute) => expect(attribute.split(/\s/).slice(-1)[0]).to.equal('active'));
    });

  });

  describe('check Info panel containment', function() {

    let suite = this;

    before(function() {
      _.each(locator.infoPanel.body.descendant.xPath, (xPath, index) => {
        suite.addTest(it(`get Info panel body descendants text ${index}`, function() {
          return driver.findElement(locator.infoPanel.body.css).findElements(xPath)
            .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
            .then((resultArray) => {
              let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
              return resultString;
            })
            .then((result) => expect(result).to.be.equal(locator.infoPanel.body.descendant.innerText[index]));
        }));
            //.then((array) => _.isEqual(array, locator.infoPanel.body.descendant.innerText[index]))
            //.then((result) => expect(result).to.be.equal(true));
        //}));
      });
    });

    it('Info panel total text', function() {
      return driver.findElement(locator.infoPanel.panel.css).findElements(By.xpath('.//*'))
        .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
        .then((resultArray) => {
          let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
          return resultString;
        })
        .then((result) => expect(result).to.be.equal(locator.infoPanel.panel.summary));
    });

  });

  describe('check Load panel containment', function() {

    let suite = this;

    before(function() {
      _.each(locator.loadPanel.body.descendant.xPath, (xPath, index) => {
        suite.addTest(it(`get Load panel body descendants text ${index}`, function() {
          return driver.findElement(locator.loadPanel.body.css).findElements(xPath)
            .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
            .then((resultArray) => {
              let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
              return resultString;
            })
            .then((result) => expect(result).to.be.equal(locator.loadPanel.body.descendant.innerText[index]));
        }));
      });
    });

    it('open Load panel', function() {
      return driver.findElement(tabs[1].css).click()
        .then(() => driver.findElement(tabs[1].css).getAttribute('class'))
        .then((attribute) => expect(attribute.split(/\s/).slice(-1)[0]).to.equal('active'));
    });

    it('Load panel total text', function() {
      return driver.findElement(locator.loadPanel.panel.css).findElements(By.xpath('.//*'))
        .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
        .then((resultArray) => {
          let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
          return resultString;
        })
        .then((result) => expect(result).to.be.equal(locator.loadPanel.panel.summary));
    });

  });

  describe('check Representations panel containment', function() {

    let suite = this;

    before(function() {
      _.each(locator.representationsPanel.body.descendant.xPath, (xPath, index) => {
        suite.addTest(it(`get Representations panel body descendants text ${index}`, function() {
          return driver.findElement(locator.representationsPanel.body.css).findElements(xPath)
            .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
            .then((resultArray) => {
              let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
              return resultString;
            })
            .then((result) => expect(result).to.be.equal(locator.representationsPanel.body.descendant.innerText[index]));
        }));
      });
    });

    it('open Representations panel', function() {
      return driver.findElement(tabs[2].css).click()
        .then(() => driver.findElement(tabs[2].css).getAttribute('class'))
        .then((attribute) => expect(attribute.split(/\s/).slice(-1)[0]).to.equal('active'));
    });

    it('Representations panel total text', function() {
      return driver.findElement(locator.representationsPanel.panel.css).findElements(By.xpath('.//*'))
        .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
        .then((resultArray) => {
          let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
          return resultString;
        })
        .then((result) => expect(result).to.be.equal(locator.representationsPanel.panel.summary));
    });
  });

  describe('check Render Settings panel containment', function() {

    let suite = this;

    before(function() {
      _.each(locator.renderSettingsPanel.body.descendant.xPath, (xPath, index) => {
        suite.addTest(it(`get Render Settings panel body descendants text ${index}`, function() {
          return driver.findElement(locator.renderSettingsPanel.body.css).findElements(xPath)
            .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
            .then((resultArray) => {
              let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
              return resultString;
            })
            .then((result) => expect(result).to.be.equal(locator.renderSettingsPanel.body.descendant.innerText[index]));
        }));
      });
    });

    it('open Render Settings panel', function() {
      return driver.findElement(tabs[3].css).click()
        .then(() => driver.findElement(tabs[3].css).getAttribute('class'))
        .then((attribute) => expect(attribute.split(/\s/).slice(-1)[0]).to.equal('active'));
    });

    it('Render Settings panel total text', function() {
      return driver.findElement(locator.renderSettingsPanel.panel.css).findElements(By.xpath('.//*'))
        .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
        .then((resultArray) => {
          let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
          return resultString;
        })
        .then((result) => expect(result).to.be.equal(locator.renderSettingsPanel.panel.summary));
    });
  });

  describe('check Tools panel containment', function() {

    let suite = this;

    before(function() {
      _.each(locator.toolsPanel.body.descendant.xPath, (xPath, index) => {
        suite.addTest(it(`get Tools panel body descendants text ${index}`, function() {
          return driver.findElement(locator.toolsPanel.body.css).findElements(xPath)
            .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
            .then((resultArray) => {
              let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
              return resultString;
            })
            .then((result) => console.log(result));//expect(result).to.be.equal(locator.toolsPanel.body.descendant.innerText[index]));
        }));
      });
    });

    it('open Tools panel', function() {
      return driver.findElement(tabs[4].css).click()
        .then(() => driver.findElement(tabs[4].css).getAttribute('class'))
        .then((attribute) => expect(attribute.split(/\s/).slice(-1)[0]).to.equal('active'));
    });

    it('Tools panel total text', function() {
      return driver.findElement(locator.toolsPanel.panel.css).findElements(By.xpath('.//*'))
        .then((foundElements) => getAllDescentElementsUniqueText(foundElements))
        .then((resultArray) => {
          let resultString = resultArray.join('').replace(/\n/g, '').replace(/\s+/g, '');
          return resultString;
        })
        .then((result) => console.log(result));//expect(result).to.be.equal(locator.renderSettingsPanel.panel.summary));
    });
  });
});
/*create tests that check tabs elements presence and their containment:
//may be make up a function(tabName, tabSelector, elementSelectors, elementText)???
  describe('corresponding tab', function() {})
    //it('open that tab', function() {}); done
    //it('check whether every tab sign contains right name', function() {}); done
    //it('check every panel has corresponding number of descendants', function() {}); why?
    //it('check every elements needed are visible', function() {}); to do
    //it('check every element is located at the right place', function() {}); manually
    //it('check every element has the right size', function() {});??? negative

//create tests that check tabs elements size and location if needed??? Or is it part of unit tests?*/
