const Feature = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the app's feature section
  *
  *
  */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  function cacheDom() {
    DOM.$feature = V.getNode( 'feature' );
  }

  function presenter( options ) {
    const $content = typeof options == 'object' ? options : options.content ? options.content : undefined;
    return {
      $content: $content,
      fade: options.fade
    };

  }

  function view( featureData ) {
    if ( featureData.fade == 'out' ) {
      V.setAnimation( 'feature', 'fadeOut' );
      return;
    }
    if ( featureData.fade == 'in' || featureData.$content ) {
      DOM.$feature.innerHTML = '';
      V.setNode( DOM.$feature, featureData.$content );
      V.setAnimation( 'feature', 'fadeIn' );
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
