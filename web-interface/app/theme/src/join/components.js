const JoinComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
     * V Theme Module for join components
     *
     */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      join: 'Join',
      upload: 'uploading...',
      change: 'Change image',
      next: 'Next',
      skip: 'skip',

      joinNameTop: 'Name yourself.',
      joinNameBottom: 'This is for your personal profile.',
      joinTitleTop: 'Add the title.',
      joinTitleBottom: '',
      joinDescrTop: 'Add a description.',
      joinDescrBottom: 'Include social media and other links here too.',
      joinTargetTop: 'Add your target price and its unit.',
      joinTargetBottom: 'For example "200" per "hour" or "120" per "ticket".',
      joinDateTimeTop: 'Add the start and end date and time.',
      joinDateTimeBottom: '',
      joinLocTop: 'Add your location.',
      joinLocBottom: 'Start typing, then pick from the suggestions.',
      joinLocPickerTop: 'Pick the exact location.',
      joinLocPickerBottom: 'Click the area to zoom in closer.',
      joinImgTop: 'Add your image.',
      joinImgBottom: '',
      joinEmailTop: 'Add your email.',
      joinEmailBottom: 'This is private, visible to admins only.',
      joinAwaitKeyTop: 'One moment... setting up the identity.',
      joinAwaitKeyBottom: '',
      joinKeyImportance: 'Important: Some of your data will be encrypted. Losing the key file or its contents means losing your account permanently. Backup your keys securely.',
      joinSelectGroupsTop: 'Select plots',
      joinSelectGroupsBottom: 'Select more than one plot to join in a single group',

      joinFormName: 'Name',
      joinFormTitle: 'Title',
      joinFormDescr: 'Description',
      joinFormTarget: 'Target',
      joinFormUnit: 'Unit',
      joinFormStartDateTime: 'Start',
      joinFormEndDateTime: 'End',
      joinFormImg: 'Upload',
      joinFormEmail: 'Email',
      joinFormEmailConfirm: '4-digit code',

      africa: 'Africa',
      asia: 'Asia',
      europe: 'Europe',
      australia: 'Australia',
      northAmerica: 'North-Amercia',
      southAmerica: 'South-America',
      antarctica: 'Antarctica',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

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
      'min-height': '41vh',
      'margin': '14vh auto',
      'padding': '1.5rem',
      'border-radius': '32px',
      'transition': 'max-width 0.5s ease-out, min-height 0.5s ease-out',
    },
    'join-card-extended': {
      'width': '95vw',
      'max-width': '1000px',
      'min-height': '70vh',
      'margin': '9vh auto',
    },
    // wrapper
    'join-card-inner-wrapper': {
      display: 'contents',
    },
    'join-content-wrapper': {
      flex: '1',
    },
    //header
    'join-header': {
      'padding': '1.5rem',
      'font-family': 'IBM Plex Medium',
      'color': 'rgba(0,0,0,0.8)',
      'font-size': '1.25rem',
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
      'font-size': '1.25rem',
    },
    'join-form__inner': {
      'display': 'flex',
      'justify-content': 'space-between',
      'padding': '0.45rem',
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
    'join-key-importance': {
      'background': 'moccasin',
      'padding': '2rem',
      'margin': '2rem 1rem',
      'border-radius': '20px',
    },
    'join-key-importance-text': {
      color: 'red',
    },

    'join-submit__response': {
      'color': 'crimson',
      'padding': '0.8rem',
      'text-align': 'center',
    },
    'join-submit__skip': {
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

    'join-option-box': {
      padding: '1.5rem',
    },
    'join-option-box__option': {
      padding: '0.5rem 0',
    },
    'join-option-box__option__label': {
      'margin-left': '0.5rem',
    },
  },
  );

  /* ================== event handlers ================== */

  function handleJoin() {
    Join.draw( 'initialize join' );
  }

  function handleJoinOverlayClick() {
    JoinRoutine.reset();
    V.sN( 'joinoverlay', 'clear' );
  }

  function handleJoinCardClick( e ) {

    /* avoid closing the overlay */
    e.stopPropagation();
  }

  function handleSelector() {
    const $elem = V.getNode( '.join-form__input' ); // || V.getNode( '.join-form__loc' );
    $elem ? $elem.value = this : null;
    V.getNode( '.join-submit__response' ).innerText = '';
  }

  function handleImageUpload( e ) {
    V.setNode( '.join-form__title', 'clear' );
    V.setNode( '#img-upload__label', V.getString( ui.upload ) );
    V.castImageUpload( e ).then( res => {
      V.setNode( '#img-upload__label', V.getString( ui.change ) );
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

  function handleResetSelectors() {
    V.getNode( '.join-submit__response' ).innerText = '';
    V.getNode( '.join-selectors' ).style.display = 'none';
    const $europe = document.getElementById( 'join-selector__cont3' );
    if ( $europe ) { $europe.checked = false }
  }

  function handleFormFocus() {
    V.getNode( '.join-submit__response' ).innerText = '';
  }

  /* ================ components ================ */

  function joinHeader( topString, bottomString, role ) {
    return V.cN(
      {
        c: 'join-header',
        h: [
          {
            c: 'join-header__top',
            h: V.getString( ui[topString] ),
            // + ( role ? ' ' + entityData.role.toLowerCase() + '.' : '' ),
          },
          {
            c: 'join-header__bottom',
            h: V.getString( ui[bottomString] ),
          },
        ],
      },
    );
  }

  function joinForm( formTitle, addition ) {
    return V.cN(
      {
        c: 'join-form'
             + ( formTitle == 'joinFormEmailConfirm' ? ' join-form__confirm hidden' : '' ),
        h: {
          c: 'join-form__inner',
          h: [
            // {
            //   c: 'join-form__title',
            //   h: V.getString( ui[formTitle] ),
            // },
            {
              t: 'input',
              c: 'join-form__input'
                   + ( addition ? '-' + addition : '' ),
              a: {
                placeholder: ( formTitle == 'joinFormTitle'
                  ? V.getString( JoinRoutine.getEntityData().role ) + ' '
                  : '' )
                      + V.getString(
                        ui[formTitle],
                      ),
              },
              e: {
                focus: handleFormFocus,
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
              h: V.getString( ui.joinFormImg ),
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
            //   h: V.getString( ui.joinFormLoc ),
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

  function joinFormDescr() {
    return V.cN(
      {
        c: 'join-form',
        h: {
          c: 'join-form__inner',
          h: [
            // {
            //   c: 'join-form__title',
            //   h: V.getString( ui.joinFormLoc ),
            // },
            {
              t: 'textarea',
              c: 'join-form__input join-form__descr',
              a: {
                placeholder: V.getString( ui.joinFormDescr ),
              },
            },
          ],
        },
      },

    );
  }

  function joinLocPicker() {
    return V.cN(
      {
        c: 'join-loc-picker',
        h: [
          {
            c: 'join-loc-picker__map',
          },
          {
            t: 'input',
            c: 'join-loc-picker__input',
          },
        ],
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
          h: [
            V.getString( ui.africa ),
            V.getString( ui.asia ),
            V.getString( ui.southAmerica ),
            V.getString( ui.europe ),
            V.getString( ui.australia ),
            V.getString( ui.northAmerica ),
            V.getString( ui.antarctica ),
          ].map( ( continent, i ) => V.cN( {
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

    const randAvatar = V.castRandomInt( 0, 4 );

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

  function joinKeyImportanceWarning() {
    return V.cN(
      {
        c: 'join-key-importance',
        h: {
          c: 'join-key-importance-text',
          h: V.getString( ui.joinKeyImportance ),
        },
      },
    );
  }

  function nextButton() {
    return V.cN(
      {
        c: 'join-submit',
        h: [
          {
            c: 'join-submit__response',
          },
          {
            c: 'join-submit__btn join-btn',
            h: V.getString( ui.next ),
            k: JoinRoutine.handleNext,
          },
          // {
          //   c: 'join-submit__skip',
          //   h: V.getString( ui.skip ),
          //   k: JoinRoutine.handleNext,
          // },
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

  /* ================  public components ================ */

  /* Cards */

  function joinName() {
    return [
      joinHeader( 'joinNameTop', 'joinNameBottom' ),
      joinForm( 'joinFormName' ),
    ];
  }

  function joinTitle() {
    return [
      joinHeader( 'joinTitleTop', 'joinTitleBottom', true ),
      joinForm( 'joinFormTitle' ),
    ];
  }

  function joinDescription() {
    return [
      joinHeader( 'joinDescrTop', 'joinDescrBottom', true ),
      joinFormDescr(),
    ];
  }

  function joinTarget() {
    return [
      joinHeader( 'joinTargetTop', 'joinTargetBottom' ),
      joinForm( 'joinFormTarget' ),
      joinForm( 'joinFormUnit', 'unit' ),
    ];
  }

  function joinDateTime() {
    return [
      joinHeader( 'joinDateTimeTop', 'joinDateTimeBottom' ),
      joinForm( 'joinFormStartDateTime' ),
      joinForm( 'joinFormEndDateTime', 'end' ),
    ];
  }

  function joinLocation() {
    return [
      joinHeader( 'joinLocTop', 'joinLocBottom' ),
      joinFormLoc(),
      joinSelectorsCont(),
    ];
  }

  function joinLocationPicker() {
    return [
      joinHeader( 'joinLocPickerTop', 'joinLocPickerBottom' ),
      joinLocPicker(),
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
      joinForm( 'joinFormEmailConfirm', 'confirm' ),
    ];
  }

  function joinAwaitKey() {
    return [
      joinHeader( 'joinAwaitKeyTop', 'joinAwaitKeyBottom' ),
      joinDownloadKeyBtn(),
      joinKeyImportanceWarning(),
    ];
  }

  function joinOptionBox( options ) {
    return V.cN(
      {
        c: 'join-option-box',
        h: options.map( option => ( {
          c: 'join-option-box__option',
          h: [
            {
              t: 'input',
              a: {
                type: 'checkbox',
                id: option.value,
                value: option.id,
              },
            },
            {
              c: 'join-option-box__option__label',
              t: 'label',
              a: { for: option.value },
              h: option.value,
            },
          ],
        } ) ),
      },
    );
  }

  function joinSelectGroups() {
    const currentActiveEntity = V.getState( 'activeEntity' );
    const holdedPlots = currentActiveEntity.holderOf
      .filter( entity => V.castRole( entity.c ) === 'Plot' )
      .map( entity => ( { value: entity.fullId, id: entity.a } ) );

    return [
      joinHeader( 'joinSelectGroupsTop', 'joinSelectGroupsBottom' ),
      joinOptionBox( holdedPlots ),
    ];
  }

  /* Main overlay with card being "filled in" */

  function joinOverlay( card ) {
    return V.cN( {
      t: 'joinoverlay',
      c: 'join-overlay no-txt-select',
      k: handleJoinOverlayClick,
      h: {
        c: 'join-card',
        k: handleJoinCardClick,
        h: joinOverlayContent( card ),
      },
    } );
  }

  function joinOverlayContent( card ) {
    return V.cN( {
      c: 'join-card-inner-wrapper',
      h: [
        {
          c: 'join-content-wrapper',
          h: card(),
        },
        {
          c: 'join-submit-wrapper',
          h: nextButton(),
        },
      ],
    } );
  }

  /* Join button */

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
            h: V.getString( ui.join ),
          },
        ],
      },
    } );
  }

  /* ====================== export ====================== */

  return {
    joinOverlay: joinOverlay,
    joinOverlayContent: joinOverlayContent,
    joinBtn: joinBtn,

    joinName: joinName,
    joinTitle: joinTitle,
    joinDescription: joinDescription,
    joinTarget: joinTarget,
    joinDateTime: joinDateTime,
    joinLocation: joinLocation,
    joinLocationPicker: joinLocationPicker,
    joinImage: joinImage,
    joinEmail: joinEmail,
    joinOptionBox: joinOptionBox,
    joinSelectGroups: joinSelectGroups,
    joinAwaitKey: joinAwaitKey,

    handleJoinOverlayClick: handleJoinOverlayClick,

  };

} )();
