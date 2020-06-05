const Modal = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw modal layouts and interaction
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function presenter( which ) {
    return which;
  }

  function view( which ) {

    const $modal = ModalComponents.modal();

    if ( which == 'entity found' ) {
      // const eB = await V.getEntityBalance( aE );
      const aE = V.getState( 'activeEntity' );
      const cT = V.getSetting( 'coinTicker' );
      const tT = V.getSetting( 'tokenTicker' );

      V.setNode( $modal, ModalComponents.entityFound( aE, cT, tT ) );
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
      V.setNode( $modal, ModalComponents.simpleMessage( 'Authorization denied' ) );
    }
    else if ( which == 'wallet locked' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'Please connect your wallet' ) );
    }
    else if ( which == 'logged out' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'You are logged out' ) );
    }
    else if ( which == 'disconnect' ) {
      V.setNode( $modal, ModalComponents.disconnect() );
    }
    else if ( which == 'install metamask' ) {
      V.setNode( $modal, ModalComponents.getMetaMask() );
    }
    else if ( which == 'please wait' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'Please wait... requesting data' ) );
    }
    else if ( which == 'confirm transaction' ) {
      const aTx = V.getState( 'active' ).transaction;
      V.setNode( $modal, ModalComponents.confirmTransaction( aTx ) );
    }
    else if ( which == 'transaction sent' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'Transaction has been sent to the network' ) );
    }
    else if ( which == 'transaction successful' ) {
      V.setNode( $modal, ModalComponents.simpleMessage( 'Transaction successful' ) );
    }
    else {
      V.setNode( $modal, ModalComponents.simpleMessage( 'An error occured' ) );
    }

    V.setNode( '.modal', 'clear' );
    V.setNode( 'body', $modal );
  }

  /* ============ public methods and exports ============ */

  function draw( which ) {
    view( presenter( which ) );
  }

  return {
    draw: draw,
  };

} )();
