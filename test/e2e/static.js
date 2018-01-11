export default {
  materialIdentifiers: ['DF', 'SF', 'PL', 'ME', 'TR', 'GL'],
  colorIdentifiers: ['EL', 'RT', 'SQ', 'CH', 'SS', 'UN', 'CO', 'CF', 'TM', 'OC', 'HY', 'MO'],
  modeIdentifiers: ['LN', 'LC', 'BS', 'VW', 'TR', 'TU', 'CA', 'QS', 'SA', 'SE', 'CS', 'TX'],
  colourSettings: [{
    colorId: 'EL', settingNames: ['carbon = "purple"', 'carbon = 0x00FF00', 'carbon = -1',
      'carbon = 7394559']
  },
  {
    colorId: 'SQ', settingNames: ['gradient = "blue-red"']
  },
  {
    colorId: 'UN', settingNames: ['color = 0xaa00cc', 'color = 65535', 'color = "orange"']
  },
  {
    colorId: 'MO', settingNames: ['gradient = "reds"']
  },
  {
    colorId: 'CO', settingNames: ['subset = "elem N"', 'color = 16776960', 'color = 0x1299e0', 'baseColor = "gray"',
      'baseColor = 783995', 'baseColor = 0x674529']
  },
  {
    colorId: 'TM', settingNames: ['min = -30', 'max = 80']
  },
  {
    colorId: 'OC', settingNames: ['gradient = "blues"']
  },
  {
    colorId: 'HY', settingNames: ['gradient = "hot"']
  }
  ],
  modeSettings: [{
    modeId: 'BS', colorId: 'EL', settingNames: ['atom = 0.15', 'bond = 0.4', 'space = 0.8', 'multibond = false']
  },
  {
    modeId: 'LC', colorId: 'EL', settingNames: ['bond = 0.5', 'space = 0.6', 'multibond = false']
  },
  {
    modeId: 'LN', colorId: 'EL', settingNames: ['lineWidth = 4', 'atom = 0.5', 'multibond = false']
  },
  {
    modeId: 'CA', colorId: 'SS', settingNames: ['radius = 0.1', 'depth = 0.5', 'tension = 0.5', 'ss.helix.width = 2',
      'ss.strand.width = 0.5', 'ss.helix.arrow = 3', 'ss.strand.arrow = 1']
  },
  {
    modeId: 'TU', colorId: 'SS', settingNames: ['radius = 1', 'tension = 2']
  },
  {
    modeId: 'TR', colorId: 'SS', settingNames: ['radius = 1']
  },
  {
    modeId: 'QS', colorId: 'SQ', settingNames: ['isoValue = 2.5', 'scale = 0.5', 'zClip = true', 'wireframe = true',
      "subset = 'elem N'"]
  },
  {
    modeId: 'SA', colorId: 'SQ', settingNames: ['probeRadius = 0.5', 'zClip = true', 'wireframe = true',
      "subset = 'elem N'"]
  },
  {
    modeId: 'SE', colorId: 'SQ', settingNames: ['probeRadius = 3', 'zClip = true', 'wireframe = true',
      "subset = 'elem N'"]
  },
  {
    modeId: 'TX', colorId: 'EL',
    settingNames: [
      "template = '{{chain}}:{{S equence}}.{{serial}}>{{name}}///{{residue}}///water?{{water}}///het?{{hetatm}}'",
      "verticalAlign = 'top'", 'horizontalAlign = "left"', 'dx = -10',
      'dy = 10', 'bg = "adjust"', 'fg = "inverse"', 'showBg = false']
  }],
  egkSelectors: [{name: 'chain B, D', colorId: 'CH'},
    {name: 'nucleic', colorId: 'SS'}, {name: 'purine', colorId: 'RT'},
    {name: 'pyrimidine', colorId: 'RT'}
  ],
  vhgSelectors: ['charged', 'nonpolar', 'polar', 'basic', 'acidic', 'aromatic', 'protein', 'none', 'water', 'hetatm',
    'name OG1', 'elem N', 'residue pro', 'altloc B', 'polarh', 'nonpolarh', 'serial 379:2584', 'sequence 61:239'
  ],
  loadList: [{
    moleculeId: '3C9L', link: '3c9l', source: 'protein data bank', format: 'pdb',
    view: '1fMF4QSevYcIN5EE/3ZzNPJuGk7izdC29eW5lPw=='
  },
  {
    moleculeId: '3C9L', link: 'cif:3c9l', source: 'protein data bank', format: 'mmcif',
    view: '1fMF4QSevYcIN5EE/3ZzNPJuGk7izdC29eW5lPw=='
  },
  {
    moleculeId: '3C9L', link: 'mmtf:3c9l', source: 'MMTF', format: 'mmtf',
    view: '1fMF4QSevYcIN5EE/3ZzNPJuGk7izdC29eW5lPw=='
  },
  {
    moleculeId: 'Unknown', link: 'ccp4:3c9l', source: 'Collaborative Computational Project No. 4', format: 'ccp4',
    view: '1aTeQwRaldMKM7zpAueBrPCyqAb7XOTa/l8qHPw=='
  },
  {
    moleculeId: 'ergosteryl 3-beta-D-glucoside', link: 'pubchem:ergosteryl 3-beta-D-glucoside', source: 'PubChem',
    format: 'json', view: '1BOccP2UZYj3Jdl4+QBYJPgAAAAAAAACAAAAAgA=='
  }],
  renderSettingList: ['axes', 'fog', 'fxaa', 'ao', 'draft.clipPlane'], //pair with ['true', 'false'] array
  renderSettingList1: ['theme light', 'theme dark', 'fogFarFactor 1.5', 'fogNearFactor 1.5', 'scale 0.8', 'scale 1.25',
    'rotate x 180', 'rotate y -72 y -72 y -36', 'rotate x 180 z 180 y 180', 'translate x 2', 'translate y 2',
    'translate z 2', 'palette VM', 'palette jmol', 'stereo ANAGLYPH', 'stereo DISTORTED', 'stereo NONE'
  ],
  objectLines: [{
    command: 'line A.42.O A.29.OH',
    settings: ['color  = 0x357896', 'dashSize = 0.6', 'gapSize = 0.2']
  }]
};
