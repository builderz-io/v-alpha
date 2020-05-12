const VKey = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage API Keys
   *
   */

  const apiKeys = {
    googlePlaces: 'AIzaSyD2MU7foORS25ayBrpV28DoZiHfXoCQvts',
    mapBox: 'KEY_HERE',
  };

  /* ================== public methods ================== */

  function getApiKey( which ) {
    return apiKeys[which];
  }

  /* ====================== export ====================== */

  ( () => {
    V.getApiKey = getApiKey;
  } )();

  return {
    getApiKey: getApiKey,
  };

} )();
