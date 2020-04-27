const InteractionComponents = ( function() { // eslint-disable-line no-unused-vars
  /**
  * Button Components
  *
  */

  'use strict';

  const btnClasses = 'cursor-pointer hidden pr-s';
  const formClasses = 'w-full m-2 pxy rounded border-blackalpha';

  /* ================== private methods ================= */

  function img( icon ) {
    return V.sN( {
      t: 'div',
      c: 'circle-1 flex justify-center items-center rounded-full border-blackalpha bkg-white',
      h: V.getIcon( icon )
    } );
  }

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

  // btns

  function filter() {
    return V.sN( {
      t: 'li',
      id: 'filter',
      c: btnClasses,
      h: img( 'filter_list' )
    } );
  }

  function searchBtn() {
    return V.sN( {
      t: 'li',
      id: 'search',
      c: btnClasses,
      h: img( 'search' )
    } );
  }

  function query() {
    return V.sN( {
      t: 'li',
      id: 'query',
      c: btnClasses,
      h: img( 'search' )
    } );
  }

  function plus() {
    return V.sN( {
      t: 'li',
      id: 'plus',
      c: btnClasses,
      h: img( '+' )
    } );
  }

  function close() {
    return V.sN( {
      t: 'li',
      id: 'close',
      c: btnClasses,
      h: img( 'close' )
    } );
  }

  function sendNav() {
    return V.sN( {
      t: 'li',
      id: 'send',
      c: btnClasses,
      h: img( 'send' )
    } );
  }

  function sendBtn() {
    return V.sN( {
      t: 'button',
      c: 'circle-1 flex justify-center items-center rounded-full border-blackalpha bkg-white',
      h: V.cN( {
        t: 'span',
        c: 'sendbtn',
        s: {
          sendbtn: {
            position: 'relative',
            left: '1px',
            top: '1px',
            opacity: '0.75',
          }
        },
        h: V.getIcon( 'send' )
      } )
    } );
  }

  // form

  function form() {
    return V.setNode( {
      tag: 'form',
      classes: 'plusform fixed w-screen hidden bkg-white pxy',
      setStyle: {
        plusform: {
          'padding-top': 'calc(var(--page-position-top-selected) + 5px)',
          'height': '100%',
          'z-index': -1
        }
      }
    } );
  }

  // function form() {
  //   return V.sN( {
  //     t: 'form',
  //     c: 'pxy'
  //   } );
  // }

  function searchForm() {
    return V.sN( {
      t: 'input',
      c: formClasses,
      a: { placeholder: V.i18n( 'Search', 'placeholder' ) }
    } );
  }

  function joinForm() {
    return V.sN( {
      t: 'input',
      c: formClasses,
      a: { placeholder: V.i18n( 'Your preferred name', 'placeholder' ) }
    } );
  }

  function title( value ) {
    return V.sN( {
      t: 'input',
      c: 'plusform__title ' + formClasses,
      a: {
        placeholder: V.i18n( 'Title', 'placeholder' ),
        value: value
      }
    } );
  }

  function loc( value ) {
    return V.sN( {
      t: 'input',
      i: 'plusform__loc',
      c: 'plusform__loc ' + formClasses,
      a: {
        placeholder: V.i18n( 'Location', 'placeholder' ),
        value: value
      }
    } );
  }

  function locLat( value ) {
    return V.sN( {
      t: 'input',
      i: 'plusform__lat',
      a: {
        type: 'hidden',
        step: '0.00001',
        value: value
      }
    } );
  }

  function locLng( value ) {
    return V.sN( {
      t: 'input',
      i: 'plusform__lng',
      a: {
        type: 'hidden',
        step: '0.00001',
        value: value
      }
    } );
  }

  function desc( value ) {
    return V.sN( {
      t: 'textarea',
      c: 'plusform__desc ' + formClasses,
      a: { placeholder: V.i18n( 'Description', 'placeholder' ) },
      h: value
    } );
  }

  function target( value ) {
    return V.sN( {
      t: 'input',
      c: 'plusform__target w-1/3 m-2 mr-2 pxy rounded border-blackalpha',
      a: {
        placeholder: V.i18n( 'Price', 'placeholder' ),
        value: value
      }
    } );
  }

  function unit( value ) {
    return V.sN( {
      t: 'input',
      c: 'plusform__unit w-1/3 m-2 pxy rounded border-blackalpha',
      a: {
        placeholder: V.i18n( 'Unit', 'placeholder' ),
        value: value
      }
    } );
  }

  // join and temp

  function joinBtn() {
    return V.sN( {
      t: 'join',
      c: 'balance fixed cursor-pointer txt-anchor-mid',
      h: V.setNode( {
        tag: 'a',
        html: `<svg width="54px" viewBox="0 0 36 36">
                <circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)"
                       stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="#ffa41b"
                       stroke="#ffa41b" stroke-width="2.7">
                </circle>
                <text class="font-medium fs-xs" x="50%" y="59%">Join</text>
              </svg>`

      } )
    } );
  }

  function tempBtn() {
    return V.sN( {
      t: 'temp',
      c: 'balance fixed cursor-pointer txt-anchor-mid',
      h: V.setNode( {
        tag: 'a',
        href: '#modal',
        html: `<svg width="54px" viewBox="0 0 36 36">
                <circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)"
                       stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="white"
                       stroke="#1b1aff" stroke-width="2.7">
                </circle>
                <text class="font-medium fs-xs txt-green" x="50%" y="59%">Temp</text>
              </svg>`

      } )
    } );
  }

  // modal

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
      h: `<p class="pxy">${V.i18n( 'Your login key is' ) }</p><p class="modal__uphrase font-medium fs-l pxy">${activeEntity.uPhrase}</p>
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
    filter: filter,
    searchBtn: searchBtn,
    query: query,
    plus: plus,
    close: close,
    sendNav: sendNav,
    sendBtn: sendBtn,
    form: form,
    searchForm: searchForm,
    joinForm: joinForm,
    title: title,
    loc: loc,
    locLat: locLat,
    locLng: locLng,
    desc: desc,
    target: target,
    unit: unit,
    joinBtn: joinBtn,
    tempBtn: tempBtn,
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
