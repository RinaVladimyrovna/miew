import {By} from 'selenium-webdriver';

let locator = {
  openMenuButton: By.css('div.btns-miew-titlebar:nth-child(3) > button:nth-child(1)'),

  leftPanel: {
    css: By.css('div.col-sm-3:nth-child(1)'),
    tabs: {
      selector: 'div.col-sm-3:nth-child(1) > div:nth-child(2) > a:nth-child',
      names: ['Info', 'Load', 'Representations', 'Render settings', 'Tools', 'About']
    }
  },

  infoPanel: {
    panel: {
      css: By.css('div.col-xs-12:nth-child(2)'),
      textLength: 233
    },
    title: {
      css: By.css('div.col-xs-12:nth-child(2) > div:nth-child(1)'),
      innerText: ['Info']
    },
    body: {
      css: By.css('div.col-xs-12:nth-child(2) > div:nth-child(2)'),
      descendent: {
        xPath: [By.xpath('.//td'), By.xpath('.//p'), By.xpath('.//h1')],
        innerText: [['Atoms', '327', 'Bonds', '337', 'Residues', '46', 'Chains', '1', 'Molecules', '1', 'CRAMBIN'],
          ['WATER STRUCTURE OF A HYDROPHOBIC PROTEIN AT ATOMIC RESOLUTION. PENTAGON RINGS OF WATER MOLECULES IN CRYSTALS OF CRAMBIN'],
          ['1CRN / PLANT PROTEIN']]
      }
    }
  },

  loadPanel: {
    panel: {
      css: By.css('div.col-xs-12:nth-child(3)'),
      textLength: 156
    },
    title: {
      css: By.css('div.col-xs-12:nth-child(3) > div:nth-child(1)'),
      innerText: ['Presets']
    },
    body: {
      css: By.css('div.col-xs-12:nth-child(3) > div:nth-child(2)'),
      descendent: {
        xPath: [By.xpath('.//li'), By.xpath('.//form[@data-form-type="miew-menu-form-load-pdb"]'),
          By.xpath('.//form[@data-form-type="miew-menu-form-auto-preset"]'),
          By.xpath('.//div[@data-form-type="miew-menu-form-configured-pdb-files"]')],
        innerText: [['Automatic preset on load\nON   OFF', 'Skip water\nON   OFF'],
          ['PDB or AMBER prmtop (PDB ID, URL or local file)\nAdd \'1CRN\' to server\nLoad'],
          ['Automatic preset on load\nON   OFF\nSkip water\nON   OFF'],
          ['Configured PDB files']]
      }
    }
  },

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
      descendent: {
        xPath: [By.xpath('.//h4'), By.xpath('.//li'), By.xpath('.//a')],
        innerText: [['#1: Cartoon\n327', '#2: Balls and Sticks\n0'],
          ['', 'Selection\nnot hetatm', 'Mode\nCartoon', 'Color\nStructure',
            '', 'Material\nSoft', '', '', '', '', '', '', '', '', '', '', ''],
          ['', '#1: Cartoon', '', '#2: Balls and Sticks', '',
            'Add new representation', 'Delete current representation']]
      }
    }
  }
};

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
