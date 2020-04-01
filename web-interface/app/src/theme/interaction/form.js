const Form = ( function() { // eslint-disable-line no-unused-vars
  /**
  * Form layouts
  *
  *
  */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  function cacheDom() {
    DOM.$form = V.getNode( 'form' );
  }

  function presenter( which, options ) {
    if ( options && options.fade == 'out' ) { return { fadeOut: true } }
    if ( options && options.error == 'invalid title' ) { return { error: 'invalid title' } }

    const $form = InteractionComponents.form();

    if ( which == 'new entity' ) {
      V.setNode( $form, [
        InteractionComponents.title(),
        InteractionComponents.loc(),
        InteractionComponents.desc(),
        InteractionComponents.target(),
        InteractionComponents.unit(),
        InteractionComponents.locLat(),
        InteractionComponents.locLng()
      ] );
    }
    else if ( which == 'search' ) {
      V.setNode( $form, InteractionComponents.searchForm() );
    }
    else {
      V.setNode( $form, [ InteractionComponents.title(), InteractionComponents.desc() ] );
    }

    return {
      layout: which,
      $form: $form
    };
  }

  function view( formData ) {
    if ( formData.fadeOut ) {
      DOM.$form.innerHTML = '';
      V.setAnimation( DOM.$form, 'fadeOut', { delay: 0.2, duration: 1 } );
    }
    else if ( formData.error == 'invalid title' ) {
      DOM.$formtitle = V.getNode( '.plusform__title' );
      DOM.$formtitle.setAttribute( 'placeholder', V.i18n( 'Please choose another title' ) );
      DOM.$formtitle.value = '';
      DOM.$formtitle.className += ' border-error';
    }
    else {
      V.setNode( DOM.$form, formData.$form );
      V.setAnimation( DOM.$form, 'fadeIn', { delay: 0.2, duration: 1 } );
      Google.initAutocomplete( 'plusform' ); // + __loc, __lng and __lat
      // Page.draw( { pos: 'closed', reset: false } );
      // Button.draw( ( formData.layout == 'search' ? 'plus' : 'plus search' ), { fade: 'out' } );
      Button.draw( 'all', { fade: 'out' } );
      Button.draw( formData.layout == 'search' ? 'close search' : 'close send', { delay: 1 } );
    }
  }

  /* ============ public methods and exports ============ */

  function launch() {
    cacheDom();
  }

  function draw( which, options ) {
    view( presenter( which, options ) );
  }

  return {
    launch: launch,
    draw: draw
  };

} )();
