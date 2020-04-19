const Background = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Module to control the background
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function presenter( options ) {
    return options;
  }

  function view() {

  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNode( 'body', CanvasComponents.background() );
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
