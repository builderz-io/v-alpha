const VMap = ( function() { // eslint-disable-line no-unused-vars

  /**
  * V Plugin driving the Map
  *
  * List of tile providers: http://leaflet-extras.github.io/leaflet-providers/preview/
  *
  */

  'use strict';

  /* esri world physical (max zoom 8) */
  // const tiles = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}';
  // const attribution = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>';

  /* mapbox */
  // const tiles = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + V.getApiKey( 'mapBox' );
  // const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

  /* esri world image */
  // const tiles = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  // const attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

  /* cartodb voyager no lables (max zoom 19) */
  // const tiles = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';
  // const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  /* cartodb voyager with lables (max zoom 19) */
  const tiles = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  const mapDefaults = {
    atlantic: {
      lng: -27.070, // lesser numbers = move map west
      lat: 14, // lesser numbers = move map south
      zoom: 3,
    },
    berlin: {
      lng: 13.383,
      lat: 52.522,
      zoom: 9,
    },
    chicago: {
      lng: -87.964,
      lat: 41.858,
      zoom: 8,
    },
  };

  let viMap, featureLayer;

  /* ================== private methods ================= */

  function presenter( features ) {
    return Promise.resolve( features );
    // if ( /*V.getNode( '[src="/dist/leaflet.js"]' ) */ V.getNode( '.leaflet-pane' ) ) {
    // }
    // else {
    //   return launch()
    //     .then( () => {
    //       setMap();
    //       return features;
    //     } );
    // }

  }

  function view( features ) {

    if ( features && features.resetZoom ) {
      // const loc = getMapDefault( 'atlantic' );
      const loc = V.getState( 'map' );
      viMap.setView( [loc.lat, loc.lng], loc.zoom - 4 );
      return;
    }

    if ( !features || !features.length || features[0] == undefined ) {
      return;
    }

    const sc = V.getState( 'screen' );

    const geojsonMarkerSettings = {
      radius: 9,
      fillColor: 'rgba(' + sc.brandPrimary + ', 1)',
      weight: 0,
      opacity: 1,
      fillOpacity: 0.9,
    };

    const popUpSettings = {
      maxWidth: 150,
      closeButton: false,
      autoPanPaddingTopLeft: [100, 140],
      keepInView: true,
      className: 'map__popup',
    };

    if ( featureLayer ) {
      featureLayer.remove();
    }

    featureLayer = L.geoJSON( features, {
      pointToLayer: function( feature, latlng ) {
        return L.circleMarker( latlng, geojsonMarkerSettings );
      },
      onEachFeature: function( feature, layer ) {
        layer.bindPopup( L.popup( popUpSettings ).setContent( castPopup( feature ) ) );
      },
    } );

    const geo = features[0].geometry.coordinates;

    if ( features.length == 1 ) {
      const rand = features[0].geometry.rand;
      const offset = sc.width < 800 ? 0 : rand ? 45 : 0.35;
      const zoom = rand ? 3 : 10;

      viMap.setView( [geo[1], geo[0] - offset], zoom );
      setTimeout( () => {featureLayer.addTo( viMap )}, 1000 );
    }
    else {
      if( !viMap.getZoom() == 3 ) {
        viMap.setView( [geo[1] - 9, geo[0]], 3 );
      // viMap.setView( [41.858, -87.964], 8 );
      }

      featureLayer.addTo( viMap );
    }
  }

  function castPopup( feature ) {
    return MarketplaceComponents.popupContent( feature );
  }

  // async function launch() {
  //   await V.setScript( V.getSetting( 'sourceEndpoint' ) + '/plugins/dependencies/leaflet.js' );
  //   console.log( '*** leaflet library loaded ***' );
  // }

  function setMap() {

    const sc = V.getState( 'screen' );

    const mapSettings = {
      lat: getMapDefault().lat,
      lng: getMapDefault().lng,
      zoom: sc.height > 1200
        ? getMapDefault().zoom + 1
        : getMapDefault().zoom,
      maxZoom: 16,
      minZoom: sc.height > 1200 ? 3 : 2,
    };

    featureLayer = L.geoJSON();

    const mapData = V.getLocal( 'map-state' );

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
      V.setLocal( 'map-state', map );
    } );
  }

  function getMapDefault(
    which = V.getSetting( 'mapDefault' )
  ) {
    return mapDefaults[which];
  }

  /* ============ public methods and exports ============ */

  function draw( features ) {
    if ( V.getSetting( 'drawMap' ) ) {
      presenter( features ).then( features => { view( features ) } );
    }
  }

  return {
    // launch: launch,
    draw: draw,
    setMap: setMap,
  };

} )();
