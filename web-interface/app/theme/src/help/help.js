const Help = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Help Button Module
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      help: 'Help',
      home: 'Homepage',
      profile_person: 'Personal Profile',
      profile_plot: 'Plot Profile',
      profile_general: 'Profile',
      general_content: '',

    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ====================== styles ====================== */

  V.setStyle( {
    'help-btn': {
      'top': 'var(--help-btn-top)',
      'left': 'var(--help-btn-left)',
      'border-radius': '20px',
      'background': 'white',
      'height': '2.5rem',
      'width': '2.5rem',
      'transition': 'all 0.3s ease-in-out', // using transition instead of V.setAnimation is better here
    },
    'help-btn__btn': {
      'width': '2rem',
      'height': '2rem',
      'top': '4px',
      'right': '4px',
      'background': 'white',
      'border-radius': '9999px',
      'align-items': 'center',
    },
    'help-overlay': {
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      background: 'rgba(0,0,0,0.8)',
    },
    'help-overlay__content': {
      'background': 'white',
      'width': '85vw',
      'max-width': '700px',
      'height': '75vh',
      'margin': '14vh auto',
      'padding': '1.5rem',
      'border-radius': '32px',
    },
  } );

  /* ================== private methods ================= */

  function handleHelpOverlayClose() {
    V.setNode( '.help-overlay', 'clear' );
  }

  function handleStopPropagation( e ) {
    e.stopPropagation();
  }

  function handleHelp( e ) {
    let which;
    const state = V.getState( 'active' );

    if ( !state.navItem || state.navItem == '/' ) {
      which = 'home';
    }
    else if (
      state.navItem.includes( '/profile' )
      && state.lastViewedRoleCode
    ) {
      if ( state.lastViewedRoleCode == 'aa' ) {
        which = 'profile_person';
      }
      else if ( state.lastViewedRoleCode == 'ap' ) {
        which = 'profile_plot';

      }
      else {
        which = 'profile_general';
      }
    }
    else {
      const lastSegment = state.navItem.split( '/' ).pop();
      if ( lastSegment ) {
        which = lastSegment;
      }
      else {
        which = 'general_content'; // specific page help not available
      }
    }

    Help.draw( which );
  }

  function view( which, options ) {

    const $helpOverlay = V.cN( {
      t: 'help-overlay',
      c: 'help-overlay fixed',
      k: handleHelpOverlayClose,
      h: {
        c: 'help-overlay__content relative',
        k: handleStopPropagation,
        h: [
          {
            t: 'h2',
            c: 'font-bold mb-r',
            h: V.getString( ui.help ),
          },
          {
            t: 'p',
            c: 'mb-r',
            h: V.getString( ui[which] || V.capitalizeFirstLetter( which ) ),
          },
          {
            t: 'p',
            h: 'Content here',
          },
        ],
      },
    } );

    V.setNode( '.help-overlay', 'clear' );
    V.setNode( 'body', $helpOverlay );
  }

  /* ================  public components ================ */

  function draw( which, options ) {
    view( which, options );
  }

  function drawReset() {
    close();
  }

  function frame() {
    return V.cN( {
      t: 'help-btn',
      c: 'help-btn flex relative pill-shadow cursor-pointer',
      h: {
        c: 'help-btn__btn flex absolute justify-center',
        h: V.getIcon( 'question_mark', '17px' ),
        k: handleHelp,
      },
    } );
  }

  /* ====================== export ====================== */

  return {
    drawReset: drawReset,
    frame: frame,
    draw: draw,
  };

} )();
