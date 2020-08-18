const Modal = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw modal layouts and interaction
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function view( which ) {

    const $modal = ModalComponents.modal();

    if ( which == 'entity found' ) {
      V.setNode( $modal, ModalComponents.entityFound(
        V.aE(),
        V.aA(),
        V.getSetting( 'coinTicker' ),
        V.getSetting( 'tokenTicker' )
      ) );
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
      setTimeout( () => { V.setNode( '.modal', 'clear' ) }, 2500 );
    }
    else if ( which == 'transaction successful' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'txSuccess' ) );
      setTimeout( () => { V.setNode( '.modal', 'clear' ) }, 2500 );
    }
    else {
      V.setNode( $modal, ModalComponents.simpleMessage( 'error' ) );
    }

    V.setNode( '.modal', 'clear' );
    V.setNode( 'body', $modal );
  }

  /* ============ public methods and exports ============ */

  function draw( which ) {
    view( which );
  }

  return {
    draw: draw,
  };

} )();
