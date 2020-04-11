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
      s: {
        'circle-1': {
          width: '2.5rem',
          height: '2.5rem'
        }
      },
      c: 'circle-1 flex justify-center items-center rounded-full border-blackalpha bkg-white',
      h: V.getIcon( icon )
    } );
  }

  function modalClose() {
    V.setNode( '.modal', 'clear' );
  }

  function stopProp( e ) {
    e.stopPropagation();
  }

  /* ============ public methods and exports ============ */

  // btns

  // function back() {
  //   return V.sN( {
  //     t: 'li',
  //     id: 'back',
  //     c: btnClasses,
  //     h: img( 'arrow_back' )
  //   } );
  // }

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

  function plus() {
    return V.sN( {
      t: 'li',
      id: 'plus',
      c: btnClasses,
      h: img( '+' )
    } );
  }

  function send() {
    return V.sN( {
      t: 'li',
      id: 'send',
      c: btnClasses,
      h: img( 'send' )
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

  // form

  function form() {
    return V.sN( {
      t: 'form',
      c: 'pxy'
    } );
  }

  function searchForm() {
    return V.sN( {
      t: 'input',
      c: formClasses,
      a: { placeholder: V.i18n( 'Search' ) }
    } );
  }

  function joinForm() {
    return V.sN( {
      t: 'input',
      c: formClasses,
      a: { placeholder: V.i18n( 'Your preferred name' ) }
    } );
  }

  function title() {
    return V.sN( {
      t: 'input',
      c: 'plusform__title ' + formClasses,
      a: { placeholder: V.i18n( 'Title' ) }
    } );
  }

  function loc() {
    return V.sN( {
      t: 'input',
      i: 'plusform__loc',
      c: 'plusform__loc ' + formClasses,
      a: { placeholder: V.i18n( 'Location' ) }
    } );
  }

  function locLat() {
    return V.sN( {
      t: 'input',
      i: 'plusform__lat',
      a: { type: 'hidden', step: '0.00001' }
    } );
  }

  function locLng() {
    return V.sN( {
      t: 'input',
      i: 'plusform__lng',
      a: { type: 'hidden', step: '0.00001' }
    } );
  }

  function desc() {
    return V.sN( {
      t: 'textarea',
      c: 'plusform__desc ' + formClasses,
      a: { placeholder: V.i18n( 'Description' ) }
    } );
  }

  function target() {
    return V.sN( {
      t: 'input',
      c: 'plusform__target w-1/3 m-2 mr-2 pxy rounded border-blackalpha',
      a: { placeholder: V.i18n( 'Price' ) }
    } );
  }

  function unit() {
    return V.sN( {
      t: 'input',
      c: 'plusform__unit w-1/3 m-2 pxy rounded border-blackalpha',
      a: { placeholder: V.i18n( 'Unit' ) }
    } );
  }

  // join and temp

  function joinBtn() {
    return V.sN( {
      t: 'join',
      c: 'balance fixed cursor-pointer txt-anchor-mid',
      h: V.setNode( {
        tag: 'a',
        href: '#modal',
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
      h: V.cN( {
        t: 'div',
        c: 'modal__close',
        h: V.i18n( 'Close' ),
        click: modalClose
      } ),
      click: modalClose
    } );
  }

  function nameForm() {
    return V.sN( {
      t: 'div',
      s: {
        namebox: {
          position: 'absolute',
          top: '7vh'
        }
      },
      c: 'namebox flex w-100',
    } );
  }

  function nameInput() {
    return V.sN( {
      t: 'input',
      c: 'namebox__input mr-2',
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
      a: {
        placeholder: V.i18n( 'Choose preferred name' ),
      },
      click: stopProp
    } );
  }

  function nameSend() {
    return V.sN( {
      t: 'button',
      c: 'circle-1 flex justify-center items-center rounded-full border-blackalpha bkg-white',
      h: V.getIcon( 'send' )
    } );
  }

  return {
    // back: back,
    filter: filter,
    searchBtn: searchBtn,
    plus: plus,
    send: send,
    close: close,
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
    nameForm: nameForm,
    nameInput: nameInput,
    nameSend: nameSend
  };

} )();
