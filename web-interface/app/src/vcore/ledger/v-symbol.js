const VSymbol = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Symbol
   *
   */

  'use strict';

  /* ================== private methods ================= */

  /* ============ public methods and exports ============ */

  function setSymbolAddress() {
    console.log( 'symbol module is alive' );

    const Nem = require( '/node_modules/symbol-sdk' );
    console.log( Nem.Account.generateNewAccount( Nem.NetworkType.MIJIN_TEST ) );

  }

  return {
    setSymbolAddress: setSymbolAddress,
  };

} )();
