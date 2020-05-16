const InteractionComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module for interaction components
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
          'padding-top': 'calc(var(--page-position-top-selected) + 5px) !important',
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

    const fields = {
      uPhrase: {
        label: 'Key',
        inputId: 'loginform__uphrase'
      },
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
  };

} )();
