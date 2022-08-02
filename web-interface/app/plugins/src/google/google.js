const Google = ( function() { // eslint-disable-line no-unused-vars

  /**
  * V Plugin to add Google services
  *
  *
  */

  'use strict';

  /* ============ public methods and exports ============ */

  function initAutocomplete( component, location ) {

    /** $elem must be of type {!HTMLInputElement} */
    const $elem = document.getElementById( component + '__loc' );
    if ( $elem ) {
      const autocomplete = new google.maps.places.Autocomplete( $elem, { types: ['geocode'] } );
      $elem.setAttribute( 'placeholder', location || V.getString( 'Pick or type a new location' ) );
      autocomplete.addListener( 'place_changed', function() {
        const place = autocomplete.getPlace();
        $elem.setAttribute( 'loc', place.formatted_address );
        $elem.setAttribute( 'lat', place.geometry.location.lat().toFixed( 5 ) );
        $elem.setAttribute( 'lng', place.geometry.location.lng().toFixed( 5 ) );
        // focus and blur to trigger saving in user profile
        $elem.focus();
        $elem.blur();

        V.setNode( '.join-loc-picker__map', '' );

        V.setState( 'userLocChange', {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          loc: place.formatted_address,
        } );

        $( '.location__base' ).leafletLocationPicker( {
          alwaysOpen: true,
          mapContainer: '.join-loc-picker__map',
          height: 140,
          map: {
            zoom: 13,
            center: L.latLng( [
              place.geometry.location.lat(),
              place.geometry.location.lng(),
            ] ),
            zoomControl: false,
            attributionControl: false,
          },
        } );

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

  return {
    initAutocomplete: initAutocomplete,
    launch: launch,
  };

} )();
