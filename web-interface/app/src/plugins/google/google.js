const Google = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module to add Google services to the app
  *
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

  function initAutocomplete( component ) {
    if ( document.getElementById( component + '__lat' ) ) {
      const autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */( document.getElementById( component + '__loc' ) ),
        { types: ['geocode'] } );

      autocomplete.addListener( 'place_changed', function() {
        var place = autocomplete.getPlace();
        document.getElementById( component + '__lat' ).value = place.geometry.location.lat().toFixed( 5 );
        document.getElementById( component + '__lng' ).value = place.geometry.location.lng().toFixed( 5 );
      } );
    }
  }

  function launch() {
    if ( !document.getElementById( 'google-places-script' ) ) {

      const key = V.getApiKey( 'googlePlaces' );

      if ( key.length > 10 ) {
        return V.setScript( 'https://maps.googleapis.com/maps/api/js?key=' + key + '&libraries=places&language=en&region=US', 'google-places-script' );
      }
      else {
        console.warn( 'Missing Google Places API key' );
      }
    }
    else {
      return Promise.resolve();
    }
  }

  function draw( options ) {
    V.setPipe(
      presenter,
      view
    )( options );
  }

  return {
    initAutocomplete: initAutocomplete,
    launch: launch,
    draw: draw,
  };

} )();
