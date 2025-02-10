
global.V = {
  getSetting: jest.fn().mockReturnValue(),
  getData: jest.fn().mockResolvedValue({data:[]}),
  castJson: jest.fn().mockReturnValue(),
};

global.SoilCalculatorComponents = {
  getNumFertilizerGroups: 5,
}

const fs = require('fs');
const path = require('path');
const Calc = require('./soil-calculator');

beforeAll(() => {
  // Load JSON files from the parameter folder
  const params = loadJSONFiles(path.join(__dirname, 'parameter'));

  Calc.setTestData( [
    params['crops.json'],
    params['fertilizers.json'],
    params['soil-types.json'],
    params['schemas-and-legends.json']
  ] );
});

test('Basic 1 -- Crop: Winter wheat; Biomass: 12 -- Returns correct state object.', async () => {

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

const expectedState = {"inputs":{"CROP":{"ID":1010,"NAME":"Winter wheat","NAME_DE":"Winterweizen","LS":0,"N":{"BNF":0,"NYR":0},"MP":{"DM":0.86,"C":0.445,"N":0.0198},"SP":{"DM":0.86,"C":0.46,"N":0.00495},"LIT":{"DM":0,"C":0,"N":0},"STB":{"DM":0.86,"C":0.46,"N":0.00495},"RTS":{"DM":1,"C":0.4,"N":0.0088},"RATIO":{"SPMP":1,"LITMP":0,"STBMP":0.2,"RTSMP":0.5}},"FTLZ":{"F1":{"ID":5000,"QTY":0,"DATE":"","NAME":"No fertilizer","NAME_DE":"Kein Dünger","DM":0,"C":0,"N":0,"NAV":0},"F2":{"ID":5000,"QTY":0,"DATE":"","NAME":"No fertilizer","NAME_DE":"Kein Dünger","DM":0,"C":0,"N":0,"NAV":0},"F3":{"ID":5000,"QTY":0,"DATE":"","NAME":"No fertilizer","NAME_DE":"Kein Dünger","DM":0,"C":0,"N":0,"NAV":0},"F4":{"ID":5000,"QTY":0,"DATE":"","NAME":"No fertilizer","NAME_DE":"Kein Dünger","DM":0,"C":0,"N":0,"NAV":0},"F5":{"ID":5000,"QTY":0,"DATE":"","NAME":"No fertilizer","NAME_DE":"Kein Dünger","DM":0,"C":0,"N":0,"NAV":0}},"BMASS":{"MP":{"QTY":12,"HVST":true},"SP":{"QTY":12,"HVST":true},"LIT":{"QTY":0},"STB":{"QTY":2.4000000000000004},"RTS":{"QTY":5.16}},"DATE":{"SOWN":"","HVST":"","TURN":"","CUTS":"1"},"PCIPAPI":{"MM":-1,"STATION":{"ID":-1,"NAME":"","LAT":-1,"LON":-1},"DATE":{"FIRST":"","LAST":""}},"SITE":{"STYP":{"ID":2010,"NAME":"Sand","NAME_DE":"Sand","FCAP":40},"FCAP":-1,"CN":10,"PCIP":{"QTY":650,"MUL":0.5},"N":{"DEP":20,"LOSS":0.6674387280118836}}},"prev":null,"results":{"T":{"BAL":{"C":null,"N":null},"UNIT":"no unit defined"},"SOM":{"LOSS":2910.448000000001,"SUPP":556.248,"BAL":{"C":-2354.2000000000007,"N":-235.42000000000007}},"N":{"PB":311.04480000000007,"FIX":0,"DEP":20,"NYR":0,"CR":55.6248,"FTLZ":{"SUM":0,"GRS":0,"REM":0}},"C":{"CR":3013.44,"FTLZ":{"REM":0}},"PCIPAPI":{"MM":-1,"STATION":{"ID":-1,"NAME":"","LAT":-1,"LON":-1},"DATE":{"FIRST":"","LAST":""}}}}

    const result = await Calc.getDatapointResults(cropData, prevCropData);
    expect(result).toEqual(expectedState);
});

test('Basic 2 -- Crop: Winter wheat; Biomass: 12 -- Returns correct state object.', async () => {

  const cropData = {
  "datapoint": {
    "CROP": {
      "ID": 1020
    },
    "FTLZ": {
      "F1": {
        "ID": 5070,
        "QTY": 8,
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

const prevCropData = {
  "CROP": {
    "ID": 1010
  },
  "FTLZ": {
    "F1": {
      "ID": 5010,
      "QTY": 10,
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
      "QTY": 10,
      "HVST": false
    },
    "SP": {
      "QTY": 3,
      "HVST": false
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
};

const expectedState = {
  "inputs": {
    "CROP": {
      "ID": 1020,
      "NAME": "Summer wheat",
      "NAME_DE": "Sommerweizen",
      "LS": 0,
      "N": {
        "BNF": 0,
        "NYR": 40
      },
      "MP": {
        "DM": 0.86,
        "C": 0.445,
        "N": 0.018
      },
      "SP": {
        "DM": 0.86,
        "C": 0.46,
        "N": 0.0045
      },
      "LIT": {
        "DM": 0,
        "C": 0,
        "N": 0
      },
      "STB": {
        "DM": 0.86,
        "C": 0.46,
        "N": 0.0045
      },
      "RTS": {
        "DM": 1,
        "C": 0.4,
        "N": 0.008
      },
      "RATIO": {
        "SPMP": 1.2,
        "LITMP": 0,
        "STBMP": 0.32,
        "RTSMP": 0.8
      }
    },
    "FTLZ": {
      "F1": {
        "ID": 5070,
        "QTY": 8,
        "DATE": "",
        "NAME": "Composted cattle stable manure",
        "NAME_DE": "Rinder-Stallmist kompostiert",
        "DM": 0.35,
        "C": 0.4,
        "N": 0.015,
        "NAV": 0.13393553
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
        "QTY": 14.399999999999999,
        "HVST": true
      },
      "LIT": {
        "QTY": 0
      },
      "STB": {
        "QTY": 3.84
      },
      "RTS": {
        "QTY": 8.256
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
  "prev": {
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
        "ID": 5010,
        "QTY": 10,
        "DATE": "",
        "NAME": "Cattle slurry",
        "NAME_DE": "Vollgülle Milchvieh",
        "DM": 0.075,
        "C": 0.42,
        "N": 0.053,
        "NAV": 0.3401169
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
        "QTY": 10,
        "HVST": false
      },
      "SP": {
        "QTY": 3,
        "HVST": false
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
        "DEP": 20
      }
    }
  },
  "results": {
    "T": {
      "BAL": {
        "C": null,
        "N": null
      },
      "UNIT": "no unit defined"
    },
    "SOM": {
      "LOSS": 3208.4606308935604,
      "SUPP": 1172.8350774,
      "BAL": {
        "C": -2035.6255534935603,
        "N": -203.56255534935605
      }
    },
    "N": {
      "PB": 322.3968,
      "FIX": 0,
      "DEP": 20,
      "NYR": 40,
      "CR": 80.9088,
      "FTLZ": {
        "SUM": 3.754537910709494,
        "GRS": 17.796198999934443,
        "REM": 36.37470774
      }
    },
    "C": {
      "CR": 4821.504000000001,
      "FTLZ": {
        "REM": 1119.9999999999998
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

    const result = await Calc.getDatapointResults(cropData, prevCropData);
    expect(result).toEqual(expectedState);
});

test('Basic 3 -- Crop: Winter wheat; Biomass: 12 -- Returns correct state object.', async () => {

  const sequence = {
  "s31": {
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
  },
  "s1": {
    "datapoint": {
      "CROP": {
        "ID": 1010
      },
      "FTLZ": {
        "F1": {
          "ID": 5010,
          "QTY": 10,
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
          "QTY": 10,
          "HVST": false
        },
        "SP": {
          "QTY": 3,
          "HVST": false
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
          "ID": 5010,
          "QTY": 10,
          "DATE": "",
          "NAME": "Cattle slurry",
          "NAME_DE": "Vollgülle Milchvieh",
          "DM": 0.075,
          "C": 0.42,
          "N": 0.053,
          "NAV": 0.3401169
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
          "QTY": 10,
          "HVST": false
        },
        "SP": {
          "QTY": 3,
          "HVST": false
        },
        "LIT": {
          "QTY": 0
        },
        "STB": {
          "QTY": 2
        },
        "RTS": {
          "QTY": 4.3
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
    "results": {
      "T": {
        "BAL": {
          "C": null,
          "N": null
        },
        "UNIT": "no unit defined"
      },
      "SOM": {
        "LOSS": 2003.8146415332405,
        "SUPP": 2556.35353225,
        "BAL": {
          "C": 552.5388907167596,
          "N": 55.253889071675964
        }
      },
      "N": {
        "PB": 229.40500000000003,
        "FIX": 0,
        "DEP": 20,
        "NYR": 0,
        "CR": 229.40500000000003,
        "FTLZ": {
          "SUM": 9.023535846675964,
          "GRS": 0,
          "REM": 26.230353225
        }
      },
      "C": {
        "CR": 7524.999999999999,
        "FTLZ": {
          "REM": 315
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
  },
  "s2": {
    "datapoint": {
      "CROP": {
        "ID": 1020
      },
      "FTLZ": {
        "F1": {
          "ID": 5070,
          "QTY": 8,
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
          "QTY": 11,
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
    },
    "inputs": {
      "CROP": {
        "ID": 1020,
        "NAME": "Summer wheat",
        "NAME_DE": "Sommerweizen",
        "LS": 0,
        "N": {
          "BNF": 0,
          "NYR": 40
        },
        "MP": {
          "DM": 0.86,
          "C": 0.445,
          "N": 0.018
        },
        "SP": {
          "DM": 0.86,
          "C": 0.46,
          "N": 0.0045
        },
        "LIT": {
          "DM": 0,
          "C": 0,
          "N": 0
        },
        "STB": {
          "DM": 0.86,
          "C": 0.46,
          "N": 0.0045
        },
        "RTS": {
          "DM": 1,
          "C": 0.4,
          "N": 0.008
        },
        "RATIO": {
          "SPMP": 1.2,
          "LITMP": 0,
          "STBMP": 0.32,
          "RTSMP": 0.8
        }
      },
      "FTLZ": {
        "F1": {
          "ID": 5070,
          "QTY": 8,
          "DATE": "",
          "NAME": "Composted cattle stable manure",
          "NAME_DE": "Rinder-Stallmist kompostiert",
          "DM": 0.35,
          "C": 0.4,
          "N": 0.015,
          "NAV": 0.13393553
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
          "QTY": 11,
          "HVST": true
        },
        "SP": {
          "QTY": 13.2,
          "HVST": true
        },
        "LIT": {
          "QTY": 0
        },
        "STB": {
          "QTY": 3.52
        },
        "RTS": {
          "QTY": 7.568
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
    "results": {
      "T": {
        "BAL": {
          "C": null,
          "N": null
        },
        "UNIT": "no unit defined"
      },
      "SOM": {
        "LOSS": 2939.7966308935606,
        "SUPP": 1105.4110774,
        "BAL": {
          "C": -1834.3855534935606,
          "N": -183.43855534935605
        }
      },
      "N": {
        "PB": 295.5304,
        "FIX": 0,
        "DEP": 20,
        "NYR": 40,
        "CR": 74.1664,
        "FTLZ": {
          "SUM": 3.754537910709494,
          "GRS": 17.796198999934443,
          "REM": 36.37470774
        }
      },
      "C": {
        "CR": 4419.712,
        "FTLZ": {
          "REM": 1119.9999999999998
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
  },
  "s3": {
    "datapoint": -20
  },
  "s4": {
    "datapoint": -20
  },
  "s5": {
    "datapoint": -20
  },
  "s6": {
    "datapoint": -20
  },
  "s7": {
    "datapoint": -20
  },
  "s8": {
    "datapoint": -20
  },
  "s9": {
    "datapoint": -20
  },
  "s10": {
    "datapoint": -20
  },
  "s11": {
    "datapoint": -20
  },
  "s12": {
    "datapoint": -20
  },
  "s13": {
    "datapoint": -20
  },
  "s14": {
    "datapoint": -20
  },
  "s15": {
    "datapoint": -20
  },
  "s16": {
    "datapoint": -20
  },
  "s17": {
    "datapoint": -20
  },
  "s18": {
    "datapoint": -20
  },
  "s19": {
    "datapoint": -20
  },
  "s20": {
    "datapoint": -20
  },
  "s21": {
    "datapoint": -20
  },
  "s22": {
    "datapoint": -20
  },
  "s23": {
    "datapoint": -20
  },
  "s24": {
    "datapoint": -20
  }
};

const expectedSchema = {
  "T": {
    "BAL": {
      "C": -640.9233313884005,
      "N": -64.09233313884005
    },
    "UNIT": "Sequence average in kg ha-1 WARN"
  },
  "SOM": {
    "LOSS": -1,
    "SUPP": -1,
    "BAL": {
      "C": -1,
      "N": -1
    }
  },
  "N": {
    "PB": -1,
    "FIX": -1,
    "DEP": -1,
    "NYR": -1,
    "CR": -1,
    "FTLZ": {
      "SUM": -1,
      "GRS": -1,
      "REM": -1
    }
  },
  "C": {
    "CR": -1,
    "FTLZ": {
      "REM": -1
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

    const result = await Calc.getSequenceResults(sequence, 'en_US');
    expect(result).toEqual(expectedSchema);
});

/* Methods */

// Function to load JSON files from a specified directory
function loadJSONFiles(directory) {
    const files = fs.readdirSync(directory);
    const jsonData = {};

    files.forEach(file => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(directory, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            jsonData[file] = JSON.parse(fileContent);
        }
    });

    return jsonData;
}
