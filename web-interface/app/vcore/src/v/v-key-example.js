
const VKey = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage API Keys and other sensitive data
   *
   */

  const apiKeys = {
    googlePlaces: 'YOUR API KEY HERE',
    mapBox: 'YOUR API KEY HERE',
    rpc: 'YOUR API KEY HERE',
  };

  const sensitiveData = {
    viAdminEmail: 'PROVIDED BY VALUE INSTRUMENT',
  };

  /* ================== public methods ================== */

  function getApiKey( which ) {
    return apiKeys[which];
  }

  function getSensitiveData( which ) {
    return sensitiveData[which];
  }

  /* ====================== export ====================== */

  V.getApiKey = getApiKey;
  V.getSensitiveData = getSensitiveData;

  return {
    getApiKey: getApiKey,
    getSensitiveData: getSensitiveData,
  };

} )();
