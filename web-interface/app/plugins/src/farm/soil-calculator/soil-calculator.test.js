// jest.mock('V', () => ({
//   getSetting: jest.fn(( which ) => '../../..'),
// }));

beforeAll(() => {
  global.window.V = {
    getSetting: jest.fn(() => '../../..'),
  };
});

const Calc = require('./soil-calculator');

// const V = (function () {
//
//   const settings = {
//     sourceEndpoint: '../../..',
//   }
//
//   function getSetting( which ) {
//     return settings[which];
//   }
//
// return {
//   getSetting
// }
// })()

test('Crop: Winter wheat; Biomass: 12 -- Returns correct state object.', () => {

  const cropData = {
  "datapoint": {
    "CROP": {
      "ID": 1010
    },
    "FTLZ": {
      "F1": {
        "ID": 5000,
        "QTY": 0,
        "DATE": ""
      },
      "F2": {
        "ID": 5000,
        "QTY": 0,
        "DATE": ""
      },
      "F3": {
        "ID": 5000,
        "QTY": 0,
        "DATE": ""
      },
      "F4": {
        "ID": 5000,
        "QTY": 0,
        "DATE": ""
      },
      "F5": {
        "ID": 5000,
        "QTY": 0,
        "DATE": ""
      }
    },
    "BMASS": {
      "MP": {
        "QTY": 12,
        "HVST": true
      },
      "SP": {
        "QTY": 0,
        "HVST": true
      }
    },
    "DATE": {
      "SOWN": "",
      "HVST": "",
      "TURN": "",
      "CUTS": "1"
    },
    "PCIPAPI": {
      "MM": -1,
      "STATION": {
        "ID": -1,
        "NAME": "",
        "LAT": -1,
        "LON": -1
      },
      "DATE": {
        "FIRST": "",
        "LAST": ""
      }
    },
    "SITE": {
      "STYP": {
        "ID": 2010
      },
      "FCAP": -1,
      "CN": 10,
      "PCIP": {
        "QTY": 650,
        "MUL": 0.5
      },
      "N": {
        "DEP": 20
      }
    }
  }
};

const prevCropData = null;

const state = {
  "time": {
    "timestamp": "2025-02-08T10:43:12.847Z",
    "unix": 1739011392847
  },
  "inputs": {
    "CROP": {
      "ID": 1010,
      "NAME": "Winter wheat",
      "NAME_DE": "Winterweizen",
      "LS": 0,
      "N": {
        "BNF": 0,
        "NYR": 0
      },
      "MP": {
        "DM": 0.86,
        "C": 0.445,
        "N": 0.0198
      },
      "SP": {
        "DM": 0.86,
        "C": 0.46,
        "N": 0.00495
      },
      "LIT": {
        "DM": 0,
        "C": 0,
        "N": 0
      },
      "STB": {
        "DM": 0.86,
        "C": 0.46,
        "N": 0.00495
      },
      "RTS": {
        "DM": 1,
        "C": 0.4,
        "N": 0.0088
      },
      "RATIO": {
        "SPMP": 1,
        "LITMP": 0,
        "STBMP": 0.2,
        "RTSMP": 0.5
      }
    },
    "FTLZ": {
      "F1": {
        "ID": 5000,
        "QTY": 0,
        "DATE": "",
        "NAME": "No fertilizer",
        "NAME_DE": "Kein Dünger",
        "DM": 0,
        "C": 0,
        "N": 0,
        "NAV": 0
      },
      "F2": {
        "ID": 5000,
        "QTY": 0,
        "DATE": "",
        "NAME": "No fertilizer",
        "NAME_DE": "Kein Dünger",
        "DM": 0,
        "C": 0,
        "N": 0,
        "NAV": 0
      },
      "F3": {
        "ID": 5000,
        "QTY": 0,
        "DATE": "",
        "NAME": "No fertilizer",
        "NAME_DE": "Kein Dünger",
        "DM": 0,
        "C": 0,
        "N": 0,
        "NAV": 0
      },
      "F4": {
        "ID": 5000,
        "QTY": 0,
        "DATE": "",
        "NAME": "No fertilizer",
        "NAME_DE": "Kein Dünger",
        "DM": 0,
        "C": 0,
        "N": 0,
        "NAV": 0
      },
      "F5": {
        "ID": 5000,
        "QTY": 0,
        "DATE": "",
        "NAME": "No fertilizer",
        "NAME_DE": "Kein Dünger",
        "DM": 0,
        "C": 0,
        "N": 0,
        "NAV": 0
      }
    },
    "BMASS": {
      "MP": {
        "QTY": 12,
        "HVST": true
      },
      "SP": {
        "QTY": 12,
        "HVST": true
      },
      "LIT": {
        "QTY": 0
      },
      "STB": {
        "QTY": 2.4000000000000004
      },
      "RTS": {
        "QTY": 5.16
      }
    },
    "DATE": {
      "SOWN": "",
      "HVST": "",
      "TURN": "",
      "CUTS": "1"
    },
    "PCIPAPI": {
      "MM": -1,
      "STATION": {
        "ID": -1,
        "NAME": "",
        "LAT": -1,
        "LON": -1
      },
      "DATE": {
        "FIRST": "",
        "LAST": ""
      }
    },
    "SITE": {
      "STYP": {
        "ID": 2010,
        "NAME": "Sand",
        "NAME_DE": "Sand",
        "FCAP": 40
      },
      "FCAP": -1,
      "CN": 10,
      "PCIP": {
        "QTY": 650,
        "MUL": 0.5
      },
      "N": {
        "DEP": 20,
        "LOSS": 0.6674387280118836
      }
    }
  },
  "prev": null,
  "results": {
    "T": {
      "BAL": {
        "C": null,
        "N": null
      },
      "UNIT": "no unit defined"
    },
    "SOM": {
      "LOSS": 2910.448000000001,
      "SUPP": 556.248,
      "BAL": {
        "C": -2354.2000000000007,
        "N": -235.42000000000007
      }
    },
    "N": {
      "PB": 311.04480000000007,
      "FIX": 0,
      "DEP": 20,
      "NYR": 0,
      "CR": 55.6248,
      "FTLZ": {
        "SUM": 0,
        "GRS": 0,
        "REM": 0
      }
    },
    "C": {
      "CR": 3013.44,
      "FTLZ": {
        "REM": 0
      }
    },
    "PCIPAPI": {
      "MM": -1,
      "STATION": {
        "ID": -1,
        "NAME": "",
        "LAT": -1,
        "LON": -1
      },
      "DATE": {
        "FIRST": "",
        "LAST": ""
      }
    }
  }
}

  expect(
    Calc.getDatapointResults( cropData, prevCropData )
  )
  .toEqual( state );
});
