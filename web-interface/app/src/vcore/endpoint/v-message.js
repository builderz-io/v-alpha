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

  function setMessage( which, data, whichLedger ) {
    return V.setData( which, data, whichLedger );
  }

  return {
    getMessage: getMessage,
    setMessage: setMessage
  };

} )();
