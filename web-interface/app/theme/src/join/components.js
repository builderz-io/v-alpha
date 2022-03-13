const JoinComponents = ( function() { // eslint-disable-line no-unused-vars

    /**
     * V Theme Module for join components
     *
     */
  
    'use strict';

    let cardIndex = 0;
  
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


        
    //   upload: 'uploading...',
    //   change: 'Change',
    //   image: 'Image',
    //   titleOrCity: 'Enter a title or city name',
  
    //   key: 'Key',
    //   title: 'Title',
    //   email: 'Email',
    //   emailConfirm: '4 digits',
    //   loc: 'Location',
    //   descr: 'Description and Links',
    //   target: 'Target',
    //   unit: 'Unit',
    //   search: 'Search',
    //   create: 'create',
    //   query: 'search',
    };
  
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
      }
  
    /* ================== private methods ================= */

      function validateInput() {
        const input = V.getNode('.join-form__input').value ;
        console.log(input);
        if ( cardIndex == 0 ) {
          // check name
          return true;
        } 
        else if ( cardIndex == 1 ) {
          // check location
          if (input) {
            return true;
          }
          else {
            V.setToggle('.join-selectors')
            return false;
          }
          
        }
        else if ( cardIndex == 2 ) {
          // check image
        } 
        else if ( cardIndex == 3 ) {
          // check email
        }  

      }

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

      function joinSelectorsCont() {
        return V.cN(
          {
            c: 'join-selectors hidden',
            h: {
              t: 'form',
              c: 'join-selectors__form',
              h: [ 'Africa', 'Asia', 'South-America', 'Europe', 'Australia', 'North-Amercia', 'Antarctica' ].map((continent, i) => {
                  return V.cN( {
                    c: 'join-selector', 
                    h: [
                      {
                        t: 'input',
                        i: 'join-selector__cont' + i,
                        c: 'join-selector__input', 
                        a: {
                          type: 'radio',
                          name: 'continents',
                          value: i+1, 
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
              c: 'join-selectors__form',
              h: [ 'Bild1', 'Bild2', 'Bild3', 'Bild4', 'Bild5' ].map(( image, i ) => {
                  return V.cN( {
                    c: 'join-selector', 
                    h: [
                      {
                        t: 'input',
                        i: 'join-selector__img' + i,
                        c: 'join-selector__input', 
                        a: {
                          type: 'radio',
                          name: 'human-profile-images',
                          value: i+1, 
                        }
                      },
                      {
                        t: 'label',
                        c: 'join-selector__label', 
                        h: image,
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
                h: 'Please, add your continent at least.',
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
  
      function joinName() {
        return [
          joinHeader('joinNameTop', 'joinNameBottom'),
          joinForm('joinFormName'),
        ]
      }

      function joinLocation() {
        return [
          joinHeader('joinLocTop', 'joinLocBottom'),
          joinForm('joinFormLoc'),
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
