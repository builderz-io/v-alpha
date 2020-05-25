const Google = ( function() { // eslint-disable-line no-unused-vars

  /**
  * V Plugin to add Google services
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
    console.log( 2, component );
    const $elem = document.getElementById( component + '__loc' );
    console.log( $elem );
    if ( $elem ) {
      const autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */( $elem ),
        { types: ['geocode'] } );

      autocomplete.addListener( 'place_changed', function() {
        var place = autocomplete.getPlace();
        $elem.setAttribute( 'lat', place.geometry.location.lat().toFixed( 5 ) );
        $elem.setAttribute( 'lng', place.geometry.location.lng().toFixed( 5 ) );
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
