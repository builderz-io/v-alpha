const VMap = ( function() { // eslint-disable-line no-unused-vars

  /**
  * V Plugin driving the Map
  *
  * List of tile providers: http://leaflet-extras.github.io/leaflet-providers/preview/
  * Locations: Map Center [ 41.576, 4.63 ], Berlin [ 52.522, 13.383 ]
  *
  */

  'use strict';

  const tiles = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}';
  const attribution = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>';

  // const tiles = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + V.getApiKey( 'mapBox' );
  // const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  let viMap, featureLayer;

  const geojsonMarkerSettings = {
    radius: 7,
    fillColor: '#1b1aff',
    // color: '#000',
    weight: 0,
    opacity: 1,
    fillOpacity: 0.8
  };

  const mapSettings = {
    // map center with arcgisonline.com tiles
    lat: 43.776, // lesser numbers = move map south
    lng: 4.63, // lesser numbers = moce map west
    zoom: 4,
    maxZoom: 16,
    minZoom: 2,
  };

  /* ================== private methods ================= */

  function presenter( features ) {
    if ( V.getSetting( 'loadMap' ) ) {
      if ( V.getNode( '.leaflet-pane' ) ) {
        return Promise.resolve( features );
      }
      else {
        return launch()
          .then( () => {
            setMap();
            return features;
          } );
      }
    }
  }

  async function launch() {
    await V.setScript( '/dist/leaflet.js' );
    console.log( '*** map scripts loaded ***' );

  }

  function setMap() {

    featureLayer = L.geoJSON();

    const mapData = V.getCookie( 'map-state' );

    if ( mapData ) {
      const map = JSON.parse( mapData );
      viMap = L.map( 'background' ).setView( [ map.lat, map.lng ], map.zoom );
      V.setState( 'map', { lat: map.lat, lng: map.lng, zoom: map.zoom } );
    }
    else {
      viMap = L.map( 'background' ).setView( [ mapSettings.lat, mapSettings.lng ], mapSettings.zoom );
      V.setState( 'map', { lat: mapSettings.lat, lng: mapSettings.lng, zoom: mapSettings.zoom } );
    }

    L.tileLayer( tiles, {
      attribution: attribution,
      maxZoom: mapSettings.maxZoom,
      minZoom: mapSettings.minZoom,
      // id: 'mapbox.streets',
      // accessToken: 'your.mapbox.access.token'
    } ).addTo( viMap );

    viMap.on( 'moveend', function() {
      const map = viMap.getBounds().getCenter();
      Object.assign( map, { zoom: viMap.getZoom() } );
      V.setState( 'map', map );
      V.setCookie( 'map-state', map );
    } );
  }

  function view( features ) {

    if ( featureLayer ) {
      featureLayer.remove();
    }

    featureLayer = L.geoJSON( features, {
      pointToLayer: function( feature, latlng ) {
        return L.circleMarker( latlng, geojsonMarkerSettings );
      }
    } );

    featureLayer.addTo( viMap );

  }

  /* ============ public methods and exports ============ */

  function draw( options ) {
    if ( V.getSetting( 'loadMap' ) ) {
      presenter( options ).then( viewData => { view( viewData ) } );
    }
  }

  return {
    draw: draw,
  };

} )();
