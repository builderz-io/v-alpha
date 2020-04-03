const VKey = ( function() { // eslint-disable-line no-unused-vars

  const apiKeys = {
    googlePlaces: 'AIzaSyD2MU7foORS25ayBrpV28DoZiHfXoCQvts',
    mapBox: 'KEY_HERE',
  };

  function getApiKey( which ) {
    return apiKeys[which];
  }

  return {
    getApiKey: getApiKey,
  };

} )();
