const Modal = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw modal layouts and interaction
   *
   */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  function presenter( which ) {
    return which;
  }

  async function view( which ) {

    const $modal = ModalComponents.modal();

    const aE = V.getState( 'activeEntity' );
    const cT = V.getSetting( 'coinTicker' );
    const tT = V.getSetting( 'tokenTicker' );

    if ( which == 'entity found' ) {
      const eB = await V.getEntityBalance( aE );
      V.setNode( $modal, ModalComponents.entityFound( aE, eB, cT, tT ) );
    }
    else if ( which == 'entity not found' ) {
      V.sN( 'balance > svg', 'clear' );
      Join.launch();
      V.setNode( $modal, ModalComponents.entityNotFound() );
    }
    else if ( which == 'web3 provider not found' ) {
      V.setNode( $modal, ModalComponents.tempUser() );
    }
    else if ( which == 'initialize web3 join' ) {
      V.setNode( $modal, ModalComponents.initWeb3Join() );
    }
    else if ( which == 'web2 login' ) {
      V.setNode( $modal, ModalComponents.web2Login() );
    }
    else if ( which == 'user denied auth' ) {
      V.setNode( $modal, ModalComponents.modalMessage( 'Authorization denied' ) );
    }
    else if ( which == 'wallet locked' ) {
      V.setNode( $modal, ModalComponents.modalMessage( 'Please connect your wallet' ) );
    }
    else if ( which == 'logged out' ) {
      V.setNode( $modal, ModalComponents.modalMessage( 'You are logged out' ) );
    }
    else if ( which == 'please wait' ) {
      V.setNode( $modal, ModalComponents.modalMessage( 'Please wait... requesting data' ) );
    }
    else if ( which == 'confirm transaction' ) {
      const aTx = V.getState( 'active' ).transaction;
      V.setNode( $modal, ModalComponents.modalConfirmTx( aTx ) );
    }
    else if ( which == 'transaction sent' ) {
      V.setNode( $modal, ModalComponents.modalMessage( 'Transaction has been sent to the network' ) );
    }
    else if ( which == 'transaction successful' ) {
      V.setNode( $modal, ModalComponents.modalMessage( 'Transaction successful' ) );
    }
    else {
      V.setNode( $modal, ModalComponents.modalMessage( 'An error occured' ) );
    }

    V.setNode( '.modal', 'clear' );
    V.setNode( 'body', $modal );
  }

  /* ============ public methods and exports ============ */

  function drawNameForm( options ) {
    if ( options == 'clear' ) {
      return V.setNode( '.namebox', 'clear' );
    }

    const $box = ModalComponents.nameForm();
    const $input = ModalComponents.nameInput( options );
    const $send = InteractionComponents.sendBtn();

    $send.addEventListener( 'click', function( e ) {

      e.stopPropagation();

      DOM.$box = V.getNode( '.namebox__input' );

      if ( options == 'set entity' ) {

        const entityData = {
          title: DOM.$box.value,
          role: 'network',
        };

        V.setEntity( entityData ).then( res => {
          if ( res.success ) {
            V.setState( 'activeEntity', res.data[0] );
            Join.draw( 'new entity was set up' );
          }
          else {
            DOM.$box.value = '';
            DOM.$box.setAttribute( 'placeholder', V.i18n( res.status, 'placeholder' ) );
          }
        } );

      }
      else if ( options == 'get entity' ) {

        V.getEntity( DOM.$box.value ).then( res => {
          if ( res.success ) {
            V.setState( 'activeEntity', res.data[0] );
            Join.draw( 'new entity was set up' );
          }
          else {
            console.log( 'entity not found', res );
            DOM.$box.value = '';
            DOM.$box.setAttribute( 'placeholder', V.i18n( res.status, 'placeholder' ) );
          }
        } );

      }
      else if ( options == 'set temp user' ) {

        V.setState( 'activeEntity', {
          fullId: V.castEntityTitle( DOM.$box.value ) + ' ' + '#0000'
        } );
        V.setNode( '.modal', 'clear' );
        const $temp = ModalComponents.tempBtn();
        V.setNode( 'join', 'clear' );
        V.setNode( 'header', $temp );

      }

    } ); // end addEventListener

    V.setNode( $box, [ $input, $send ] );
    V.setNode( '.namebox', 'clear' );
    V.setNode( '.modal__content', $box, 'prepend' );

  }

  function draw( which ) {
    view( presenter( which ) );
  }

  return {
    draw: draw,
    drawNameForm: drawNameForm,
  };

} )();
