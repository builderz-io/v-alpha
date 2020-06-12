const VKey = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage API Keys
   *
   */

  const apiKeys = {
    googlePlaces: 'AIzaSyD2MU7foORS25ayBrpV28DoZiHfXoCQvts',
    mapBox: 'pk.eyJ1IjoidmFsdWVpbnN0cnVtZW50IiwiYSI6ImNqbGw3aWYxejB1aTUzcHMxZ2o4ejVuMm8ifQ.9nokF78xbuqVF09cKCvpIw',
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
