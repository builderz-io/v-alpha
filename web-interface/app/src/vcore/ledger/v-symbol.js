const VSymbol = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Symbol
   *
   */

  'use strict';

  /* ================== private methods ================= */

  /* ============ public methods and exports ============ */

  function setActiveAddress() {

    const Nem = require( '/node_modules/symbol-sdk' );

    const account = Nem.Account.generateNewAccount( Nem.NetworkType.MIJIN_TEST );
    // console.log( 'Your new account address is:', account.address.pretty(), 'and its private key is:', account.privateKey );
    return {
      success: true,
      status: 'Symbol credentials created',
      data: [ {
        account: account.address.pretty(),
        privateKey: account.privateKey
      } ]
    };
  }

  return {
    setActiveAddress: setActiveAddress,
  };

} )();
