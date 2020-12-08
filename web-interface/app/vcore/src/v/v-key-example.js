
const VKey = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage API Keys
   *
   */

  const apiKeys = {
    googlePlaces: 'YOUR API KEY HERE',
    mapBox: 'YOUR API KEY HERE',
  };

  /* ================== public methods ================== */

  function getApiKey( which ) {
    return apiKeys[which];
  }

  /* ====================== export ====================== */

  V.getApiKey = getApiKey;

  return {
    getApiKey: getApiKey,
  };

} )();
