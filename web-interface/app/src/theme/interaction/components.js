const InteractionComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module for interaction components
   *
   */

  'use strict';

  const btnClasses = 'cursor-pointer hidden pr-s';
  const formClasses = 'w-full m-2 pxy rounded border-shadow';

  function handleSetFilter() {
    if ( this.getAttribute( 'value' ) == '1' ) {
      this.setAttribute( 'value', '0' );
      this.classList.remove( 'filter-select', 'txt-brand' );
    }
    else {
      this.setAttribute( 'value', '1' );
      this.classList.add( 'filter-select', 'txt-brand' );
    }

  }

  function handleImageUpload( e ) {
    V.setNode( '#img-upload__label', V.i18n( 'uploading...', 'form field', 'placeholder' ) );
    // castImageUpload( e );
    V.castImageUpload( e ).then( res => {
      console.log( res );
      V.setNode( '#img-upload__label', V.i18n( 'Change', 'form field', 'placeholder' ) );
      V.setNode( '#img-upload__preview', '' );
      V.setNode( '#img-upload__preview', V.cN( {
        t: 'img',
        y: {
          'max-width': '25px',
          'max-height': '20px',
          'margin-left': '10px'
        },
        src: res.src
      } ) );
    } );
  }

  /* ================== private methods ================= */

  function img( icon ) {
    return V.cN( {
      t: 'div',
      c: 'circle-1 flex justify-center items-center rounded-full border-shadow bkg-white transition',
      h: V.getIcon( icon )
    } );
  }

  /* ============ public methods and exports ============ */

  // btns

  function filter() {
    return V.cN( {
      t: 'li',
      id: 'filter',
      c: btnClasses,
      h: img( 'filter_list' )
    } );
  }

  function searchBtn() {
    return V.cN( {
      t: 'li',
      id: 'search',
      c: btnClasses,
      h: img( 'search' )
    } );
  }

  function query() {
    return V.cN( {
      t: 'li',
      id: 'query',
      c: btnClasses,
      h: img( 'search' )
    } );
  }

  function plus() {
    return V.cN( {
      t: 'li',
      id: 'plus',
      c: btnClasses,
      h: img( '+' )
    } );
  }

  function close() {
    return V.cN( {
      t: 'li',
      id: 'close',
      c: btnClasses,
      h: img( 'close' )
    } );
  }

  function sendNav() {
    return V.cN( {
      t: 'li',
      id: 'send',
      c: btnClasses,
      h: img( 'send' )
    } );
  }

  function sendBtn() {
    return V.cN( {
      t: 'button',
      c: 'circle-1 flex justify-center items-center rounded-full border-shadow bkg-white',
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
      classes: 'form fixed w-screen hidden bkg-white pxy',
      setStyle: {
        form: {
          'padding-top': 'calc(var(--page-position-top-selected) + 5px) !important',
          'height': '100%',
          'z-index': -1
        }
      }
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
      h: {
        t: 'label',
        c: 'field__label label-primary',
        h: {
          t: 'span',
          c: 'label__content',
          h: fields[whichField].label
        }
      }
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
      h: {
        t: 'div',
        c: 'field__border',
        h: {
          t: 'div',
          c: 'field__internal',
          h: $inputContainer
        }
      }
    } );
  }

  function formUploadImage() {
    return V.cN( {
      t: 'div',
      y: {
        'padding': '16px',
        'margin-left': '6px',
        'display': 'inline-flex',
        'align-items': 'center',
        'position': 'relative'
      },
      c: 'field pxy w-30% border-shadow',
      h: [
        {
          t: 'label',
          i: 'img-upload__label',
          a: {
            for: 'img-upload__file',
          },
          h: V.i18n( 'Image', 'form field', 'placeholder' )
        },
        {
          t: 'input',
          i: 'img-upload__file',
          c: 'hidden',
          a: {
            type: 'file',
            accept: 'image/*'
          },
          e: {
            change: handleImageUpload
          }
        },
        {
          t: 'div',
          i: 'img-upload__preview',
          y: {
            position: 'absolute',
            right: '10px'
          },
        },
      ]
    } );
  }

  function formSearchFilter() {
    return V.cN( {
      t: 'div',
      h: [
        {
          t: 'p',
          c: 'pxy',
          h: V.i18n( 'Enter a title or city name', 'app' )
        },
        // V.cN( {
        //   t: 'search-filter-nav',
        //   c: 'nav search-filter-nav fixed w-screen overflow-x-scroll pxy',
        //   h: V.cN( {
        //     t: 'ul',
        //     c: 'search-filter-nav__ul flex items-center font-medium',
        //     s: {
        //       'filter-select': {
        //         'background': 'azure !important',
        //         'box-shadow': '0px 0px 0px 1px azure !important',
        //       }
        //     },
        //     h: [
        //       V.cN( {
        //         t: 'li',
        //         i: 'search-filter__city',
        //         classes: 'pill flex fs-rr justify-center items-center rounded-full bkg-white border-shadow cursor-pointer no-txt-select whitespace-no-wrap',
        //         h: 'City',
        //         k: handleSetFilter
        //       } ),
        //       V.cN( {
        //         t: 'li',
        //         i: 'search-filter__title',
        //         classes: 'pill flex fs-rr justify-center items-center rounded-full bkg-white border-shadow cursor-pointer no-txt-select whitespace-no-wrap',
        //         h: 'Title',
        //         k: handleSetFilter
        //       } ),
        //     ]
        //   } )
        // } )
      ]
    } );
  }

  // join

  function joinBtn() {
    const sc = V.getState( 'screen' );

    return V.cN( {
      t: 'join',
      c: 'fixed cursor-pointer txt-anchor-mid',
      y: sc.width > 800 ? { top: '12px', left: '12px' } : { top: '2px', left: '2px' },
      h: {
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

      }
    } );
  }

  function onboardingCard() {

    const aE = V.getState( 'activeEntity' );
    const ledger = V.getSetting( 'transactionLedger' );

    if ( aE && ledger == 'EVM' ) {
      let $cardContent;
      const balanceCheck = aE.balance && aE.balance.liveBalance > 0 ? true : false;

      if ( !V.getState( 'activeAddress' ) ) { // no wallet in use
        $cardContent = V.castNode( {
          tag: 'div',
          c: 'flex w-full items-center justify-evenly',
          html: '<p>' + '👋 ' + V.i18n( 'Connect a crypto wallet', 'join', 'onboarding call to action' ) + '</p>'
        } );
        $cardContent.addEventListener( 'click', function handleAddWallet() {
          if ( window.Web3Obj ) {
            Join.draw( 'authenticate existing entity' );
          }
          else {
            Join.draw( 'install metamask' );
          }
        } );
      }
      else if ( !balanceCheck ) { // wallet balance is 0
        $cardContent = V.castNode( {
          tag: 'div',
          c: 'flex w-full items-center justify-evenly',
          html: '<p>' + '👋 ' + V.i18n( 'Ask a friend to transfer 1 VALUE to progress your verification.', 'join', 'onboarding call to action' ) + '</p>'
        } );
      }
      else if ( balanceCheck ) { // no brightID connected
        $cardContent = V.castNode( {
          tag: 'div',
          c: 'flex w-full items-center justify-evenly',
          html: '<p>' + '👋 ' + V.i18n( 'Verify with BrightID to receive VALUE basic income.', 'join', 'onboarding call to action' ) + '</p>'
          // <a href="brightid://link-verification/http:%2f%2fnode.brightid.org/VALUE/${ entity.private.base64Url }"><img src="/assets/img/brightID-logo_sm.png"></a>
        } );
      }

      const $onboardingCard = CanvasComponents.card( $cardContent );

      return $onboardingCard;
    }
    else {
      return '';
    }
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
    formField: formField,
    formUploadImage: formUploadImage,
    formSearchFilter: formSearchFilter,
    joinBtn: joinBtn,
    onboardingCard: onboardingCard,
    // tempBtn: tempBtn,
  };

} )();
