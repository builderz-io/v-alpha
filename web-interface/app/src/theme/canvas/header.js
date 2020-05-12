const Header = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the theme's header
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
    const $header = CanvasComponents.header();
    const $balance = CanvasComponents.balance();
    const $entityNav = CanvasComponents.entityNav();
    const $serviceNav = CanvasComponents.serviceNav();
    const $interactions = CanvasComponents.interactions();

    V.setNode( $header, [ $balance, $entityNav, $serviceNav, $interactions ] );

    V.setNode( 'body', $header );
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
