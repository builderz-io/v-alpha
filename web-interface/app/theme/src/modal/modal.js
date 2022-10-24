const Modal = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw modal layouts and interaction
   *
   */

  'use strict';

  let tempAuth, timeout;

  /* ================== private methods ================= */

  function view( which, data ) {

    const $modal = ModalComponents.modal();

    if ( which == 'preview' ) {
      V.setNode( $modal, ModalComponents.preview() );
    }
    else if ( which == 'entity found' ) {

      V.setNode( $modal, ModalComponents.entityFound(
        V.aE(),
        V.cA(),
        tempAuth ? tempAuth.uPhrase : false,
        V.getSetting( 'coinTicker' ),
        V.getSetting( 'tokenTicker' ),
      ) );

      tempAuth = undefined; // reset after joining
    }
    else if ( which == 'entity not found' ) {
      V.setNode( $modal, ModalComponents.entityNotFound() );
    }
    else if ( which == 'authenticate existing entity' ) {
      V.setNode( $modal, ModalComponents.mapAddress() );
    }
    else if ( which == 'web3 provider not found' ) {
      V.setNode( $modal, ModalComponents.tempUser() );
    }
    else if ( which == 'initialize web3 join' ) {
      V.setNode( $modal, ModalComponents.web3Join() );
    }
    else if ( which == 'initialize web2 join' ) {
      V.setNode( $modal, ModalComponents.web2Join() );
    }
    else if ( which == 'user denied auth' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'walletLocked' ) );
    }
    else if ( which == 'could not get balance' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'noBalance' ) );
    }
    else if ( which == 'wallet locked' ) {
      V.setNode( $modal, ModalComponents.connectWallet() );
    }
    else if ( which == 'logged out' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'loggedOut' ) );
    }
    else if ( which == 'join first' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'joinFirst' ) );
    }
    else if ( which == 'confirm uPhrase' ) {
      V.setNode( $modal, ModalComponents.confirmUPhrase() );
    }
    else if ( which == 'disconnect' ) {
      V.setNode( $modal, ModalComponents.disconnect() );
    }
    else if ( which == 'install metamask' ) {
      V.setNode( $modal, ModalComponents.getMetaMask() );
    }
    else if ( which == 'please wait' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'wait' ) );
    }
    else if ( which == 'confirm transaction' ) {
      const aTx = V.getState( 'active' ).transaction;
      V.setNode( $modal, ModalComponents.confirmTransaction( aTx ) );
    }
    else if ( which == 'transaction sent' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'txSent' ) );
      timeout = setTimeout( delayedModalClear, 3500 );
    }
    else if ( which == 'transaction successful' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'txSuccess' ) );
      timeout = setTimeout( delayedModalClear, 3500 );
    }
    else if ( which == 'transaction error' ) {
      clearTimeout( timeout - 1 );
      clearTimeout( timeout );
      V.setNode( $modal, ModalComponents.simpleMessage( data ) );
    }
    else if ( which == '404' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'fourOfour' ) );
    }
    else if ( which == 'validation error' ) {
      V.setNode( $modal, ModalComponents.validationError( data ) );
    }
    else {
      V.setNode( $modal, ModalComponents.simpleMessage( 'error' ) );
    }

    V.setNode( '.modal', 'clear' );
    V.setNode( 'body', $modal );
  }

  function delayedModalClear() {
    V.setNode( '.modal', 'clear' );
  }

  /* ============ public methods and exports ============ */

  function draw( which, data ) {
    view( which, data );
  }

  function setTempAuth( data ) {
    tempAuth = data;
  }

  return {
    draw: draw,
    setTempAuth: setTempAuth,
  };

} )();
