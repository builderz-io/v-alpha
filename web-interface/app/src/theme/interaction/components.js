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
      c: 'circle-1 flex justify-center items-center rounded-full border-blackalpha bkg-white transition',
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

  function searchForm() {
    return V.sN( {
      t: 'input',
      c: 'searchform__search ' + formClasses,
      a: { placeholder: V.i18n( 'Search', 'placeholder' ) }
    } );
  }

  function formField( whichField, whichValue, lat, lng ) {

    function autoHeight() {
      const elem = this;
      elem.style.height = '1px';
      elem.style.height = ( elem.scrollHeight )+'px';

    }

    function handleFocus() {
      this.closest( '.field' ).classList += ' field--static field--focus';
    }

    function handleBlur() {
      const close = this.closest( '.field' ).classList;
      if( !this.value ) {
        close.remove( 'field--static' );
      }
      close.remove( 'field--focus' );
    }

    const fields = {
      title: {
        label: 'Title',
        inputId: 'plusform__title'
      },
      location: {
        label: 'Location',
        inputId: 'plusform__loc',
        attributes: {
          value: whichValue,
          lat: lat,
          lng: lng
        }
      },
      description: {
        label: 'Description',
        inputId: 'plusform__descr',
        multiline: true
      },
      target: {
        label: 'Target',
        inputId: 'plusform__target',
        fieldClasses: 'w-1/3 inline-block'
      },
      unit: {
        label: 'Unit',
        inputId: 'plusform__unit',
        fieldClasses: 'w-1/3 inline-block'
      },
      search: {
        label: 'Search',
        inputId: 'search-input',
      }
    };

    const $inputContainer = V.cN( {
      t: 'div',
      c: 'field__input-container',
    } );

    const $labelNode = V.cN( {
      t: 'div',
      c: 'field__label-wrapper',
      h: V.cN( {
        t: 'label',
        c: 'field__label label-primary',
        h: V.cN( {
          t: 'span',
          c: 'label__content',
          h: fields[whichField].label
        } )
      } )
    } );

    const $input = V.cN( {
      t: 'input',
      c: 'field__input',
      id: fields[whichField].inputId,
      e: {
        focus: handleFocus,
        blur: handleBlur
      },
      a: fields[whichField].attributes || { value: whichValue }
    } );

    const $textarea = V.cN( {
      t: 'textarea',
      c: 'field__input auto-height',
      id: fields[whichField].inputId,
      a: {
        row: '1',
      },
      h: whichValue,
      e: {
        input: autoHeight,
        focus: handleFocus,
        blur: handleBlur
      }
    } );

    if ( fields[whichField].multiline ) {
      V.setNode( $inputContainer, [ $labelNode, $textarea ] );
    }
    else {
      V.setNode( $inputContainer, [ $labelNode, $input ] );
    }

    const fieldClasses = fields[whichField].fieldClasses || '';
    const hasValue = whichValue ? ' field--static' : '';

    return V.cN( {
      t: 'div',
      c: 'field pxy ' + fieldClasses + hasValue,
      h: V.cN( {
        t: 'div',
        c: 'field__border',
        h: V.cN( {
          t: 'div',
          c: 'field__internal',
          h: $inputContainer
        } )
      } )
    } );
  }

  // join and temp

  function joinBtn() {
    const sc = V.getState( 'screen' );

    return V.sN( {
      t: 'join',
      c: 'fixed cursor-pointer txt-anchor-mid',
      y: sc.width > 800 ? { top: '12px', left: '12px' } : { top: '2px', left: '2px' },
      h: V.setNode( {
        tag: 'svg',
        a: {
          width: sc.width > 800 ? '66px' : '54px',
          viewBox: '0 0 36 36'
        },
        // h: [
        //   V.cN( {
        //     type: 'svg',
        //     t: 'circle',
        //     a: {
        //       'stroke-dasharray': '100',
        //       'transform': 'rotate(-90, 18, 18) translate(0, 36) scale(1, -1)',
        //       'stroke-dashoffset': '-200',
        //       'cx': '18',
        //       'cy': '18',
        //       'r': '15.91549430918954',
        //       'fill': '#ffa41b',
        //       'stroke': '#ffa41b',
        //       'stroke-width': '2.7'
        //     }
        //   } ),
        //   V.cN( {
        //     type: 'svg',
        //     t: 'text',
        //     c: 'font-medium fs-xs',
        //     a: { x: '50%', y: '59%' },
        //     h: 'Join'
        //   } )
        // ]
        h: `<circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)"
                       stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="#ffa41b"
                       stroke="#ffa41b" stroke-width="2.7">
                </circle>
                <text class="font-medium fs-xs" x="50%" y="59%">Join</text>`

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
    filter: filter,
    searchBtn: searchBtn,
    query: query,
    plus: plus,
    close: close,
    sendNav: sendNav,
    sendBtn: sendBtn,
    form: form,
    searchForm: searchForm,
    formField: formField,
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
