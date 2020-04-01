const VKey = ( function() { // eslint-disable-line no-unused-vars

  const apiKeys = {
    googlePlaces: 'KEY_HERE',
    mapBox: 'KEY_HERE',
  };

  function getApiKey( which ) {
    return apiKeys[which];
  }

  return {
    getApiKey: getApiKey,
  };

} )();
