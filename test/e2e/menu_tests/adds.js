// import all we need
import {By, until} from 'selenium-webdriver';
import {driver, page} from '../menu.e2e';
import golden from '../golden';
// forgive me reader! I tried my best...
////////////////////////////////////////////////////////////////////////////////////
//css selectors for menu panels and display buttons are listed in the consts below//
////////////////////////////////////////////////////////////////////////////////////
const menu = {
  openButton: By.css('div.btns-miew-titlebar:nth-child(3) > button:nth-child(1)'),
  closeButton: By.css('div.col-sm-3:nth-child(1) > div:nth-child(1) > button:nth-child(1)'),
  representationTab: By.css('div.col-sm-3:nth-child(1) > div:nth-child(2) > a:nth-child(3)'),
  loadTab: By.css('div.col-sm-3:nth-child(1) > div:nth-child(2) > a:nth-child(2)'),
  loadField: By.css('.main > form:nth-child(1) > div:nth-child(1) > div:nth-child(2) > input:nth-child(1)'),
  modeTab: By.css('div.in:nth-child(2) > ul:nth-child(1) > li:nth-child(2)'),
  colorTab: By.css('div.in:nth-child(2) > ul:nth-child(1) > li:nth-child(3)'),
  materialTab: By.css('div.in:nth-child(2) > ul:nth-child(1) > li:nth-child(5)'),
  returnButton: By.css('div.col-xs-12:nth-child(8) > div:nth-child(1) > button:nth-child(1)'),
  loadOpenButton: By.css('span.btn:nth-child(2)'),
  modeNames: {
    constPathPart: 'div.col-xs-12:nth-child(8) > div:nth-child(2) > div:nth-child(1) > a:nth-child',
    listLength: 12
  },
  colorNames: {
    constPathPart: 'div.col-xs-12:nth-child(9) > div:nth-child(2) > div:nth-child(1) > a:nth-child',
    listLength: 12
  },
  materialNames: {
    constPathPart: 'div.col-xs-12:nth-child(11) > div:nth-child(2) > div:nth-child(1) > a:nth-child',
    listLength: 6
  }
};

const display = {
  modeButton: By.css('button.blog-nav-item:nth-child(1)'),
  colorButton: By.css('button.blog-nav-item:nth-child(2)'),
  modeNames: {
    constPathPart: 'div.toolbar:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a:nth-child',
    listLength: 12
  },
  colorNames: {
    constPathPart: 'div.toolbar:nth-child(3) > div:nth-child(1) > div:nth-child(2) > a:nth-child',
    listLength: 12
  }
};
/////////////////////////////////////////////////////////////////////////////////////
//Fills in arrays used for shifting through mode, color, material lists            //
//Every element of returnd array holds identifier + By.css(selector) pair as object//
/////////////////////////////////////////////////////////////////////////////////////
function fillInArray(arrMinutiae, identifierArr) {
  let holder = [];
  for (let i = 1; i <= arrMinutiae.listLength; ++i) {
    let newElement = {};
    let semiElement = arrMinutiae.constPathPart + '(' + i + ')';
    newElement.css = By.css(semiElement);
    newElement.identifier = identifierArr[i - 1];
    holder.push(newElement);
  }
  return holder;
}
/////////////////////////////////////////////////////
//Changes mode and then color or changes color only//
//Depends on colour's index. Screenshots every pair//
/////////////////////////////////////////////////////
function modeColorPairs(caseSwitch, colour, mode) {
  return driver.wait(until.elementLocated(menu.openButton), 5 * 1000, "Can not find Menu button, sorry")
    .then(() => {
      if (caseSwitch) {
        return driver.findElement(menu.openButton).click();
      } else {
        return driver.findElement(menu.openButton).click()
          .then(() => driver.findElement(menu.representationTab).click())
          .then(() => driver.wait(until.elementLocated(menu.modeTab), 5 * 1000, "Can not choose a mode since there is no mode tab"))
          .then(() => driver.findElement(menu.modeTab).click())
          .then(() => driver.findElement(mode.css).click());
      }
    })
    .then(() => driver.wait(until.elementLocated(menu.colorTab), 5 * 1000, "Can not choose a colorer since there is no colorer tab"))
    .then(() => driver.findElement(menu.colorTab).click())
    .then(() => driver.findElement(colour.css).click())
    .then(() => driver.findElement(menu.closeButton).click())
    .then(() => page.waitUntilRebuildIsDone())
    .then(() => golden.shouldMatch(`1aid_${mode.identifier}_${colour.identifier}`, this));
}
/////////////////////////////////////////////////
//Has the same functionality as modeColorPairs.//
//Uses display buttons instead of Menu's ones. //
/////////////////////////////////////////////////
function modeColorDisplay(caseSwitch, colour, mode) {
  return Promise.resolve()
    .then(() => {
// select mode type in case we just opened Menu for the first time
// or we used all color types with current mode type
// caseSwitch take either 0 or 1
      if (!caseSwitch) {
        return driver.findElement(display.modeButton).click()
          .then(() => driver.wait(until.elementLocated(mode.css), 5 * 1000, "Can not find demanded mode in the list"))
          .then(() => driver.findElement(mode.css).click());
      } else {
// just ignore it if we do not need to change a mode type
        return Promise.resolve();
      }
    })
// change color type to the next colour
    .then(() => driver.wait(until.elementLocated(display.colorButton), 5 * 1000, "Can not find Display button for colorers"))
    .then(() => driver.findElement(display.colorButton).click())
    .then(() => driver.wait(until.elementLocated(colour.css), 5 * 1000, "Can not find demandded colorer in the list"))
    .then(() => driver.findElement(colour.css).click())
    .then(() => page.waitUntilRebuildIsDone())
    .then(() => golden.shouldMatch(`1aid_${mode.identifier}_${colour.identifier}`, this));
}

export {fillInArray, modeColorPairs, modeColorDisplay, menu, display};
