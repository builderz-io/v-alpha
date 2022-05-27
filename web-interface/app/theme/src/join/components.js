const JoinComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
     * V Theme Module for join components
     *
     */

  'use strict';

  /* ============== globals ============== */

  let entityData = {
    role: 'Person',
  };

  let fourDigitString, uPhrase, fullId, cardIndex = 0;
  const randAvatar = V.castRandomInt( 0, 4 );

  /* ============== user interface strings ============== */

  const ui = {
    upload: 'uploading...',
    change: 'Change image',
    next: 'Next',
    isConfirmCode: 'is your confirmation code',
    download: 'Download',
    downloadAgain: 'Download again',
    callToAction: '🎉  Ready! Go create!',
    authFail: 'Auth failed. Reload and join manually using the key shown hidden above.',
    startAgain: 'Please reload and join again.',

    joinNameTop: 'Name yourself.',
    joinNameBottom: 'This is for your personal profile.',
    joinLocTop: 'Add your location.',
    joinLocBottom: '',
    joinImgTop: 'Add your image.',
    joinImgBottom: '',
    joinEmailTop: 'Add your email.',
    joinEmailBottom: 'This is private, visible to admins only.',
    joinAwaitKeyTop: 'One moment... setting you up.',
    joinAwaitKeyBottom: '',
    joinSuccessTop: 'Done! You successfully joined.',
    joinSuccessBottom: 'Please download your access key.',
    joinFailTop: 'Eeeeek, problem.',

    joinFormName: 'Name',
    joinFormLoc: 'Location',
    joinFormImg: 'Upload',
    joinFormEmail: 'Email',
    joinFormEmailConfirm: '4-digit code',

    joinResLoc: 'Please add your continent at least',
    joinResNoLat: 'We couldn\'t find this location. Please select from the list or clear the entry to continue',
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
      'display': 'flex',
      'flex-flow': 'column',
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
      flex: '1',
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
      'justify-content': 'space-between',
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
    // 'join-form__loc': {
    //   'position': 'relative',
    //   'top': '-1px',
    //   'min-width': 0,
    //   'flex': 1,
    // },
    // selectors
    'join-selectors': {

    },
    'join-selectors__form': {
      'display': 'flex',
      'flex-wrap': 'wrap',
      'justify-content': 'space-evenly',
      'margin-top': '2.6rem',
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
      'margin': '0.2rem',
      'padding': '0 1rem',
      'border': '2px solid lightgrey',
      'border-radius': '20px',
    },

    'join-selector__img': {
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'center',
      'margin': '9px',
      'height': '50px',
      'width': '50px',
      // 'border': '2px solid lightgrey',
      'border-radius': '50%',

    },

    'img-upload__label': {
      flex: 1,
    },

    'join-selector__svg': {
      width: '30px',
      height: '30px',
    },

    // submit
    'join-submit': {
      'display': 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'padding-bottom': '2rem',
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

  function handleSubmit() {

    /* return early if validaton in advanceCard failed */
    if ( !advanceCard() ) { return }

    /* advance card index */
    cardIndex += 1;

    /* skip email by bumping up the cardIndex if askforEmail is set to false */
    if (
      !V.getSetting( 'askforEmail' )
      && cardIndex == 3
    ) {
      cardIndex += 1;
    }

    /* clear previous card */
    V.sN( 'joinoverlay', 'clear' );

    /* draw new card or finish join-routine when cardIndex == 5 */
    if ( cardIndex < 5 ) {

      V.sN( 'body', JoinComponents.joinOverlay() );

      /* add Google Places API to location card */
      if ( cardIndex == 1 ) {
        Google.initAutocomplete( 'join-form' );
      }

      /* set the new human entity on "download key" card */
      else if ( cardIndex == 4 ) {
        if ( !V.getSetting( 'devMode' ) ) {
          V.gN( 'joinoverlay' ).removeEventListener( 'click', handleJoinOverlayClick );
        }
        drawAltSubmitBtn( 'call-to-action' );
        setHuman();
      }
    }

  }

  function handleJoinOverlayClick() {
    cardIndex = 0;
    entityData = {
      role: 'Person',
      evmAddress: V.cA() || null,
    };
    V.sN( 'joinoverlay', 'clear' );
  }

  function handleJoinCardClick( e ) {

    /* avoid closing the overlay */
    e.stopPropagation();
  }

  function handleSelector() {
    const $elem = V.getNode( '.join-form__input' ); // || V.getNode( '.join-form__loc' );
    $elem ? $elem.value = this : null;
    setResponse( '', 'setAsIs' );
  }

  function handleImageUpload( e ) {
    V.setNode( '.join-form__title', 'clear' );
    V.setNode( '#img-upload__label', getString( ui.upload ) );
    V.castImageUpload( e ).then( res => {
      V.setNode( '#img-upload__label', getString( ui.change ) );
      V.gN( '.join-form__inner' ).style['border-bottom'] = 'unset';
      V.setNode( '#img-upload__preview', '' );
      V.setNode( '#img-upload__preview', V.cN( {
        t: 'img',
        r: res.src,
        y: {
          'max-width': '120px',
          'max-height': '120px',
          'margin-left': '10px',
        },
      } ) );
    } );
  }

  function handleSaveKey() {
    const text = `Key: ${ this.uPhrase }\n\nTitle: ${ this.fullId }\n\nJoined: ${ new Date().toString().substr( 4, 17 ) }\n\nInitialized by: ${ window.location.host }`;
    const blob = new Blob( [text], { type: 'text/plain' } );

    const $a = document.createElement( 'a' );
    $a.download = this.fullId + ' __key.txt'; // + window.location.hostname
    $a.href = window.URL.createObjectURL( blob );
    $a.click();

    V.setNode( '.join-download__btn', InteractionComponents.confirmClickSpinner() );

    setTimeout( function delayNextBtn() {
      V.gN( '.join-download__btn' ).innerText = getString( ui.downloadAgain );
      V.gN( '.join-submit__btn' ).classList.remove( 'hidden' );
    }, 1200 );

  }

  function handleResetSelectors() {
    setResponse( '', 'setAsIs' );
    V.getNode( '.join-selectors' ).style.display = 'none';
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
      const title = V.castEntityTitle( input, 'Person' ); // validation of the title

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
      const hasLoc = $location.getAttribute( 'loc' );
      const hasLat = $location.getAttribute( 'lat' );
      const hasLng = $location.getAttribute( 'lng' );
      const hasRadio = getRadioIndex( 'continent' );

      if (
        hasLoc
        && $location.value
      ) {
        entityData.location = hasLoc;
        entityData.lat = hasLat;
        entityData.lng = hasLng;

        return true;
      }
      else if ( hasRadio ) {
        entityData.continent = hasRadio;
        return true;
      }
      else if ( $location.value ) {
        setResponse( 'joinResNoLat' );
        return false;
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
        entityData.avatar = getRadioIndex( 'avatar' );
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

      if ( input ) {
        if( email && V.getSetting( 'confirmEmail' ) ) {
          entityData.emailPrivate = input;
          confirmEmail();
          return false;
        }
        else if ( email ) {
          entityData.emailPrivate = input;
          return true;
        }
        else {
          setResponse( 'joinResEmail' );
          return false;
        }
      }
      else {
        if( V.getSetting( 'requireEmail' ) ) {
          setResponse( 'joinResEmail' );
          return false;
        }
        else {
          return true;
        }
      }
    }

    /* call to action */
    else if ( cardIndex == 4 ) {
      return true;
    }

  }

  function setResponse( which, setAsIs ) {
    V.getNode( '.join-submit__response' ).innerText = setAsIs ? which : getString( ui[which] );
  }

  function setSelectors() {
    V.getNode( '.join-selectors' ).style.display = 'block';
  }

  function getRadioIndex( whichForm ) {
    return Number( document.forms[ whichForm + 's'].elements[ whichForm ].value );
  }

  function confirmEmail() {

    setResponse( '', 'setAsIs' );
    V.getNode( '.join-submit__btn' ).append( InteractionComponents.confirmClickSpinner() );

    fourDigitString = V.castTag().replace( '#', '' );

    if ( V.getSetting( 'devMode' ) ) {
      setTimeout( function devModeConfirm() {
        V.getNode( '.join-form__confirm' ).style.display = 'block';
        V.setNode( '.confirm-click-spinner', 'clear' );
        setResponse( 'this is devMode: use ' + fourDigitString, 'setAsIs' );
      }, 2000 );
    }
    else {

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

  }

  function setHuman() {
    // entityData.title = '1234'; // uncomment for testing a server error

    if( V.cA() ) { // user has own wallet
      entityData.evmAddress = V.cA();
    }

    V.setEntity( entityData )
      .then( res => {
        if ( res.success ) {
          console.log( 'successfully set entity: ', res );

          uPhrase = res.data[0].auth.uPhrase;
          fullId = res.data[0].fullId;

          /** automatically join */
          V.setAuth( uPhrase )
            .then( data => {
              console.log( data );
              if ( data.success ) {
                console.log( 'auth success' );
                drawSuccess();
                setDownloadKeyBtn();
              }
              else {
                throw new Error( 'could not set auth after setting new entity' );
              }
            } )
            .catch( err => {
              console.log( err );
              setResponse( getString( ui.authFail ), 'setAsIs' );
              drawUphraseDisplay( uPhrase );
            } );

          /** set state and cache */
          V.setActiveEntity( res.data[0] );
          Join.draw( 'new entity was set up' );

          VMap.draw( res.data );

        }
        else {
          throw new Error( res.message );
        }
      } )
      .catch( res => {
        console.log( 'could not set entity: ', res );
        setResponse( ( res.message || res ) + ' ' + getString( ui.startAgain ), 'setAsIs' );
        drawError();
      } );
  }

  function setDownloadKeyBtn() {
    const $btn = V.gN( '.join-download__btn' );
    $btn.innerText = getString( ui.download );
    $btn.addEventListener( 'click', handleSaveKey.bind( {
      uPhrase: uPhrase,
      fullId: fullId,
    } ) );
  }

  function drawUphraseDisplay( uPhrase ) {
    V.sN( '.join-download__btn', 'clear' );
    V.sN( '.join-header__top', getString( ui.joinFailTop ) );
    V.sN( '.join-header__bottom', V.cN( {
      t: 'input',
      a: {
        value: uPhrase,
        type: 'password',
      },
      e: {
        focus: Join.handleViewFirstKeyFocus,
        blur: Join.handleViewFirstKeyFocus,
      },
    } ) );
  }

  function drawSuccess() {
    V.sN( '.join-header__top', getString( ui.joinSuccessTop ) );
    V.sN( '.join-header__bottom', getString( ui.joinSuccessBottom ) );
  }

  function drawError() {
    V.sN( '.join-header__top', getString( ui.joinFailTop ) );
    V.sN( '.join-download__btn', 'clear' );
  }

  function drawAltSubmitBtn( which ) {
    const $submitBtn = V.gN( '.join-submit__btn' );
    if ( 'call-to-action' == which ) {
      $submitBtn.classList.add( 'hidden', 'bkg-brand-secondary', 'txt-offblack' );
      $submitBtn.innerText = getString( ui.callToAction );
    }
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
            // {
            //   c: 'join-form__title',
            //   h: getString( ui[formTitle] ),
            // },
            {
              t: 'input',
              c: 'join-form__input' + ( formTitle == 'joinFormEmailConfirm' ? ' join-form__input-confirm' : '' ),
              a: {
                // value: 'Test This',
                placeholder: getString( ui[formTitle] ),
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
            // {
            //   c: 'join-form__title',
            // },
            {
              t: 'label',
              i: 'img-upload__label',
              c: 'cursor-pointer',
              a: {
                for: 'img-upload__file',
              },
              e: {
                click: handleResetSelectors,
              },
              h: getString( ui.joinFormImg ),
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
            // {
            //   c: 'join-form__title',
            //   h: getString( ui.joinFormLoc ),
            // },
            {
              t: 'input',
              i: 'join-form__loc', // id needed by Google Places API
              c: 'join-form__input join-form__loc',
              e: {
                focus: handleResetSelectors,
              },
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
            h: [
              {
                t: 'input',
                i: 'join-selector__cont' + i,
                c: 'join-selector__input',
                a: {
                  type: 'radio',
                  name: 'continent',
                  value: i+1,
                },
              },
              {
                t: 'label',
                c: 'join-selector__label',
                k: handleSelector.bind( continent ),
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
          h: [1, 2, 3, 4, 5].map( ( string, i ) => V.cN( {
            c: 'join-selector',
            h: [
              {
                t: 'input',
                i: 'join-selector__img' + i,
                c: 'join-selector__input',
                a: {
                  type: 'radio',
                  name: 'avatar',
                  value: i+1,
                  checked: i == randAvatar ? true : undefined,
                },
              },
              {
                t: 'label',
                c: 'join-selector__img',
                k: handleSelector.bind( i ),
                a: {
                  for: 'join-selector__img' + i,
                },
                // h: castAvatarSvg( i, { color: 'black' } ),
                h: {
                  t: 'img',
                  r: JoinAvatars.dataUris[i],
                  a: {
                    height: '120%',
                  },
                },
              },
            ],
          } ) ),
        },
      },
    );
  }

  function joinDownloadKeyBtn() {
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
            k: handleSubmit,
          },
        ],
      },
    );
  }

  // function castAvatarSvg( i, options ) {
  //   return V.cN( {
  //     svg: true,
  //     c: 'join-selector__svg',
  //     h: {
  //       t: 'path',
  //       c: 'join-selector__path',
  //       a: {
  //         fill: options && options.color ? options.color : 'white',
  //         d: svgPaths[i],
  //       },
  //     },
  //   } );
  // }

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

  function joinAwaitKey() {
    return [
      joinHeader( 'joinAwaitKeyTop', 'joinAwaitKeyBottom' ),
      joinDownloadKeyBtn(),
    ];
  }

  /* ================  public components ================ */

  function joinOverlay() {
    return V.cN( {
      t: 'joinoverlay',
      c: 'join-overlay no-txt-select',
      k: handleJoinOverlayClick,
      h: {
        c: 'join-card',
        k: handleJoinCardClick,
        h: [
          {
            c: 'join-content-wrapper',
            h: [
              joinName,
              joinLocation,
              joinImage,
              joinEmail,
              joinAwaitKey,
            ][cardIndex](),
          },
          {
            c: 'join-submit-wrapper',
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
