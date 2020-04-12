const Modal = ( function() { // eslint-disable-line no-unused-vars
  /**
  * Modal layouts
  *
  *
  */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  async function presenter( which ) {

    const $modal = InteractionComponents.modal();

    let inner = 'An unknown error occured';

    if ( which == 'entity found' || which == 'entity new' ) {
      const activeEntity = V.getState( 'activeEntity' );
      inner = `<p class="modal__welcome-back">${ which == 'entity new' ? V.i18n( 'Welcome', 'modal' ) : V.i18n( 'Welcome back', 'modal' ) }, ${ activeEntity.fullId }</p>`;

      const entityData = await V.getActiveEntityData();

      const x = entityData.data[0];
      if ( x ) {
        inner += `<p class="modal__details">
        ETH: ${ x.ethBalance }<br>
        V: ${ x.tokenBalance }<br>
        ${ V.i18n( 'V Live', 'modal' ) }: ${ x.liveBalance }<br>
        ${ V.i18n( 'Last Block', 'modal' ) }: ${ x.lastBlock }<br>
        ${ V.i18n( 'Zero Block', 'modal' ) }: ${ x.zeroBlock }<br>
        </p>`;
      }
      else {
        inner += `<p class="modal__welcome-back">
        ${ V.i18n( 'Sorry, token details could not be found', 'modal' ) }<br>
        </p>`;
      }
    }
    else if ( which == 'entity not found' ) {
      V.sN( 'balance > svg', 'clear' );
      Join.launch();

      inner = `<div class="modal__new font-medium" onclick="event.stopPropagation(); V.sN('.modal__new', 'clear'); Modal.drawNameForm('new address set')">${ V.i18n( 'Name your account', 'modal' ) }</div><p class="modal__new-name">${ V.i18n( 'Naming your account creates a new entity for your address. An entity can be anything you want to make visible in the network.', 'modal' ) }</p>`;
    }
    else if ( which == 'user denied auth' ) {
      inner = `<p class="modal__p">${ V.i18n( 'Authorization denied', 'modal' ) }</p>`;
    }
    else if ( which == 'wallet locked' ) {
      inner = `<p class="modal__p">${ V.i18n( 'Please connect your wallet. No sensitive data is being shared with anyone else. Only your public address will be used to retrieve your profile.', 'modal' ) }</p>`;
    }
    else if ( which == 'logged out' ) {
      inner = `<p class="modal__p">${ V.i18n( 'You are logged out', 'modal' ) }</p>`;
    }
    else if ( which == 'please wait' ) {
      inner = `<p class="modal__p">${ V.i18n( 'Please wait... requesting data', 'modal' ) }</p>`;
    }
    else if ( which == 'web3 provider not found' ) {
      inner = `<div class="modal__new font-medium" onclick="event.stopPropagation(); V.sN('.modal__new', 'clear'); Modal.drawNameForm('temp user')">${ V.i18n( 'Use temporary name', 'modal' ) }</div><p class="modal__new-name"></p>`;
    }
    // else if ( which == 'web3 provider not found' ) {
    //   inner = `<div class="modal__new font-medium">${ V.i18n( 'Create new wallet', 'modal' ) }</div><p class="modal__return">${ V.i18n( 'Recover from mnemonic phrase', 'modal' ) } (${ V.i18n( 'A Web3 provider was not found', 'modal' ) })</p>`;
    // }

    V.setNode( $modal, {
      t: 'div',
      c: 'modal__content',
      h: inner,
    } );

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
    const $input = InteractionComponents.nameInput();
    const $send = InteractionComponents.nameSend();

    $send.addEventListener( 'click', function( e ) {

      e.stopPropagation();

      DOM.$box = V.getNode( '.namebox__input' );

      if ( options == 'new address set' ) {

        const entityData = {
          title: DOM.$box.value,
          role: 'network',
        };

        V.setEntity( entityData ).then( res => {
          if ( res.success ) {
            Join.draw( 'new address set' );
          }
          else {
            DOM.$box.value = '';
            DOM.$box.setAttribute( 'placeholder', V.i18n( res.status, 'placeholder' ) );
          }
        } );
      }
      else if ( options == 'temp user' ) {
        V.setState( 'activeEntity', {
          fullId: V.castEntityTitle( DOM.$box.value ) + ' ' + '#0000'
        } );
        V.setNode( '.modal', 'clear' );
        const $temp = InteractionComponents.tempBtn();
        V.setNode( 'join', 'clear' );
        V.setNode( 'header', $temp );

      }
    } );

    V.setNode( $box, [ $input, $send ] );
    V.setNode( '.modal__content', $box );

  }

  function draw( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw,
    drawNameForm: drawNameForm,
  };

} )();
