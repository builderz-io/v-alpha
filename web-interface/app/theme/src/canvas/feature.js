const Feature = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw the feature section
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function presenter( options ) {
    const $content = typeof options == 'object' ? options : options.content ? options.content : undefined;
    return {
      $content: $content,
      fade: options.fade
    };

  }

  function view( featureData ) {
    const $feature = V.getNode( 'feature' );
    if ( featureData.fade == 'out' ) {
      V.setAnimation( 'feature', 'fadeOut' );
      return;
    }
    if ( featureData.fade == 'in' || featureData.$content ) {
      $feature.innerHTML = '';
      V.setNode( $feature, featureData.$content );
      V.setAnimation( 'feature', 'fadeIn' );
    }
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNode( 'body', CanvasComponents.feature() );
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
