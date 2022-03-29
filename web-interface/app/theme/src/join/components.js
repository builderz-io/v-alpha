const JoinComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
     * V Theme Module for join components
     *
     */

  'use strict';

  /* ============== globals ============== */

  const entityData = {
    role: 'Person',
    evmAddress: V.cA() || null,
  };

  let fourDigitString, uPhrase, fullId, cardIndex = 0;
  const randAvatar = V.castRandomInt( 0, 4 );

  const svgPaths = [ 'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z',

    'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z',

    'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z',

    'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z',

    'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z',
  ];

  /* ============== user interface strings ============== */

  const ui = {
    upload: 'uploading...',
    change: 'Change',
    next: 'Next',
    download: 'Download',
    downloadAgain: 'Download again',

    joinNameTop: 'Name yourself.',
    joinNameBottom: 'This is for your personal profile.',
    joinLocTop: 'Add your location.',
    joinLocBottom: '',
    joinImgTop: 'Add your image.',
    joinImgBottom: '',
    joinEmailTop: 'Add your email.',
    joinEmailBottom: 'This is private, visible to admins only.',
    joinKeyTop: 'Download your key.',
    joinKeyBottom: '',

    joinFormName: 'Name',
    joinFormLoc: 'Location',
    joinFormImg: 'Upload',
    joinFormEmail: 'Email',
    joinFormEmailConfirm: '4-digit code',

    joinResLoc: 'Please add your continent at least',
    joinResImg: 'Please choose an avatar at least',
    joinResEmail: 'Please add a valid email address',
    joinResEmailConfirm: 'Please enter the 4-digit code we sent',
    joinResEmailConfirmFalse: '4-digit code does not match',

    africa: 'Africa',
    asia: 'Asia',
    europe: 'Europe',
    australia: 'Australia',
    northAmerica: 'North-Amercia',
    southAmerica: 'South-America',
    antarctica: 'Antarctica',

  };

  const continents = [
    getString( ui.africa ),
    getString( ui.asia ),
    getString( ui.southAmerica ),
    getString( ui.europe ),
    getString( ui.australia ),
    getString( ui.northAmerica ),
    getString( ui.antarctica ),
  ];

  function getString( string, scope ) {
    return V.i18n( string, 'join', scope || 'join content' ) + ' ';
  }

  /* ====================== styles ====================== */

  V.setStyle( {
    'join-overlay': {
      position: 'fixed',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      background: 'rgba(0,0,0,0.8)',
    },
    'join-card': {
      'position': 'relative',
      'background': 'white',
      'width': '75vw',
      'max-width': '500px',
      'min-height': '46vh',
      'margin': '14vh auto',
      'padding': '1.5rem',
      'border-radius': '32px',
    },
    // wrapper
    'join-content-wrapper': {
    },
    //header
    'join-header': {
      'padding': '1.5rem',
      'font-family': 'IBM Plex Medium',
      'color': 'rgba(0,0,0,0.8)',
      'font-size': '21px',
    },
    'join-header__top': {
      'margin-bottom': '1rem',
    },
    'join-header__bottom': {

    },
    // form
    'join-form': {
      'padding': '0.9rem',
      'font-family': 'IBM Plex Medium',
      'color': 'rgba(0,0,0,0.5)',
      'font-size': '21px',
    },
    'join-form__inner': {
      'display': 'flex',
      'padding': '0.6rem',
      'border-bottom': '2px solid rgba(0,0,0,0.5)',
    },
    'join-form__title': {
      'margin-right': '10px',
    },
    'join-form__input': {
      'position': 'relative',
      'top': '-1px',
      'min-width': 0,
      'flex': 1,
    },
    'join-form__loc': {
      'min-width': 0,
      'flex': 1,
    },
    // selectors
    'join-selectors': {

    },
    'join-selectors__form': {
      'display': 'flex',
      'flex-wrap': 'wrap',
      'justify-content': 'center',
    },
    'join-selector': {

    },
    'join-selector__input': {

    },

    'join-selector__label': {
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'height': '2rem',
      'background': 'yellow',
      'margin': '0.2rem',
    },

    'join-selector__img': {
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'margin': '9px',
      'height': '50px',
      'width': '50px',
      'border': '2px solid lightgrey',
      'border-radius': '50%',

    },

    'join-selector__svg': {
      width: '30px',
      height: '30px',
    },

    // submit
    'join-submit': {
      'display': 'flex',
      'flex-direction': 'column',
      'flex': 1,
      'align-items': 'center',
    },
    'join-download': {
      'display': 'flex',
      'flex-direction': 'column',
      'flex': 1,
      'align-items': 'center',
    },

    'join-submit__response': {
      color: 'crimson',
      padding: '0.8rem',

    },

    'join-btn': {
      'display': 'flex',
      'height': '1.5rem',
      'align-items': 'center',
      'padding': '1rem 4rem',
      'background': 'rgba(var(--brandPrimary),1)',
      'color': 'white',
      'border-radius': '16px',
    },
  },
  );

  /* ================== event handlers ================== */

  function handleJoin() {
    Join.draw( 'initialize join' );
  }

  function handleNext() {
    if ( !advanceCard() ) { return }

    /* advace card index */
    cardIndex += 1;

    /* skip email if set to false by network */
    if (
      !V.getSetting( 'askforEmail' )
      && cardIndex == 3
    ) {
      cardIndex += 1;
    }

    /* advace to next card */
    V.sN( 'joinoverlay', 'clear' );
    V.sN( 'body', JoinComponents.joinOverlay() );

    /* add Google Places API to location card */
    if ( cardIndex == 1 ) {
      Google.initAutocomplete( 'join-form' );
    }

    /* "download key" card */
    else if ( cardIndex == 4 ) {
      V.gN( '.join-submit' ).classList.add( 'hidden' );
      setHuman();
    }

  }

  function handleSelector() {
    const $elem = V.getNode( '.join-form__input' ) || V.getNode( '.join-form__loc' );
    $elem.value = this;
  }

  function handleImageUpload( e ) {
    V.setNode( '#img-upload__label', getString( ui.upload ) );
    V.castImageUpload( e ).then( res => {
      V.setNode( '#img-upload__label', getString( ui.change ) );
      V.setNode( '#img-upload__preview', '' );
      V.setNode( '#img-upload__preview', V.cN( {
        t: 'img',
        src: res.src,
        y: {
          'max-width': '90px',
          'max-height': '90px',
          'margin-left': '10px',
        },
      } ) );
    } );
  }

  function handleSaveKey() {
    const site = window.location.host;
    const text = this.uPhrase + ' -- ' + this.fullId + ' -- ' + site + ' -- ' + new Date().toString(); // .substr( 16, 8 );
    const blob = new Blob( [text], { type: 'text/plain' } );

    const $a = document.createElement( 'a' );
    $a.download = site + '-key.txt';
    $a.href = window.URL.createObjectURL( blob );
    $a.click();

    V.setNode( '.join-download__btn', InteractionComponents.confirmClickSpinner() );

    setTimeout( function delayNextBtn() {
      V.gN( '.join-download__btn' ).innerText = getString( ui.downloadAgain );
      V.gN( '.join-submit' ).classList.remove( 'hidden' );
    }, 1600 );

  }

  /* ================== private methods ================= */

  function advanceCard() {

    /**
     * For each card: validate user input, then either
     * a) set user's choices into entityData object for use in setHuman and
     *    return true to advance to the next card OR
     * b) give feedback to user and return false to stop advancing to the next card
     *
     */

    /* name */
    if ( cardIndex == 0 ) {
      const input = V.getNode( '.join-form__input' ).value;
      const title = V.castEntityTitle( input ); // validation of the title

      if ( title.success ) {
        entityData.title = title.data[0];
        return true;
      }
      else {
        setResponse( title.message, 'setAsIs' );
        return false;
      }
    }

    /* location */
    else if ( cardIndex == 1 ) {
      const $location = V.getNode( '.join-form__loc' );
      const hasLat = $location.getAttribute( 'lat' );
      const hasLng = $location.getAttribute( 'lng' );
      const hasRadio = getRadioValue( 'continent' );

      if ( hasLat ) {
        entityData.location = $location.value;
        entityData.lat = hasLat;
        entityData.lng = hasLng;

        return true;
      }
      else if ( hasRadio ) {
        entityData.continent = hasRadio;
        return true;
      }
      else {
        setResponse( 'joinResLoc' );
        setSelectors();
        return false;
      }
    }

    /* image */
    else if ( cardIndex == 2 ) {
      const hasImage = V.getState( 'mediumImageUpload' );

      if ( hasImage ) {

        /**
         * the image and its sizes are taken from
         * the app state directly in castEntity in v-entity.js,
         * no need to add them to the entityData object
         */
        return true;
      }
      else if (
        V.getVisibility( '.join-selectors' )
      ) {
        entityData.avatar = getRadioValue( 'avatar' );
        return true;
      }
      else {
        setResponse( 'joinResImg' );
        setSelectors();
        return false;
      }
    }

    /* email */
    else if ( cardIndex == 3 ) {
      const confirm = V.getNode( '.join-form__input-confirm' ).value;

      if ( confirm ) {
        if ( confirm == fourDigitString ) {
          return true;
        }
        else {
          setResponse( 'joinResEmailConfirmFalse' );
          return false;
        }
      }

      const input = V.getNode( '.join-form__input' ).value;

      /* basic validation of the email syntax */
      const email = V.isEmail( input );

      if ( email ) {
        entityData.emailPrivate = input;
        confirmEmail();
        return false;
      }
      else {
        setResponse( 'joinResEmail' );
        return false;
      }
    }

  }

  function setResponse( which, setAsIs ) {
    V.getNode( '.join-submit__response' ).innerText = setAsIs ? which : getString( ui[which] );
  }

  function setSelectors() {
    V.getNode( '.join-selectors' ).style.display = 'block';
  }

  function getRadioValue( whichForm ) {
    return document.forms[ whichForm + 's'].elements[ whichForm ].value;
  }

  function setHuman() {

    V.setEntity( entityData ).then( res => {
      if ( res.success ) {
        console.log( 'successfully set entity: ', res );

        uPhrase = res.data[0].auth.uPhrase;
        fullId = res.data[0].fullId;

        /** automatically join */
        V.setAuth( uPhrase )
          .then( data => {
            if ( data.success ) {
              console.log( 'auth success' );

              setDownloadKeyCard();
            }
            else {
              console.log( 'could not set auth after setting new entity' );
            }
          } );

        /** set state and cache */
        V.setActiveEntity( res.data[0] );
        Join.draw( 'new entity was set up' );

      }
      else {
        console.log( 'could not set entity: ', res );
        // V.getNode( '.joinform__response' ).textContent = res.message;
      }
    } );
  }

  function setDownloadKeyCard() {
    const $downloadBtn = V.gN( '.join-download__btn' );
    $downloadBtn.innerText = getString( ui.download );
    $downloadBtn.addEventListener( 'click', handleSaveKey.bind( {
      uPhrase: uPhrase,
      fullId: fullId,
    } ) );
  }

  function confirmEmail() {

    setResponse( '', 'setAsIs' );
    V.getNode( '.join-submit__btn' ).append( InteractionComponents.confirmClickSpinner() );

    fourDigitString = V.castTag().replace( '#', '' );

    /* Email by https://www.smtpjs.com */
    Email.send( {
      SecureToken: V.getSetting( 'emailKey' ),
      To: entityData.emailPrivate,
      From: 'network.mailer@valueinstrument.org',
      Subject: window.location.hostname + ': '  + fourDigitString + ' ' + getString( ui.isConfirmCode ),
      Body: window.location.hostname + ': '  + fourDigitString + ' ' + getString( ui.isConfirmCode ),
      // Body: 'Please enter ' + randomNumber + ' at ' + window.location.hostname + ' to confirm this email address.',
    } ).then( msg => {
      V.setNode( '.confirm-click-spinner', 'clear' );
      if ( 'OK' == msg ) {
        V.getNode( '.join-form__confirm' ).style.display = 'block';
        setResponse( 'joinResEmailConfirm' );
      }
      else {
        setResponse( msg, 'setAsIs' );
      }
    } );
  }

  /* ================ components ================ */

  function joinHeader( headerTop, headerBottom ) {
    return V.cN(
      {
        c: 'join-header',
        h: [
          {
            c: 'join-header__top',
            h: getString( ui[headerTop] ),
          },
          {
            c: 'join-header__bottom',
            h: getString( ui[headerBottom] ),
          },
        ],
      },
    );
  }

  function joinForm( formTitle ) {
    return V.cN(
      {
        c: 'join-form' + ( formTitle == 'joinFormEmailConfirm' ? ' join-form__confirm hidden' : '' ),
        h: {
          c: 'join-form__inner',
          h: [
            {
              c: 'join-form__title',
              h: getString( ui[formTitle] ),
            },
            {
              t: 'input',
              c: 'join-form__input' + ( formTitle == 'joinFormEmailConfirm' ? ' join-form__input-confirm' : '' ),
              a: {
                value: 'Test This',
              },
            },
          ],
        },
      },

    );
  }

  function joinFormImg() {
    return V.cN(
      {
        c: 'join-form',
        h: {
          c: 'join-form__inner',
          h: [
            {
              c: 'join-form__title',
              h: getString( ui.joinFormImg ),
            },
            {
              t: 'label',
              i: 'img-upload__label',
              c: 'cursor-pointer',
              y: {
                flex: 1,
              },
              a: {
                for: 'img-upload__file',
              },
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
            },
          ],
        },
      },

    );
  }

  function joinFormLoc() {
    return V.cN(
      {
        c: 'join-form',
        h: {
          c: 'join-form__inner',
          h: [
            {
              c: 'join-form__title',
              h: getString( ui.joinFormLoc ),
            },
            {
              t: 'input',
              i: 'join-form__loc',
              c: 'join-form__loc',
            },
          ],
        },
      },

    );
  }

  function joinSelectorsCont() {
    return V.cN(
      {
        c: 'join-selectors hidden',
        h: {
          t: 'form',
          c: 'join-selectors__form',
          a: {
            name: 'continents',
          },
          h: continents.map( ( continent, i ) => V.cN( {
            c: 'join-selector',
            k: handleSelector.bind( continent ),
            h: [
              {
                t: 'input',
                i: 'join-selector__cont' + i,
                c: 'join-selector__input',
                a: {
                  type: 'radio',
                  name: 'continent',
                  value: i,
                },
              },
              {
                t: 'label',
                c: 'join-selector__label',
                h: continent,
                a: {
                  for: 'join-selector__cont' + i,
                },
              },
            ],
          } ) ),
        },
      },
    );
  }

  function joinSelectorsImg() {
    return V.cN(
      {
        c: 'join-selectors hidden',
        h: {
          t: 'form',
          a: {
            name: 'avatars',
          },
          c: 'join-selectors__form',
          h: svgPaths.map( ( avatarPath, i ) => V.cN( {
            c: 'join-selector',
            h: [
              {
                t: 'input',
                i: 'join-selector__img' + i,
                c: 'join-selector__input',
                a: {
                  type: 'radio',
                  name: 'avatar',
                  value: i,
                  checked: i == randAvatar ? true : undefined,
                },
              },
              {
                t: 'label',
                c: 'join-selector__img',
                h: {
                  svg: true,
                  c: 'join-selector__svg',
                  h: {
                    svg: true,
                    t: 'path',
                    c: 'join-selector__path',
                    a: {
                      d: avatarPath,
                    },
                  },
                },
                a: {
                  for: 'join-selector__img' + i,
                },
              },
            ],
          } ) ),
        },
      },
    );
  }

  function joinDownloadKey() {
    return V.cN(
      {
        c: 'join-download',
        h: {
          c: 'join-download__btn join-btn',
          h: InteractionComponents.confirmClickSpinner(),
        },
      },
    );
  }

  function joinSubmit() {
    return V.cN(
      {
        c: 'join-submit',
        h: [
          {
            c: 'join-submit__response',
          },
          {
            c: 'join-submit__btn join-btn',
            h: getString( ui.next ),
            k: handleNext,
          },
        ],
      },
    );
  }

  /* ================ cards ================ */

  function joinName() {
    return [
      joinHeader( 'joinNameTop', 'joinNameBottom' ),
      joinForm( 'joinFormName' ),
    ];
  }

  function joinLocation() {
    return [
      joinHeader( 'joinLocTop', 'joinLocBottom' ),
      joinFormLoc(),
      joinSelectorsCont(),
    ];
  }

  function joinImage() {
    return [
      joinHeader( 'joinImgTop', 'joinImgBottom' ),
      joinFormImg(),
      joinSelectorsImg(),
    ];
  }

  function joinEmail() {
    return [
      joinHeader( 'joinEmailTop', 'joinEmailBottom' ),
      joinForm( 'joinFormEmail' ),
      joinForm( 'joinFormEmailConfirm' ),
    ];
  }

  function joinKey() {
    return [
      joinHeader( 'joinKeyTop', 'joinKeyBottom' ),
      joinDownloadKey(),
    ];
  }

  /* ================  public components ================ */

  function joinOverlay() {
    return V.cN( {
      t: 'joinoverlay',
      c: 'join-overlay no-txt-select',
      h: {
        c: 'join-card',
        h: [
          {
            c: 'join-content-wrapper',
            h: [
              joinName,
              joinLocation,
              joinImage,
              joinEmail,
              joinKey,
            ][cardIndex](),
          },
          {
            c: 'join-submit',
            h: joinSubmit(),
          },
        ],
      },
    } );
  }

  function joinBtn() {
    const sc = V.getState( 'screen' );
    const colorBkg = 'rgba(' + sc.buttonBkg + ', 1)';

    return V.cN( {
      t: 'join',
      c: 'fixed cursor-pointer txt-anchor-mid',
      y: sc.width > 800 ? { top: '12px', left: '12px' } : { top: '2px', left: '2px' },
      h: {
        svg: true,
        a: {
          width: sc.width > 800 ? '66px' : '54px',
          viewBox: '0 0 36 36',
        },
        h: [
          {
            svg: true,
            t: 'circle',
            a: {
              'stroke-dasharray': '100',
              'transform': 'rotate(-90, 18, 18) translate(0, 36) scale(1, -1)',
              'stroke-dashoffset': '-200',
              'cx': '18',
              'cy': '18',
              'r': '15.91549430918954',
              'fill': colorBkg,
              'stroke': colorBkg,
              'stroke-width': '2.7',
            },
            k: handleJoin,
          },
          {
            svg: true,
            t: 'text',
            c: 'font-medium fs-xs txt-button',
            a: { x: '50%', y: '59%' },
            k: handleJoin,
            h: 'Join',
          },
        ],
      },
    } );
  }

  /* ====================== export ====================== */

  return {
    joinBtn: joinBtn,
    joinOverlay: joinOverlay,
  };

} )();
