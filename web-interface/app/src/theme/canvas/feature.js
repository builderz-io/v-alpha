const Feature = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the app's feature section
  *
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
