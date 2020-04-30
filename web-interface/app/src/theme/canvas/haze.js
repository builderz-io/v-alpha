const Haze = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module to show/hide the haze
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function presenter( options ) {
    return options;
  }

  function view( options ) {

    if ( options && options.fade == 'out' ) {
      V.setState( 'header', { isHazed: false } );
      V.setAnimation( 'haze', 'fadeOut', { delay: 0.1, duration: 1 } );
      return;
    }

    if ( V.getState( 'header' ).isHazed != true ) {
      V.setState( 'header', { isHazed: true } );
      V.setAnimation( 'haze', 'fadeIn', { delay: 2, duration: 3 } );
    }
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNode( 'body', CanvasComponents.haze() );
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
