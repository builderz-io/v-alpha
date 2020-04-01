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

    if ( which == 'entity found' ) {
      const entityData = await V.getAllEntityData();
      inner = `<p class="modal__welcome-back">
      ${ V.i18n( 'Welcome back' ) }, ${ entityData.name }<br>
      ${ V.i18n( 'ETH' ) }: ${ entityData.ethBalance }<br>
      ${ V.i18n( 'V' ) }: ${ entityData.tokenBalance }<br>
      ${ V.i18n( 'V Live' ) }: ${ entityData.liveBalance }<br>
      ${ V.i18n( 'Last Block' ) }: ${ entityData.lastBlock }<br>
      ${ V.i18n( 'Zero Block' ) }: ${ entityData.zeroBlock }<br>

      </p>`;
    }
    if ( which == 'entity new' ) {
      const entityData = await V.getAllEntityData();
      inner = `<p class="modal__welcome-back">${ V.i18n( 'Welcome' ) }, ${ entityData.name }<br>${ V.i18n( 'ETH' ) }: ${ entityData.ethBalance }<br>${ V.i18n( 'V' ) }: ${ entityData.tokenBalance }</p>`;
    }
    else if ( which == 'entity not found' ) {
      V.sN( 'balance > svg', 'clear' );
      Join.launch();

      inner = `<div class="modal__new font-medium" onclick="event.stopPropagation(); V.sN('.modal__new', 'clear'); Modal.drawNameForm()">${ V.i18n( 'Name your account' ) }</div><p class="modal__new-name">${ V.i18n( 'Naming your account creates a new entity for your address. An entity can be anything you want to make visible in the network.' ) }</p>`;
    }
    else if ( which == 'auth denied' ) {
      inner = `<p class="modal__p">${ V.i18n( 'Authorization denied' ) }</p>`;
    }
    else if ( which == 'wallet locked' ) {
      inner = `<p class="modal__p">${ V.i18n( 'Please connect your wallet. No sensitive data is being shared with anyone else. Only your public address will be used to retrieve your profile.' ) }</p>`;
    }
    else if ( which == 'logged out' ) {
      inner = `<p class="modal__p">${ V.i18n( 'You are logged out' ) }</p>`;
    }
    else if ( which == 'web3 provider not found' ) {
      inner = `<div class="modal__new font-medium">${ V.i18n( 'Create new wallet' ) }</div><p class="modal__return">${ V.i18n( 'Recover from mnemonic phrase' ) } (${ V.i18n( 'A Web3 provider was not found' ) })</p>`;
    }

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
        messagebox: {
          position: 'absolute',
          top: '7vh'
        }
      },
      c: 'messagebox flex w-100',
    } );
    const $input = V.sN( {
      t: 'input',
      a: {
        placeholder: V.i18n( 'Choose preferred name' ),
      },
      s: {
        messagebox__input: {
          'height': '36px',
          'padding': '8px 15px',
          'min-width': '100px',
          'border': '1px solid #e8e8ec',
          'resize': 'none',
          'border-radius': '30px'
        }
      },
      c: 'messagebox__input mr-2'
    } );

    const $send = V.sN( {
      t: 'button',
      s: {
        'circle-1': {
          width: '2.5rem',
          height: '2.5rem'
        }
      },
      c: 'circle-1 flex justify-center items-center rounded-full border-blackalpha bkg-white',
      h: V.getIcon( 'send' )
    } );

    $input.addEventListener( 'click', function( e ) {
      e.stopPropagation();
    } );

    $send.addEventListener( 'click', function( e ) {

      e.stopPropagation();

      DOM.$box = V.getNode( '.messagebox__input' );

      const entityData = {
        title: DOM.$box.value,
        role: 'member',
        ethAddress: V.getState( 'activeAddress' )
      };

      V.setEndpoint( 'new entity', entityData ).then( res => {
        if ( res.status == 'success' ) {
          console.log( res.message );

          Modal.draw( 'entity new' );
          Account.drawHeaderBalance();
        }
        else {
          DOM.$box.value = '';
          DOM.$box.setAttribute( 'placeholder', V.i18n( res.message ) );
          console.error( 'try again, because: ', res.message );
        }
      } );
    } );

    V.setNode( $box, [ $input, $send ] );
    V.setNode( '.modal__content', $box );

  }

  function draw( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw,
    drawNameForm: drawNameForm
  };

} )();
