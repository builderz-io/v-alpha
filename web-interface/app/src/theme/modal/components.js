const ModalComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Modal Components
   *
   */

  'use strict';

  /* ================== event handlers ================== */

  function modalClose() {
    V.setNode( '.modal', 'clear' );
  }

  function stopProp( e ) {
    e.stopPropagation();
  }

  function handleClick( e ) {
    e.stopPropagation();
    V.sN( '.modal__new', 'clear' );
    Modal.drawNameForm( this ); // using .bind
    V.setNode( '.modal__return', 'clear' );
  }

  /* ============ public methods and exports ============ */

  function modal() {
    return V.cN( {
      t: 'modal',
      c: 'modal fixed',
      s: {
        modal: {
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          background: 'rgba(0,0,0,0.8)'
        }
      },
      h: V.cN( {
        t: 'div',
        c: 'modal__close',
        s: {
          modal__close: {
            'position': 'absolute',
            'right': '1rem',
            'top': '1rem',
            'text-decoration': 'none',
            'color': 'white'
          }
        },
        h: V.i18n( 'Close', 'modal' ),
        click: modalClose
      } ),
      click: modalClose
    } );
  }

  function modalContent() {
    return V.cN( {
      t: 'div',
      c: 'modal__content',
      s: {
        modal__content: {
          background: 'white',
          width: '75vw',
          height: '60vh',
          position: 'relative',
          margin: '18vh auto',
          padding: '0.5rem',
        }
      },
      click: stopProp
    } );
  }

  function modalMessage( text ) {
    const $content = modalContent();
    const $msg = V.cN( {
      t: 'p',
      c: 'modal__p',
      h: V.i18n( text, 'modal' )
    } );
    V.setNode( $content, $msg );
    return $content;
  }

  function web2Login() {
    const $content = modalContent();
    const $new = V.cN( {
      t: 'div',
      c: 'modal__new font-medium',
      s: {
        modal__new: {
          'background': '#ffa41b',
          'position': 'relative',
          'top': '5vh',
          'margin': '0 auto',
          'padding': '1rem',
          'text-align': 'center',
          'cursor': 'pointer'
        }
      },
      click: handleClick.bind( 'set entity' ),
      h: V.i18n( 'Create new account', 'modal' )
    } );
    const $key = V.cN( {
      t: 'p',
      c: 'modal__return',
      s: {
        modal__return: {
          'position': 'relative',
          'top': '10vh',
          'margin': '0 auto',
          'text-align': 'center',
          'cursor': 'pointer'
        }
      },
      click: handleClick.bind( 'get entity' ),
      h: V.i18n( 'Login with key', 'modal' )
    } );
    V.setNode( $content, [$new, $key] );
    return $content;
  }

  function entityFound( activeEntity, entityBalance, coinTicker, tokenTicker ) {
    const $content = modalContent();

    const $uPhrase = V.cN( {
      t: 'div',
      c: 'txt-center',
      s: {
        modal__uphrase: {
          color: 'red'
        }
      },
      h: `<p class="pxy">${V.i18n( 'Your login key is' ) }</p><p class="modal__uphrase font-medium fs-l pxy">${activeEntity.private.uPhrase}</p>
      <p class="pxy"> ${V.i18n( 'Take note of the phrase above' ) }<br>${ V.i18n( 'to login with later', 'modal' )}</p>`
    } );

    const $welcome = V.cN( {
      t: 'p',
      c: 'modal__welcome-back',
      h: V.i18n( 'Welcome', 'modal' ) + ', ' + activeEntity.fullId
    } );

    let $balance;

    const x = entityBalance.data[0];
    if ( x ) {
      $balance = V.cN( {
        t: 'p',
        c: 'modal__details',
        h: `
        ${tokenTicker} ${ V.i18n( 'Balance', 'modal' ) }: ${ x.tokenBalance }<br>
        ${tokenTicker} ${ V.i18n( 'Live Balance', 'modal' ) }: ${ x.liveBalance }<br>
        ${coinTicker}: ${ x.coinBalance }<br>
        ${ V.i18n( 'Zero Block', 'modal' ) }: ${ x.zeroBlock }<br>
        ${ V.i18n( 'Last Block', 'modal' ) }: ${ x.lastBlock }
        `
      } );
    }
    else {
      $balance = V.cN( {
        t: 'p',
        h: V.i18n( 'Sorry, account details could not be retrieved', 'modal' )
      } );
    }
    V.setNode( $content, [$uPhrase, $welcome, $balance] );
    return $content;
  }

  function entityNotFound() {
    const $content = modalContent();
    const $new = V.cN( {
      t: 'div',
      c: 'modal__new font-medium',
      s: {
        modal__new: {
          'background': '#ffa41b',
          'position': 'relative',
          'top': '5vh',
          'margin': '0 auto',
          'padding': '1rem',
          'text-align': 'center',
          'cursor': 'pointer'
        }
      },
      click: handleClick.bind( 'set entity' ),
      h: V.i18n( 'Name your account', 'modal' )
    } );
    const $descr = V.cN( {
      t: 'p',
      c: 'modal__descr',
      s: {
        modal__descr: {
          'position': 'relative',
          'top': '8vh',
          'margin': '0 auto',
          'text-align': 'center',
          'cursor': 'pointer'
        }
      },
      h: V.i18n( 'Naming your account creates a new entity for your address. ' +
                  'An entity can be anything you want to make visible in the network.', 'modal' )
    } );

    V.setNode( $content, [$new, $descr] );
    return $content;
  }

  function tempUser() {
    const $content = modalContent();
    const $new = V.cN( {
      t: 'div',
      c: 'modal__new font-medium',
      s: {
        modal__new: {
          'background': '#ffa41b',
          'position': 'relative',
          'top': '5vh',
          'margin': '0 auto',
          'padding': '1rem',
          'text-align': 'center',
          'cursor': 'pointer'
        }
      },
      click: handleClick.bind( 'set temp user' ),
      h: V.i18n( 'Use temporary name', 'modal' )
    } );
    const $descr = V.cN( {
      t: 'p',
      c: 'modal__descr',
      s: {
        modal__descr: {
          'position': 'relative',
          'top': '8vh',
          'margin': '0 auto',
          'text-align': 'center',
          'cursor': 'pointer'
        }
      },
      h: V.i18n( 'Creating a temporary user name enables you to join the conversation and ' +
                  'test out the app.', 'modal' )
    } );

    V.setNode( $content, [$new, $descr] );
    return $content;
  }

  function nameForm() {
    return V.sN( {
      t: 'div',
      s: {
        namebox: {
          position: 'relative',
          top: '5vh'
        }
      },
      c: 'namebox flex w-100 justify-center',
    } );
  }

  function nameInput( options ) {
    return V.sN( {
      t: 'input',
      c: 'namebox__input mr-2',
      s: {
        namebox__input: {
          'height': '36px',
          'padding': '9px 15px',
          'min-width': '200px',
          'border': '1px solid #e8e8ec',
          'resize': 'none',
          'border-radius': '30px'
        }
      },
      a: {
        placeholder: options == 'get entity' ? V.i18n( 'vx...', 'placeholder' ) : V.i18n( 'Choose preferred name', 'placeholder' ),
        // value: 'vxCommLogin'
      },
      click: stopProp
    } );
  }

  return {
    modal: modal,
    modalContent: modalContent,
    modalMessage: modalMessage,
    web2Login: web2Login,
    entityFound: entityFound,
    entityNotFound: entityNotFound,
    tempUser: tempUser,
    nameForm: nameForm,
    nameInput: nameInput,
  };

} )();
