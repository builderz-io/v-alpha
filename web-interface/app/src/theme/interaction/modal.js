const Modal = ( function() { // eslint-disable-line no-unused-vars
  /**
   * Modal layouts and interaction
   *
   */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  async function presenter( which ) {

    const $modal = InteractionComponents.modal();

    // let inner = 'An unknown error occured';

    if ( which == 'entity found' ) {
      const aE = V.getState( 'activeEntity' );
      const eB = await V.getEntityBalance( aE );
      V.setNode( $modal, InteractionComponents.entityFound( aE, eB ) );
    }
    else if ( which == 'entity not found' ) {
      V.sN( 'balance > svg', 'clear' );
      Join.launch();
      V.setNode( $modal, InteractionComponents.entityNotFound() );
    }
    else if ( which == 'web3 provider not found' ) {
      V.setNode( $modal, InteractionComponents.tempUser() );

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
      V.setNode( $modal, InteractionComponents.web2Login() );
    }
    else if ( which == 'user denied auth' ) {
      V.setNode( $modal, InteractionComponents.modalMessage( 'Authorization denied' ) );
    }
    else if ( which == 'wallet locked' ) {
      V.setNode( $modal, InteractionComponents.modalMessage( 'Please connect your wallet' ) );
    }
    else if ( which == 'logged out' ) {
      console.log( 'we are here' );
      V.setNode( $modal, InteractionComponents.modalMessage( 'You are logged out' ) );
    }
    else if ( which == 'please wait' ) {
      V.setNode( $modal, InteractionComponents.modalMessage( 'Please wait... requesting data' ) );
    }
    else {
      V.setNode( $modal, InteractionComponents.modalMessage( 'An error occured' ) );
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
      return V.setNode( '.messagebox', 'clear' );
    }

    const $box = InteractionComponents.nameForm();
    const $input = InteractionComponents.nameInput( options );
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
            Join.draw( 'setup new entity' );
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
            Join.draw( 'setup new entity' );
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
        const $temp = InteractionComponents.tempBtn();
        V.setNode( 'join', 'clear' );
        V.setNode( 'header', $temp );

      }

    } ); // end addEventListener

    V.setNode( $box, [ $input, $send ] );
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
