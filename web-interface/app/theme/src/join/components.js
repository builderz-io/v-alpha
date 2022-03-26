const JoinComponents = ( function() { // eslint-disable-line no-unused-vars

    /**
     * V Theme Module for join components
     *
     */
  
    'use strict';

    let cardIndex = 0;
    const randomChecked = V.castRandomInt(0, 4);
  
    /* ============== user interface strings ============== */
  
    const ui = {
        joinNameTop: 'Name yourself.',
        joinNameBottom: 'This is for your personal profile.',
        joinLocTop: 'Add your location.',
        joinLocBottom: '',
        joinImgTop: 'Add your image.',
        joinImgBottom: '',
        joinEmailTop: 'Add your email.',
        joinEmailBottom: 'This is private, visible to admins only.',

        joinFormName: 'Name',
        joinFormLoc: 'Location',
        joinFormImg: 'Upload',
        joinFormEmail: 'Email',

        joinResLoc: 'Please add your continent at least.',
        joinResImg: 'Please choose an avatar at least',
      
    };
  
    function getString( string, scope ) {
      return V.i18n( string, 'join', scope || 'join content' ) + ' ';
    }

    const svgPaths = [ 'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z', 

    'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z',

    'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z',

    'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z',

    'M19.365,4.614,21.61,7.763,32.971,4.614M7.56,29.133l6.146-6.009-3.7-3.97m8.426-14.54L15.148,7.573l5.525.206M5.666,4.615,6.842,7.033l6.5.4m-4.2,9.715,4.8-8.96L0,7.436M9.7,17.719l4.537,4.874,5-4.9L20.8,8.55l-6.1-.313Z'
    ]
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
      
    },
    'join-form__input': {
      
    },
    // selectors
    'join-selectors': {
      // 'display': 'none',

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
      'width':  '30px',
      'height': '30px',
    },

    // submit
    'join-submit': {
      'display': 'flex',
      'flex-direction': 'column',
      'flex': 1,
      'align-items': 'center',
    },

    'join-submit__response': {
      'color': 'crimson',
      'padding': '0.8rem',
      
    },

    'join-submit__btn': {
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
        if ( !validateInput() ) { return };
        cardIndex += 1 ;
        V.sN('joinoverlay', 'clear');
        V.sN('body', JoinComponents.joinOverlay() );
        if ( cardIndex == 1 ) {
           Google.initAutocomplete( 'join-form' );
        }
      }
    
      function handleSelector() {
        const $elem = V.getNode('.join-form__input') || V.getNode('.join-form__loc');
        $elem.value = this; 
      }
  
    /* ================== private methods ================= */

      function validateInput() {
        if ( cardIndex == 0 ) {
          // check name
          const input = V.getNode( '.join-form__input' ).value ;
          if (input) {
            return true;
          }
          else {
            return true;
          }

        } 
        else if ( cardIndex == 1 ) {
          const hasLat = V.getNode('.join-form__loc').getAttribute( 'lat' ) ;
          const hasRadio = getRadioValue( 'continent' )

          console.log(hasRadio);
          // check location
          if (hasLat) {
            return true;
          }
          else if (hasRadio) {
            return true;
          }
          else {
            setResponse('joinResLoc');
            V.setToggle('.join-selectors');
            return false;
          }
          
          
        }
        else if ( cardIndex == 2 ) {
          const input = V.getNode( '.join-form__input' ).value ;
          // check image
          if (input) {
            return true;
          }
          else {
            setResponse('joinResImg');
            V.setToggle('.join-selectors');
            return false;
          }
        } 
        else if ( cardIndex == 3 ) {
          // check email
        }  

      }

      function setResponse(which) {
        V.getNode('.join-submit__response').innerText = getString(ui[which]);
        
      }

      function getRadioValue( whichForm ) {
        return document.forms[ whichForm + 's'].elements[ whichForm ].value;
      }
    /* ================ components ================ */

      function joinHeader( headerTop, headerBottom ) {
        return V.cN( 
          { 
            c: 'join-header',
            h: [
                {
                  c: 'join-header__top',
                  h: getString(ui[headerTop]),
                },
                {
                  c: 'join-header__bottom',
                  h: getString(ui[headerBottom]),
                },
             ],
          },
        )
      }

      function joinForm(formTitle) {
        return V.cN(
          {
            c: 'join-form',
            h: {
              c:'join-form__inner',
              h: [
                  {
                    c: 'join-form__title',
                    h:  getString(ui[formTitle]),
                  },
                  {
                    t: 'input',
                    c: 'join-form__input',
                    
                    //focus
                  },
              ],
            },
          },

        )
      }

      function joinFormLoc() {
        return V.cN(
          {
            c: 'join-form',
            h: {
              c:'join-form__inner',
              h: [
                  {
                    c: 'join-form__title',
                    h:  getString(ui.joinFormLoc),
                  },
                  {
                    t: 'input',
                    i: 'join-form__loc',
                    c: 'join-form__loc',
                  
                    //focus
                  },
              ],
            },
          },

        )
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
              h: [ 'Africa', 'Asia', 'South-America', 'Europe', 'Australia', 'North-Amercia', 'Antarctica' ].map((continent, i) => {
                  return V.cN( {
                    c: 'join-selector',
                    k: handleSelector.bind(continent),
                    h: [
                      {
                        t: 'input',
                        i: 'join-selector__cont' + i,
                        c: 'join-selector__input', 
                        a: {
                          type: 'radio',
                          name: 'continent',
                          value: i, 
                        }
                      },
                      {
                        t: 'label',
                        c: 'join-selector__label', 
                        h: continent,
                        a: {
                          for: 'join-selector__cont' + i,  
                        }
                      },
                    ],
                  } )
              } ),
            }, 
          },
        )
      }

      function joinSelectorsImg() {
        return V.cN(
          {
            c: 'join-selectors hidden', 
            h: {
              t: 'form',
              a: {
                name: 'human-profile-images',
              },
              c: 'join-selectors__form',
              h: svgPaths.map(( image, i ) => {
                  return V.cN( {
                    c: 'join-selector', 
                    k: handleSelector.bind(image),
                    h: [
                      {
                        t: 'input',
                        i: 'join-selector__img' + i,
                        c: 'join-selector__input', 
                        a: {
                          type: 'radio',
                          name: 'human-profile-image',
                          value: i,
                          checked: i == randomChecked ? true : undefined , 
                        }
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
                              d: image,
                            }
                          }
                        },
                        a: {
                          for: 'join-selector__img' + i,  
                        }
                      },
                    ],
                  } )
              } ),
            }, 
          },
        )
      }

      function joinSubmit() {
        return V.cN(
          {
            c: 'join-submit',
            h: [
              {
                c: 'join-submit__response',
//                h: 'Please, add your continent at least.',
              },
              {
                c: 'join-submit__btn',
                h: 'Next',
                k: handleNext,
              },
            ]
          }          
        )  
      }

    /* ================ cards ================ */

      function joinName() {
        return [
          joinHeader('joinNameTop', 'joinNameBottom'),
          joinForm('joinFormName'),
        ]
      }

      function joinLocation() {
        return [
          joinHeader('joinLocTop', 'joinLocBottom'),
          joinFormLoc(),
          joinSelectorsCont(),
        ]
      }

      function joinImage() {
        return [
          joinHeader('joinImgTop', 'joinImgBottom'),
          joinForm('joinFormImg'),
          joinSelectorsImg(),
        ]
      }

      function joinEmail() {
        return [
          joinHeader('joinEmailTop', 'joinEmailBottom'),
          joinForm('joinFormEmail'),
        ]
      }


    /* ================  public components ================ */

    function joinOverlay() {
      return V.cN( {
        t: 'joinoverlay',
        c: 'join-overlay',
        h: {
          c: 'join-card',
          h: [ 
            {
              c: 'join-content-wrapper',
              h:  [
                joinName, 
                joinLocation, 
                joinImage, 
                joinEmail
              ][cardIndex](),
            },
            {
              c: 'join-submit',
              h: joinSubmit(),
            } 
          ], 
        },
      } )  
    }
  
    function joinBtn() {
      const sc = V.getState( 'screen' );
      const colorBkg = 'rgba(' + sc.buttonBkg + ', 1)';
  
      return V.cN( { // #ffa41b
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
