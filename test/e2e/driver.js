// import all we need
import webdriver from 'selenium-webdriver';
import firefoxDriver from 'selenium-webdriver/firefox';
import operaDriver from 'selenium-webdriver/opera';
import ieDriver from 'selenium-webdriver/ie';
import chromeDriver from 'selenium-webdriver/chrome';
import edgeDriver from 'selenium-webdriver/edge';
import {browserName} from '../../gulpfile.babel';

// browserName could be firefox, opera, ie, MicrosoftEdge, chrome
// some options are empty and are still here in case of need
function createDriverInstance() {
  var driver = new webdriver.Builder()
    .forBrowser(browserName)
    .setFirefoxOptions(new firefoxDriver.Options())
    .setChromeOptions(new chromeDriver.Options())
    .setIeOptions(new ieDriver.Options().requireWindowFocus(true).enablePersistentHover(false))
    .setEdgeOptions(new edgeDriver.Options())
    .setOperaOptions(new operaDriver.Options()
      .setOperaBinaryPath('...opera.exe'))
    .build();
  return driver;
}

export {createDriverInstance};
