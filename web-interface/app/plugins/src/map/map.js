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
      zoom: 13,
    },
    chicago: {
      lng: -87.964,
      lat: 41.858,
      zoom: 13,
    },
    nyc: {
      lng: -73.958,
      lat: 40.792,
      zoom: 13,
    },
  };

  const popUpSettings = {
    maxWidth: 160,
    minWidth: 130,
    closeButton: false,
    autoPanPaddingTopLeft: [100, 140],
    keepInView: true,
    className: 'map__popup',
  };

  let viMap, highlightLayer, pointLayer, searchLayer, lastViewedLayer;

  /* ================== private methods ================= */

  function view( data, options ) {

    if ( Array.isArray( data ) ) {
      if ( options && options.isSearch ) {
        setSearch( data );
      }
      else {
        setLastViewed( data );
      }
      return;
    }

    if ( searchLayer ) {
      searchLayer.remove();
    }

    /**
     * at this point data is a string, such as "Business",
     * defining a role by which to filter entities
     */

    const whichRole = data ? data : 'all';

    if ( 'all' == whichRole ) {
      const lastLngLat = V.getState( 'active' ).lastLngLat;
      if ( lastLngLat ) {
        viMap.setView( [lastLngLat[1], lastLngLat[0]], viMap.getZoom() - 5 );
      }
      else {
        const loc = V.getState( 'map' );
        viMap.setView( [loc.lat, loc.lng], loc.zoom - 4 );
      }
    }
    else {
      if ( lastViewedLayer ) {
        lastViewedLayer.remove();
      }
    }

    setPoints( whichRole );
    setHighlights( whichRole );

    // if ( !features || !features.length || features[0] == undefined ) {
    //   return;
    // }
    //
    // if ( features.length == 1 ) {
    //   setLastViewed();
    // }

  }

  function castPopup( feature ) {
    return MarketplaceComponents.popupContent( feature );
  }

  // async function launch() {
  //   await V.setScript( V.getSetting( 'sourceEndpoint' ) + '/plugins/dependencies/leaflet.js' );
  //   console.log( '*** leaflet library loaded ***' );
  // }

  function castLayer( whichLayer, features ) {
    const sc = V.getState( 'screen' );

    const marker = {
      radius: 5,
      fillColor: 'rgba(' + sc.brandPrimary + ', 1)',
      weight: 0,
      opacity: 0.8,
      fillOpacity: 0.8,
    };

    switch ( whichLayer ) {
    // case 'points':
    //   marker.fillColor = 'rgba(' + sc.brandPrimary + ', 1)';
    //   break;
    case 'highlights':
      marker.fillColor = 'rgba(' + sc.brandSecondary + ', 1)';
      marker.radius = 6;
      marker.fillOpacity = 1;
      break;
    case 'search':
      marker.fillColor = 'red';
      marker.radius = 6;
      marker.fillOpacity = 1;
      break;
    case 'lastViewed':
      marker.radius = 9;
      marker.fillColor = 'blue';
      marker.stroke = true;
      marker.weight = 3;
      marker.color = 'lightblue';
      break;
    }

    const exec = {
      pointToLayer: function( feature, latlng ) {
        return L.circleMarker( latlng, marker );
      },
    };

    /**
     * ensure features written to layers
     * have same geolocation as their point
     * (relevant for randomly generated locations)
     */

    if ( whichLayer != 'points' ) {
      features.forEach( feature => {
        const point = V.getCache( 'points' ).data.find( point => point.uuidE == feature.uuidE );
        if ( point ) {
          feature.geometry = point.geometry;
        }
      } );
    }

    if ( ['search', 'highlights'].includes( whichLayer ) ) {
      exec.onEachFeature = function( feature, layer ) {
        layer.bindPopup( L.popup().setContent( castPopup( feature ) ), popUpSettings );
      };
    }

    return L.geoJSON( features, exec );

  }

  function castReturnedPointData( item ) {
    return {
      uuidE: item.a,
      role: item.c.replace( 'Mapped', '' ),
      geometry: {
        coordinates: item.zz && item.zz.i ? item.zz.i : V.castRandLatLng().lngLat,
        rand: item.zz && item.zz.i ? false : true,
        type: 'Point',
      },
      type: 'Feature',
    };
  }

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

    getPoints()
      .then( () => setPoints( 'all' ) );

    // viMap.on( 'moveend', handleMapMoveEnd );

  /*
   .on( 'moveend' ) has bugs:
     - causes point rendering incomplete and too small
     - exceeded stack
  */

  }

  function getMapDefault(
    which = V.getSetting( 'mapDefault' )
  ) {
    return mapDefaults[which];
  }

  function getPoints() {
    return V.getEntity( 'point' ).then( res => {
      if ( res.success ) {
        const castPoints = res.data.map( item => castReturnedPointData( item ) );
        V.setCache( 'points', castPoints );
      }
    } );
  }

  function setPoints( whichRole ) {

    if ( pointLayer ) {
      pointLayer.remove();
    }

    const cache = V.getCache( 'points' );

    if ( !cache ) { return }

    let filtered = cache.data;

    if ( whichRole != 'all' ) {
      filtered = filtered.filter( item => item.role == whichRole );
    }
    // console.log( 'filtered points', filtered );
    pointLayer = castLayer( 'points', filtered );

    pointLayer.on( 'click', handlePointClick );

    pointLayer.addTo( viMap );
  }

  function setHighlights( whichRole ) {
    if ( highlightLayer ) {
      highlightLayer.remove();
    }

    const cache = V.getCache( 'highlights' );

    if ( !cache ) { return }

    let filtered = cache.data;

    if ( whichRole != 'all' ) {
      filtered = filtered.filter( item => item.role == whichRole );
    }
    // console.log( 'filtered highlights', filtered );

    highlightLayer = castLayer( 'highlights', filtered );

    highlightLayer.on( 'click', handleHighlightClick );

    // if( !viMap.getZoom() == 3 ) {
    //   viMap.setView( [geo[1] - 9, geo[0]], 3 );
    // // viMap.setView( [41.858, -87.964], 8 );
    // }

    highlightLayer.addTo( viMap );
  }

  function setSearch( features ) {
    if ( searchLayer ) {
      searchLayer.remove();
    }

    searchLayer = castLayer( 'search', features );

    searchLayer.on( 'click', handleHighlightClick );

    // if( !viMap.getZoom() == 3 ) {
    //   viMap.setView( [geo[1] - 9, geo[0]], 3 );
    // // viMap.setView( [41.858, -87.964], 8 );
    // }

    searchLayer.addTo( viMap );

  }

  function setLastViewed( features ) {
    if ( lastViewedLayer ) {
      lastViewedLayer.remove();
    }

    lastViewedLayer = castLayer( 'lastViewed', features );

    const sc = V.getState( 'screen' );

    const geo = V.getState( 'active' ).lastLngLat // is available when user came here though a popup in the map (only!)
    || features[0].geometry.coordinates;

    const rand = features[0].geometry.rand;
    const offset = sc.width < 800 ? 0 : rand ? 45 : 0.35;
    const zoom = rand ? 3 : 10;

    viMap.setView( [geo[1], geo[0] - offset], zoom );

    setTimeout( () => {
      lastViewedLayer
        .addTo( viMap );
    }, 500 );
  }

  function handleHighlightClick( e ) {

    /**
     * make the coordinates of the clicked point available in state,
     * which ensures that the correct latLng is used in "setLastViewed",
     * otherwise a random geolocation will be rendered again, leading to a map crash
     */
    V.setState( 'active', {
      lastLngLat: [ e.layer.getLatLng().lng, e.layer.getLatLng().lat ],
    } );
  }

  async function handlePointClick( e ) {

    /**
     * see comment in handleHighlightClick
     */

    V.setState( 'active', {
      lastLngLat: [ e.layer.getLatLng().lng, e.layer.getLatLng().lat ],
    } );

    const uuidE = e.layer.feature.uuidE;
    const popup = L.popup().setContent( castPopup( { uuidE: uuidE } ) );

    e.layer
      .bringToFront()
      .setStyle( {
        fillColor: 'blue',
        radius: 7,
      } )
      .bindPopup( popup, popUpSettings )
      .openPopup();

    let entity;

    const inCache = V.getViewed( uuidE );

    if ( inCache ) {
      entity = V.successTrue( 'used cache', inCache );
    }
    else {

      entity = await V.getEntity( uuidE )
        .then( res => {
          if ( res.success ) {
            V.setCache( 'viewed', res.data );
            return V.successTrue( 'fetched entity', res.data );
          }
        } );
    }

    /* fill popup with content,
     * needs timeout for popup to be ready
     */
    setTimeout( function setPopupContent() {
      V.setNode( '#' + uuidE + '-map-popup', '' );
      V.setNode( '#' + uuidE + '-map-popup', castPopup( entity.data[0] ) );
    }, 200 );

  }

  function handleMapMoveEnd() {
    console.log( 'map moved' );
    viMap.off( 'moveend' );
    setMapPositionInState();
    viMap.on( 'moveend', handleMapMoveEnd );
  }

  function setMapPositionInState() {
    const map = viMap.getCenter();
    Object.assign( map, { zoom: viMap.getZoom() } );
    V.setState( 'map', map );
    V.setLocal( 'map-state', map );
  }

  /* ============ public methods and exports ============ */

  function draw( data, options ) {
    if ( V.getSetting( 'drawMap' ) ) {
      view( data, options );
    }
  }

  return {
    // launch: launch,
    draw: draw,
    setMap: setMap,
  };

} )();
