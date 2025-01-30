const Header = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the theme's header
   *
   */

  'use strict';

  /* ============ public methods and exports ============ */

  function launch() {
    const $header = CanvasComponents.header();
    const $balance = CanvasComponents.balance();
    const $entityNav = NavComponents.entityNav();
    const $userNav = NavComponents.userNav();
    const $serviceNav = NavComponents.serviceNav();
    const $interactions = CanvasComponents.interactions();
    const $magicButton = MagicButton.frame();
    const $helpButton = Help.frame();

    V.setNode( $header, [ $balance, $entityNav, $userNav, $serviceNav, $interactions, $helpButton, $magicButton ] );

    V.setNode( 'body', $header );
    MagicButton.draw( 'search' );
  }

  return {
    launch: launch,
  };

} )();
