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

    if ( which == 'entity found' || which == 'entity new') {
      const activeEntity = V.getState('activeEntity');
      inner = `<p class="modal__welcome-back">${ which == 'entity new' ? V.i18n( 'Welcome' ) : V.i18n( 'Welcome back' ) }, ${ activeEntity.fullId }</p>`;

      const entityData = await V.getActiveEntityData();
      const x = entityData.data[0];
      if (x) {
        inner += `<p class="modal__details">
        ${ V.i18n( 'ETH' ) }: ${ x.ethBalance }<br>
        ${ V.i18n( 'V' ) }: ${ x.tokenBalance }<br>
        ${ V.i18n( 'V Live' ) }: ${ x.liveBalance }<br>
        ${ V.i18n( 'Last Block' ) }: ${ x.lastBlock }<br>
        ${ V.i18n( 'Zero Block' ) }: ${ x.zeroBlock }<br>
        </p>`;
      }
      else {
        inner += `<p class="modal__welcome-back">
        ${ V.i18n( 'Sorry, token details could not be found' ) }<br>
        </p>`;
      }
    }
    else if ( which == 'entity not found' ) {
      V.sN( 'balance > svg', 'clear' );
      Join.launch();

      inner = `<div class="modal__new font-medium" onclick="event.stopPropagation(); V.sN('.modal__new', 'clear'); Modal.drawNameForm('new address set')">${ V.i18n( 'Name your account' ) }</div><p class="modal__new-name">${ V.i18n( 'Naming your account creates a new entity for your address. An entity can be anything you want to make visible in the network.' ) }</p>`;
    }
    else if ( which == 'user denied auth' ) {
      inner = `<p class="modal__p">${ V.i18n( 'Authorization denied' ) }</p>`;
    }
    else if ( which == 'wallet locked' ) {
      inner = `<p class="modal__p">${ V.i18n( 'Please connect your wallet. No sensitive data is being shared with anyone else. Only your public address will be used to retrieve your profile.' ) }</p>`;
    }
    else if ( which == 'logged out' ) {
      inner = `<p class="modal__p">${ V.i18n( 'You are logged out' ) }</p>`;
    }
    else if ( which == 'please wait' ) {
      inner = `<p class="modal__p">${ V.i18n( 'Please wait... requesting data' ) }</p>`;
    }
    else if ( which == 'web3 provider not found' ) {
      inner = `<div class="modal__new font-medium" onclick="event.stopPropagation(); V.sN('.modal__new', 'clear'); Modal.drawNameForm('temp user')">${ V.i18n( 'Use temporary name' ) }</div><p class="modal__new-name">${ V.i18n( '' ) }</p>`;
    }
    // else if ( which == 'web3 provider not found' ) {
    //   inner = `<div class="modal__new font-medium">${ V.i18n( 'Create new wallet' ) }</div><p class="modal__return">${ V.i18n( 'Recover from mnemonic phrase' ) } (${ V.i18n( 'A Web3 provider was not found' ) })</p>`;
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
    const $box = V.sN( {
      t: 'div',
      s: {
        namebox: {
          position: 'absolute',
          top: '7vh'
        }
      },
      c: 'namebox flex w-100',
    } );
    const $input = V.sN( {
      t: 'input',
      a: {
        placeholder: V.i18n( 'Choose preferred name' ),
      },
      s: {
        namebox__input: {
          'height': '36px',
          'padding': '8px 15px',
          'min-width': '100px',
          'border': '1px solid #e8e8ec',
          'resize': 'none',
          'border-radius': '30px'
        }
      },
      c: 'namebox__input mr-2'
    } );

    const $send = V.sN( {
      t: 'button',
      c: 'circle-1 flex justify-center items-center rounded-full border-blackalpha bkg-white',
      h: V.getIcon( 'send' )
    } );

    $input.addEventListener( 'click', function( e ) {
      e.stopPropagation();
    } );

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
            DOM.$box.setAttribute( 'placeholder', V.i18n( res.status ) );
          }
        } );
      }
      else if (options == 'temp user') {
        V.setState( 'activeEntity', {
          fullId: V.castEntityTitle( DOM.$box.value ) + ' ' + '#0000'
        } )
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
