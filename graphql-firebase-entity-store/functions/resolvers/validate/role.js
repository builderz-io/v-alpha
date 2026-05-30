/**
 * Entities are stored with a compact role code in `data.c`
 * (see V.castRole in web-interface/app/vcore/src/helper/v-helper.js),
 * so validation must check the compact codes, not the human-readable names.
 */
const roleCodes = [
  'aa', // Person
  'ab', // PersonMapped
  'ac', // Business
  'ad', // Institution
  'ae', // NGO
  'af', // GOV
  'ag', // Network
  'ah', // Skill
  'ai', // Task
  'aj', // Place
  'ak', // Event
  'al', // Media
  'am', // Dataset
  'an', // Pool
  'ao', // Farm
  'ap', // Plot
  'aq', // Group
];

module.exports = data => {

  if ( !data.c || !roleCodes.includes( data.c ) ) {
    throw new Error( '-5110 invalid role' );
  }

  return true;
};
