const Modal = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw modal layouts and interaction
   *
   */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  async function presenter( which ) {
    const $modal = ModalComponents.modal();

    // let inner = 'An unknown error occured';

    if ( which == 'entity found' ) {
      const aE = V.getState( 'activeEntity' );
      const eB = await V.getEntityBalance( aE );
      const cT = V.getSetting( 'coinTicker' );
      const tT = V.getSetting( 'tokenTicker' );
      V.setNode( $modal, ModalComponents.entityFound( aE, eB, cT, tT ) );
    }
    else if ( which == 'entity not found' ) {
      V.sN( 'balance > svg', 'clear' );
      Join.launch();
      V.setNode( $modal, ModalComponents.entityNotFound() );
    }
    else if ( which == 'web3 provider not found' ) {
      V.setNode( $modal, ModalComponents.tempUser() );

      // inner = `<div class="modal__new font-medium" onclick="Modal.handleClick(event, 'set temp user')">${ V.i18n( 'Use temporary name', 'modal' ) }</div>`;
    }
    else if ( which == 'web2 login' ) {
      // inner = `<div class="modal__new font-medium"
      //               onclick="Modal.handleClick(event, 'set entity')">
      //             ${ V.i18n( 'Create new account', 'modal' ) }
      //           </div>
      //           <p class="modal__return" onclick="Modal.handleClick(event, 'get entity')">
      //             ${ V.i18n( 'Login with key', 'modal' ) }
      //           </p>`;
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

    // else if ( which == 'web3 provider not found' ) {
    //   inner = `<div class="modal__new font-medium">${ V.i18n( 'Create new wallet', 'modal' ) }</div><p class="modal__return">${ V.i18n( 'Recover from mnemonic phrase', 'modal' ) } (${ V.i18n( 'A Web3 provider was not found', 'modal' ) })</p>`;
    // }

    // V.setNode( $modal, $modalContent );
    // V.setNode( $modal, {
    //   t: 'div',
    //   c: 'modal__content',
    //   h: inner,
    // } );

    return $modal;

  }

  function view( $modal ) {
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
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw,
    drawNameForm: drawNameForm,
  };

} )();
