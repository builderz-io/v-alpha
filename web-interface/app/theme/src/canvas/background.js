const Background = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the background (map)
   *
   */

  'use strict';

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNode( 'body', CanvasComponents.background() );
  }

  return {
    launch: launch,
  };

} )();
