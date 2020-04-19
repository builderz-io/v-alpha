const Haze = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module to show/hide the haze
  *
  *
  */

  'use strict';

  /* ================== private methods ================= */

  function presenter( options ) {
    return options;
  }

  function view( hazeData ) {
    const m = V.getState( 'menu' );
    const $haze = V.getNode( 'haze' );

    if ( hazeData && hazeData.fade == 'out' ) {
      $haze.classList.remove( 'bkg-white' );
      $haze.classList.remove( 'bkg-black' );
      V.setState( 'menu', { isHazed: false } );
      V.setAnimation( $haze, 'fadeOut', { delay: 0.1, duration: 1 } );
      return;
    }

    if ( m.isHazed != true ) {
      if ( hazeData && hazeData.color ) {
        hazeData.color == 'black' ? $haze.className += ' bkg-black' : null;
      }
      else {
        $haze.className += ' bkg-white';
      }
      V.setState( 'menu', { isHazed: true } );
      V.setAnimation( $haze, 'fadeIn', { delay: 2, duration: 3 } );
    }
  }

  /* ============ public methods and exports ============ */

  function draw( options ) {
    V.setPipe(
      presenter,
      view
    )( options );
  }

  return {
    draw: draw,
  };

} )();
