const Google = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module to add Google services to the app
  *
  *
  */

  'use strict';

  const DOM = {};

  const key = V.getApiKey( 'googlePlaces' );

  /* ================== private methods ================= */

  function addPlacesLibraryScript() {
    V.sN( 'head', {
      t: 'script',
      a: { src: 'https://maps.googleapis.com/maps/api/js?key=' + key + '&libraries=places&language=en&region=US' }
    } );
  }

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
    if ( V.getApiKey( 'googlePlaces' ).length > 10 ) {
      addPlacesLibraryScript();
    }
    else {
      console.warn( 'Missing Google Places API key' );
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
