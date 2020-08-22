const Logo = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the network logo
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function view( options ) {
    positionLogo( options );
  }

  function drawLogo() {
    const pageRect = V.getNode( 'page' ).getBoundingClientRect();

    V.setNode( 'body', CanvasComponents.networkLogo() );

    positionLogo( pageRect.height > V.getState( 'page' ).closed ? 'peek' : 'closed' );
  }

  function positionLogo( pagePos ) {
    const $logo = V.getNode( 'logo' );
    const s = V.getState( 'screen' );
    if ( pagePos == 'closed' ) {
      V.setAnimation( $logo, s.width < 800 ? { bottom: '40px', left: '4px' } : { bottom: '70px', left: '35px' }, { delay: 0.5 } );
    }
    else if ( pagePos == 'peek' ) {
      V.setAnimation( $logo, s.width < 800 ? { bottom: '110px', left: '4px' } : { bottom: '140px', left: '35px' }, { delay: 0.5 } );
    }
    if ( !V.getVisibility( 'logo' ) ) {
      V.setAnimation( $logo, 'fadeIn', { delay: 1, duration: 3 } );
    }
  }

  /* ============ public methods and exports ============ */

  function launch() {
    setTimeout( drawLogo, 1500 );
  }

  function draw( options ) {
    view( options );
  }

  return {
    launch: launch,
    draw: draw,
  };

} )();
