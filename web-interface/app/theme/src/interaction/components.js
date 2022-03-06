const InteractionComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module for interaction components
   *
   */

  'use strict';

  const btnClasses = 'cursor-pointer hidden pr-s';

  /* ============== user interface strings ============== */

  const ui = {
    upload: 'uploading...',
    change: 'Change',
    image: 'Image',
    titleOrCity: 'Enter a title or city name',

    key: 'Key',
    title: 'Title',
    email: 'Email',
    emailConfirm: '4 digits',
    loc: 'Location',
    descr: 'Description and Links',
    target: 'Target',
    unit: 'Unit',
    search: 'Search',
    create: 'create',
    query: 'search',

    getStarted: 'Watch intro',
    connectWallet: 'Connect a new crypto wallet',
    progressVerification: 'Ask a friend to transfer 1 VALUE to progress your verification.',
    brightId: 'Verify with BrightID to receive VALUE basic income.',
  };

  function getString( string, scope ) {
    return V.i18n( string, 'interaction', scope || 'interaction content' ) + ' ';
  }

  /* ================== event handlers ================== */

  function handleImageUpload( e ) {
    V.setNode( '#img-upload__label', getString( ui.upload ) );
    V.castImageUpload( e ).then( res => {
      V.setNode( '#img-upload__label', getString( ui.change ) );
      V.setNode( '#img-upload__preview', '' );
      V.setNode( '#img-upload__preview', V.cN( {
        t: 'img',
        y: {
          'max-width': '25px',
          'max-height': '20px',
          'margin-left': '10px',
        },
        src: res.src,
      } ) );
    } );
  }

  // function handleSetFilter() {
  //   if ( this.getAttribute( 'value' ) == '1' ) {
  //     this.setAttribute( 'value', '0' );
  //     this.classList.remove( 'filter-select', 'txt-brand-primary' );
  //   }
  //   else {
  //     this.setAttribute( 'value', '1' );
  //     this.classList.add( 'filter-select', 'txt-brand-primary' );
  //   }
  // }

  function handleGetStarted() {
    V.setState( 'active', { navItem: '/media' } );

    setTimeout( () => { V.getNode( '[path="/media"]' ).click() }, 350 );
  }

  /* ================== private methods ================= */

  function img( icon, css ) {
    return V.cN( {
      c: 'circle-1 flex justify-center items-center rounded-full bkg-white transition pill-shadow' + ( css ? ' ' + css : '' ),
      h: V.getIcon( icon ),
    } );
  }

  /* ================  public components ================ */

  // btns

  function filter() {
    return V.cN( {
      t: 'li',
      id: 'filter',
      c: btnClasses,
      h: img( 'filter_list' ),
    } );
  }

  function searchBtn() {
    return V.cN( {
      t: 'li',
      id: 'search',
      c: btnClasses,
      h: img( 'search' ),
    } );
  }

  function query() {
    return V.cN( {
      t: 'li',
      id: 'query',
      c: btnClasses,
      h: {
        c: 'create-btn pxy',
        h: getString( ui.query ),
      }, // img( 'search' )
    } );
  }

  function plus() {
    return V.cN( {
      t: 'li',
      id: 'plus',
      c: btnClasses,
      h: img( '+' ),
    } );
  }

  function close() {
    return V.cN( {
      t: 'li',
      id: 'close',
      c: btnClasses,
      h: img( 'close' ),
    } );
  }

  function set() {
    return V.cN( {
      t: 'li',
      id: 'set',
      c: btnClasses,
      h: {
        c: 'create-btn pxy',
        h: getString( ui.create ),
      }, // img( 'send' )
    } );
  }

  function sendNav() {
    return V.cN( {
      t: 'li',
      id: 'send',
      c: btnClasses,
      h: img( 'send' ),
    } );
  }

  function sendBtn() {
    return V.cN( {
      t: 'button',
      i: 'send-message',
      c: 'circle-1 flex justify-center items-center rounded-full bkg-white',
      h: V.cN( {
        t: 'span',
        c: 'sendbtn',
        s: {
          sendbtn: {
            position: 'relative',
            left: '1px',
            top: '1px',
            opacity: '0.75',
          },
        },
        h: V.getIcon( 'send' ),
      } ),
    } );
  }

  // form

  function form() {
    return V.cN( {
      tag: 'form',
      classes: 'form fixed w-screen hidden bkg-white pxy',
      setStyle: {
        form: {
          'padding-top': 'calc(var(--page-position-top-selected) + 5px) !important',
          'height': '100%',
          'z-index': -1,
        },
      },
      h: {
        c: 'form__response pxy txt-red',
        // h: 'test response msg'
      },
    } );
  }

  function formField( whichField, whichValue, lat, lng ) {

    const fields = {
      uPhrase: {
        label: getString( ui.key ),
        inputId: 'loginform__uphrase',
        attributes: {
          type: 'password',
          autocomplete: 'off',
        },
      },
      title: {
        label: getString( ui.title ),
        inputId: 'plusform__title',
        attributes: {
          value: whichValue,
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          spellcheck: 'false',
        },
      },
      email: {
        label: getString( ui.email ),
        inputId: 'plusform__email',
        attributes: {
          // value: whichValue,
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          spellcheck: 'false',
        },
      },
      emailConfirm: {
        label: getString( ui.emailConfirm ),
        inputId: 'plusform__emailConfirm',
        attributes: {
          // value: whichValue,
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          spellcheck: 'false',
        },
      },
      location: {
        label: getString( ui.loc ),
        inputId: 'plusform__loc',
        attributes: {
          value: whichValue,
          lat: lat,
          lng: lng,
          autocomplete: 'off',
        },
      },
      description: {
        label: getString( ui.descr ),
        inputId: 'plusform__descr',
        multiline: true,
      },
      target: {
        label: getString( ui.target ),
        inputId: 'plusform__target',
        fieldClasses: 'flex-grow w-30%',
      },
      unit: {
        label: getString( ui.unit ),
        inputId: 'plusform__unit',
        fieldClasses: 'flex-grow w-30%',
      },
      search: {
        label: getString( ui.search ),
        inputId: 'search-input',
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          spellcheck: 'false',
        },
      },
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
      c: 'field__input-container',
    } );

    const $labelNode = V.cN( {
      c: 'field__label-wrapper',
      h: {
        t: 'label',
        c: 'field__label label-primary',
        h: {
          t: 'span',
          c: 'label__content',
          h: fields[whichField].label,
        },
      },
    } );

    const $input = V.cN( {
      t: 'input',
      c: 'field__input',
      id: fields[whichField].inputId,
      e: {
        focus: handleFocus,
        blur: handleBlur,
      },
      a: fields[whichField].attributes || { value: whichValue },
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
        blur: handleBlur,
      },
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
      c: 'field pxy ' + fieldClasses + hasValue,
      h: {
        c: 'field__border',
        h: {
          c: 'field__internal',
          h: $inputContainer,
        },
      },
    } );
  }

  function formUploadImage() {
    return V.cN( {
      c: 'pxy w-30%',
      h: {
        s: {
          'upload-field': {
            'padding': '16px 12px 17px',
            'align-items': 'center',
            // adjust look to other fields:
            'border': '1px solid #DBDAE3',
            'border-radius': '2px',
            'color': '#6F7287',
            'font-size': '14px',
            'transition': 'border 240ms cubic-bezier(0.4, 0, 0.3, 1)',
          },
          'upload-field:hover': {
            border: '1px solid #A9A8B3',
          },
        },
        c: 'upload-field relative flex flex-grow',
        h: [
          {
            t: 'label',
            i: 'img-upload__label',
            c: 'w-full cursor-pointer',
            a: {
              for: 'img-upload__file',
            },
            h: getString( ui.image ),
          },
          {
            t: 'input',
            i: 'img-upload__file',
            c: 'hidden',
            a: {
              type: 'file',
              accept: 'image/*',
            },
            e: {
              change: handleImageUpload,
            },
          },
          {
            i: 'img-upload__preview',
            y: {
              position: 'absolute',
              right: '10px',
            },
          },
        ],
      },
    } );
  }

  function formSearchFilter() {
    return V.cN( {
      h: [
        {
          t: 'p',
          c: 'pxy',
          h: getString( ui.titleOrCity ),
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
      ],
    } );
  }

  function onboardingCard() {

    const ledger = V.getSetting( 'transactionLedger' );

    if ( V.aE() && ledger == 'EVM' ) {
      let $cardContent;
      const balanceCheck = V.aE().balance && V.aE().balance.balance.liveBalance > 0 ? true : false;

      if ( !V.cA() ) { // no wallet in use
        $cardContent = V.castNode( {
          tag: 'div',
          c: 'flex w-full items-center justify-evenly',
          html: '<p>' + '👋 ' + getString( ui.connectWallet, 'onboarding call to action' ) + '</p>',
        } );
        $cardContent.addEventListener( 'click', function handleAddWallet() {
          if ( window.Web3Obj ) {
            Join.draw( 'authenticate existing entity' );
          }
          else {
            Join.draw( 'install metamask' );
          }
        } );
        return CanvasComponents.card( $cardContent );
      }
      else if ( !balanceCheck && V.aE().role == 'Person' ) { // wallet balance is 0
        $cardContent = V.castNode( {
          tag: 'div',
          c: 'flex w-full items-center justify-evenly',
          html: '<p>' + '👋 ' + getString( ui.progressVerification, 'onboarding call to action' ) + '</p>',
        } );
        return CanvasComponents.card( $cardContent );
      }
      else if ( balanceCheck && V.aE().role == 'Person' ) { // no brightID connected
        $cardContent = V.castNode( {
          tag: 'div',
          c: 'flex w-full items-center justify-evenly',
          html: '<p>' + '👋 ' + getString( ui.brightId, 'onboarding call to action' ) + '</p>',
          // <a href="brightid://link-verification/http:%2f%2fnode.brightid.org/VALUE/${ entity.private.base64Url }"><img src="/assets/img/brightID-logo_sm.png"></a>
        } );
        return CanvasComponents.card( $cardContent );
      }
      else {
        return '';
      }
    }
    else {
      return '';
    }
  }

  function getStarted() {
    return V.cN( {
      t: 'li',
      i: 'get-started',
      s: {
        getstarted: {
          background: 'rgb(255,112,148)',
          color: 'white',
          // border: '2px solid blue',
        },
      },
      c: 'pill getstarted flex justify-center items-center rounded-full cursor-pointer no-txt-select whitespace-no-wrap',
      h: getString( ui.getStarted ),
      k: handleGetStarted,
    } );
  }

  function confirmClickSpinner( omitMarginLeft ) {
    return V.cN( {
      svg: true,
      c: 'confirm-click-spinner',
      a: {
        width: '18',
        height: '18',
        viewBox: '0 0 50 50',
      },
      y: {
        'margin-left': omitMarginLeft ? '0px' : '14px',
      },
      h: [
        {
          svg: true,
          t: 'path',
          a: {
            d: 'M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z',
          },
          h: {
            svg: true,
            t: 'animateTransform',
            a: {
              attributeName: 'transform',
              type: 'rotate',
              from: '0 25 25',
              to: '360 25 25',
              dur: '0.7s',
              repeatCount: 'indefinite',
            },
          },
        },
      ],
    } );
  }

  /* ====================== export ====================== */

  return {
    filter: filter,
    searchBtn: searchBtn,
    query: query,
    plus: plus,
    close: close,
    set: set,
    sendNav: sendNav,
    sendBtn: sendBtn,
    form: form,
    formField: formField,
    formUploadImage: formUploadImage,
    formSearchFilter: formSearchFilter,
    onboardingCard: onboardingCard,
    getStarted: getStarted,
    confirmClickSpinner: confirmClickSpinner,
  };

} )();
