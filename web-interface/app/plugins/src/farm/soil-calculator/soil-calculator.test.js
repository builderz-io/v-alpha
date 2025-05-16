const fs = require('fs');
const path = require('path');
const { t } = require('./test-data/test-data');
const Calc = require('./soil-calculator');

/**
 * Set things up
 */

global.V = {
  getSetting: jest.fn().mockReturnValue(),
  getData: jest.fn().mockResolvedValue(),
};

global.SoilCalculatorComponents = {
  getNumFertilizerGroups: 5,
}

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

/**
 * Run Tests
 */

test('Basic 1 -- Crop: Winter wheat; Biomass: 12 -- Returns correct state object.', async () => {

  const cropData = t.est1.crop1;
  const prevCropData = t.est1.prev;
  const expectedState = t.est1.state;

  const result = await Calc.getDatapointResults(cropData, prevCropData);

  expect(result).toEqual(expectedState);
});


/* Module Methods */

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
