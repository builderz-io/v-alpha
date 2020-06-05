const Form = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module to draw forms
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function presenter( which, options ) {
    if ( options && options.fade == 'out' ) { return { fadeOut: true } }
    if ( which == 'error' ) { return options }

    const $form = InteractionComponents.form();

    if ( which == 'new entity' ) {

      const values = {
        title: undefined,
        role: undefined,
        location: undefined,
        lat: undefined,
        lng: undefined,
        description: undefined,
        unit: undefined,
        target: undefined
      };

      const lastForm = V.castJson( V.getCookie( 'last-form' ) );

      if ( lastForm ) {
        values.title = lastForm.title;
        values.location = lastForm.location;
        values.lat = lastForm.lat;
        values.lng = lastForm.lng;
        values.description = lastForm.description;
        values.unit = lastForm.unit;
        values.target = lastForm.target;
      }

      V.setNode( $form, [
        InteractionComponents.formField( 'title', values.title ),
        InteractionComponents.formField( 'location', values.location, values.lat, values.lng ),
        InteractionComponents.formField( 'description', values.description ),
        InteractionComponents.formField( 'target', values.target ),
        InteractionComponents.formField( 'unit', values.unit ),
        InteractionComponents.formUploadImage()
      ] );
    }
    else if ( which == 'search' ) {
      V.setNode( $form, [
        InteractionComponents.formField( 'search' ),
        InteractionComponents.formSearchFilter(),
      ] );
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
      if ( V.getNode( 'form' ) ) {
        V.setAnimation( 'form', 'fadeOut', { delay: 0.2, duration: 1 } ).then( () => {
          V.setNode( 'form', 'clear' );
        } );
      }
    }
    else if ( formData.status == 'invalid title' ) {
      const $formtitle = V.getNode( '#plusform__title' );
      $formtitle.setAttribute( 'placeholder', V.i18n( 'Please choose another title', 'placeholder', 'form error' ) );
      $formtitle.value = '';
      $formtitle.className += ' border-error';
    }
    else if ( formData.status == 'could not attach geo data' ) {
      const $formtitle = V.getNode( '#plusform__loc' );
      $formtitle.setAttribute( 'placeholder', V.i18n( 'Could not attach geo data', 'placeholder', 'form error' ) );
      $formtitle.value = '';
      $formtitle.className += ' border-error';
    }
    else {
      V.setNode( 'body', formData.$form );
      V.setAnimation( 'form', 'fadeIn', { delay: 0.2, duration: 1 } );
      Google.launch().then( () => { // adds places lib script
        Google.initAutocomplete( 'plusform' ); // + __loc, __lng and __lat
      } );
      // Page.draw( { pos: 'closed', reset: false } );
      // Button.draw( ( formData.layout == 'search' ? 'plus' : 'plus search' ), { fade: 'out' } );
      Button.draw( 'all', { fade: 'out' } );
      Button.draw( formData.layout == 'search' ? 'close query' : 'close send', { delay: 1 } );
    }
  }

  /* ============ public methods and exports ============ */

  function draw( which, options ) {
    view( presenter( which, options ) );
  }

  return {
    draw: draw
  };

} )();
