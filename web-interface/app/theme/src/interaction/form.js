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

    let values;

    if ( which == 'new entity' ) {

      values = {
        title: undefined,
        role: undefined,
        location: undefined,
        lat: undefined,
        lng: undefined,
        description: undefined,
        unit: undefined,
        target: undefined,
      };

      const lastForm = V.castJson( V.getLocal( 'last-form' ) );

      if ( lastForm ) {
        values.title = lastForm.title;
        values.location = lastForm.location;
        values.lat = lastForm.lat;
        values.lng = lastForm.lng;
        values.description = lastForm.description;
        values.unit = lastForm.unit;
        values.target = lastForm.target;
      }

    }

    return {
      success: true,
      layout: which,
      data: [values],
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
    else if ( !formData.success ) {
      V.getNode( '.form__response' ).textContent = formData.message;
    }
    else {
      const $form = InteractionComponents.form();

      if ( formData.layout == 'new entity' ) {
        const values = formData.data[0];
        V.getNode( '#set' ).addEventListener( 'click', V.handleSetEntity, { once: true } );
        V.setNode( $form, [
          InteractionComponents.formField( 'title', values.title ),
          InteractionComponents.formField( 'location', values.location, values.lat, values.lng ),
          InteractionComponents.formField( 'description', values.description ),
          V.cN( {
            c: 'flex',
            h: [
              InteractionComponents.formUploadImage(),
              InteractionComponents.formField( 'target', values.target ),
              InteractionComponents.formField( 'unit', values.unit ),
            ],
          } ),
        ] );
      }
      else if ( formData.layout == 'search' ) {
        V.setNode( $form, [
          InteractionComponents.formField( 'search' ),
          InteractionComponents.formSearchFilter(),
        ] );
      }
      else {
        V.setNode( $form, [ InteractionComponents.title(), InteractionComponents.desc() ] );
      }

      V.setNode( 'body', $form );

      setTimeout( () => {
        V.getVisibility( '#search-input' ) ? V.getNode( '#search-input' ).focus() : null;
        V.getVisibility( '#plusform__title' ) ? V.getNode( '#plusform__title' ).focus() : null;
      }, 600 );

      V.setAnimation( 'form', 'fadeIn', { delay: 0.2, duration: 1 } );
      Google.launch().then( () => { // adds places lib script
        Google.initAutocomplete( 'plusform' ); // + __loc, __lng and __lat
      } );
      Button.draw( 'all', { fade: 'out' } );
      Button.draw( formData.layout == 'search' ? /* 'close */ 'query' : /* 'close */ 'set', { delay: 1 } );
    }
  }

  /* ============ public methods and exports ============ */

  function draw( which, options ) {
    view( presenter( which, options ) );
  }

  return {
    draw: draw,
  };

} )();
