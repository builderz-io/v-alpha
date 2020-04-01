const Haze = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module to show/hide the haze
  *
  *
  */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  function cacheDom() {
    DOM.$haze = V.getNode( 'haze' );
  }

  function presenter( options ) {
    return options;
  }

  function view( hazeData ) {
    const m = V.getState( 'menu' );

    if ( hazeData && hazeData.fade == 'out' ) {
      DOM.$haze.classList.remove( 'bkg-white' );
      DOM.$haze.classList.remove( 'bkg-black' );
      V.setState( 'menu', { isHazed: false } );
      V.setAnimation( DOM.$haze, 'fadeOut', { delay: 0.1, duration: 1 } );
      return;
    }

    if ( m.isHazed != true ) {
      if ( hazeData && hazeData.color ) {
        hazeData.color == 'black' ? DOM.$haze.className += ' bkg-black' : null;
      }
      else {
        DOM.$haze.className += ' bkg-white';
      }
      V.setState( 'menu', { isHazed: true } );
      V.setAnimation( DOM.$haze, 'fadeIn', { delay: 2, duration: 3 } );
    }
  }

  /* ============ public methods and exports ============ */

  function launch() {
    cacheDom();
  }

  function draw( options ) {
    V.setPipe(
      presenter,
      view
    )( options );
  }

  return {
    launch: launch,
    draw: draw,
  };

} )();
