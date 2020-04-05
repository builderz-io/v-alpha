const VMessage = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module to add messaging to the app
  *
  *
  */

  'use strict';

  const DOM = {};

  /* ============ public methods and exports ============ */

  function getMessage( data ) {
    // TODO
  }

  function setMessage( which, options ) {

    if ( !options ) {
      options = { key: 'new message' };
    }

    const msgData = {};
    msgData.message = which;
    msgData.sender = V.getState( 'activeEntity' ).fullId;
    return V.setData( msgData, options, V.getSetting( 'chatLedger' ) );
  }

  return {
    getMessage: getMessage,
    setMessage: setMessage
  };

} )();
