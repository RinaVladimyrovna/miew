// import all we need
import {By} from 'selenium-webdriver';

// an earnest plea for reader's grace

// Remember, thou who readst the list
// not all locators are listed here.
// In some cases functions iterate through locators via simple loops
// though if any serious changes would occur in html or UI in whole
// thou must to correct the iterating loops or locators.
// Locators used here are not IDs because we have no IDs accept the terminal,
// are not x-path always because we want to run tests in different browsers
// 

let locator = {
  openMenuButton: By.css('div.btns-miew-titlebar:nth-child(3) > button:nth-child(1)'),
// locator for navigation panel
  leftPanel: {
    css: By.css('div.col-sm-3:nth-child(1)'),
    tabs: {
      selector: 'div.col-sm-3:nth-child(1) > div:nth-child(2) > a:nth-child',
      names: ['Info', 'Load', 'Representations', 'Render settings', 'Tools', 'About']
    }
  },
// locator Menu -> Info
  infoPanel: {
    panel: {
      css: By.css('div.col-xs-12:nth-child(2)'),
      summary: 'Info1CRN/PLANTPROTEINWATERSTRUCTUREOFAHYDROPHOBICPROTEINATATOMICRESOLUTION.\
PENTAGONRINGSOFWATERMOLECULESINCRYSTALSOFCRAMBINStatisticsValueAtoms327Bonds337Residues46Chains1\
Molecules1MoleculesCRAMBIN'
    },
    title: {
      css: By.css('div.col-xs-12:nth-child(2) > div:nth-child(1)'),
      innerText: ['Info']
    },
    body: {
      css: By.css('div.col-xs-12:nth-child(2) > div:nth-child(2)'),
      descendant: {
        xPath: [By.xpath('.//th'), By.xpath('.//h1'), By.xpath('.//small'), By.xpath('.//p'),
          By.xpath('.//td'), By.xpath('.//li')],
        innerText: ['StatisticsValueMolecules', '1CRN', '/PLANTPROTEIN',
          'WATERSTRUCTUREOFAHYDROPHOBICPROTEINATATOMICRESOLUTION.PENTAGONRINGSOFWATERMOLECULESINCRYSTALSOFCRAMBIN',
          'Atoms327Bonds337Residues46Chains1Molecules1', 'CRAMBIN']
      }
    }
  },
// locators for Menu -> Load
  loadPanel: {
    panel: {
      css: By.css('div.col-xs-12:nth-child(3)'),
      summary: 'PresetsPDBorAMBERprmtop(PDBID,URLorlocalfile)AMBERcoordinate/restartfile(URL)Add\'1CRN\'toserver\
CancelLoadAutomaticpresetonloadONOFFSkipwaterONOFFConfiguredPDBfilesTherearenopresetsforthismolecule.\
Addnewpresetortrytoreloadthelist.AddnewpresetLoadpdbfilefirsttocreatenewpreset.'
    },
    title: {
      css: By.css('div.col-xs-12:nth-child(3) > div:nth-child(1)'),
      innerText: ['Presets']
    },
    body: {
      css: By.css('div.col-xs-12:nth-child(3) > div:nth-child(2)'),
      descendant: {
        xPath: [By.xpath('.//div/label'), By.xpath('.//div/span'), By.xpath('.//li/label')],
        innerText: ['PDBorAMBERprmtop(PDBID,URLorlocalfile)AMBERcoordinate/restartfile(URL)ConfiguredPDBfiles',
          'Add\'1CRN\'toserverCancelLoadONOFFONOFF',
          'AutomaticpresetonloadSkipwater']
      }
    }
  },
// locators for Menu -> Representations
  representationsPanel: {
    panel: {
      css: By.css('div.col-xs-12:nth-child(4)'),
      summary: 'Representations1CRN1CRN#1:Cartoon327SelectionnothetatmModeCartoonColorStructureUniformcolorMaterial\
SoftRadiusscaleIsosurfacethresholdZclippingONOFF#2:BallsandSticks0SelectionhetatmandnotwaterModeBallsColor\
ElementUniformcolorMaterialSoftRadiusscaleIsosurfacethresholdZclippingONOFFAddnewrepresentation\
Deletecurrentrepresentation'
    },
    title: {
      css: By.css('div.col-xs-12:nth-child(4) > div:nth-child(1)'),
      innerText: ['Representations']
    },
    body: {
      css: By.css('div.col-xs-12:nth-child(4) > div:nth-child(2)'),
      descendant: {
        xPath: [By.xpath('.//h4//a'), By.xpath('.//li'), By.xpath('.//div/a')],
        innerText: ['#1:Cartoon#2:BallsandSticks',
          'SelectionModeColorUniformcolorMaterialRadiusscaleIsosurfacethresholdSelection\
ModeColorUniformcolorMaterialRadiusscaleIsosurfacethreshold',
          'AddnewrepresentationDeletecurrentrepresentation']
      }
    }
  },
// locators for Menu -> Render Settings
  renderSettingsPanel: {
    panel: {
      css: By.css('div.col-xs-12:nth-child(5)'),
      summary: 'RendersettingsResolutionMediumResolutionautodetectionONOFFFogONOFFAxesONOFFFPScounter\
ONOFFPaletteJmolBackgroundcolorDarkLightFXAAONOFFAmbientOcclusionONOFFClipPlaneONOFF'
    },
    title: {
      css: By.css('div.col-xs-12:nth-child(5) > div:nth-child(1)'),
      innerText: ['RenderSettings']
    },
    body: {
      css: By.css('div.col-xs-12:nth-child(5) > div:nth-child(2)'),
      descendant: {
        xPath: [By.xpath('.//span'), By.xpath('.//label'), By.xpath('.//li')],
        innerText: ['MediumONOFFONOFFONOFFONOFFJmolDarkLightONOFFONOFFONOFF',
          'ResolutionautodetectionFogAxesFPScounterBackgroundcolorFXAAAmbientOcclusionClipPlane',
          'ResolutionPalette']
      }
    }
  },
// locators for Menu -> Tools
  toolsPanel: {
    panel: {
      css: By.css('div.col-xs-12:nth-child(6)'),
      summary: 'ToolsResetviewScreenshotGetURLGetscriptSavesettingsRestoresettingsResetsettingsExportFBX'
    },
    title: {
      css: By.css('div.col-xs-12:nth-child(6) > div:nth-child(1)'),
      innerText: ['Tools']
    },
    body: {
      css: By.css('div.col-xs-12:nth-child(6) > div:nth-child(2)'),
      descendant: {
        xPath: [By.xpath('.//a'), By.xpath('.//label'), By.xpath('.//li')],
        innerText: ['MediumONOFFONOFFONOFFONOFFJmolDarkLightONOFFONOFFONOFF',
          'ResolutionautodetectionFogAxesFPScounterBackgroundcolorFXAAAmbientOcclusionClipPlane',
          'ResolutionPalette']
      }
    }
  }
};

// a function prototype function to replace the old good legacy function someday
function completeArray(selector, names) {
  let fullArray = names.map((name, index) => {
    let temp = {};
    temp.name = name;
    temp.css = By.css(selector + '(' + (index + 1) + ')');
    return temp;
  });
  return fullArray;
}

export {locator, completeArray};
