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
    tokyo: {
      lng: 139.8,
      lat: 35.652,
      zoom: 11,
    },
    nyc: {
      lng: -73.958,
      lat: 40.792,
      zoom: 13,
    },
    fremantle: {
      lng: 115.753,
      lat: -32.05,
      zoom: 13,
    },
    lowerafrica: {
      lng: 18,
      lat: -15,
      zoom: 4,
    },
    germany: {
      lng: 10.85,
      lat: 50.66,
      zoom: 6,
    },
  };

  const continentsLngLat = [
    [ 17.05291, 2.07035], // Africa
    [ 87.331111, 43.681111 ], // Asia
    [ -56.1004, -15.6006 ], // South America, https://www.atlasobscura.com/places/geographic-center-of-south-america
    [ 9.902056, 49.843 ], // Europe
    [ 134.354806, -25.610111], // Australia, Lambert Gravitational Centre, https://geohack.toolforge.org/geohack.php?pagename=Centre_points_of_Australia&params=25_36_36.4_S_134_21_17.3_E_
    [ -100, 48.166667 ], // North America, https://pubs.usgs.gov/unnumbered/70039437/report.pdf
    [ -5.077173, -74.254112 ], // Antarctica, manually set to be more visible
    [ -40, 35 ], // Fallback to Atlantic Ocean
  ];

  const popUpSettings = {
    maxWidth: 180,
    minWidth: 130,
    closeButton: false,
    autoPanPadding: [120, 200],
    keepInView: true,
    className: 'map__popup',
  };

  let viMap, highlightLayer, permittedLayer, deniedLayer, searchLayer, lastViewedLayer, tempPointLayer, hoverLayer;

  const coordinatesCache = [];

  /* ================== private methods ================= */

  function view( data, options ) {

    const isPopupOpen = V.getNode( '.map-popup-inner' );

    if ( Array.isArray( data ) ) {
      if ( options ) {
        if ( options.isSearch && data[0] ) {
          setSearch( data );
        }
        else if ( options.isHover ) {
          setHover( data );
        }
        else if ( options.isJoin ) {
          setLastViewed( data, options );
        }
      }
      else {
        if ( data[0] && data[0].isBaseLocationUpdate ) {
          setTempPoint( data );
        }
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
      if ( lastLngLat && !isPopupOpen ) {
        viMap.setView( [lastLngLat[1], lastLngLat[0]], viMap.getZoom() - 5 );
      }
      else {
        const loc = V.getState( 'map' );
        viMap.setView( [loc.lat, loc.lng], loc.zoom /* - 4 */  );
      }
    }
    else {
      if ( lastViewedLayer ) {
        lastViewedLayer.remove();
      }
    }

    if ( !isPopupOpen ) {
      setPoints( whichRole );
    }
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

  function launch() {
    if ( V.getSetting( 'drawMap' ) ) {
      setMap();
    }
  }

  function castLayer( whichLayer, features, options ) {
    const sc = V.getState( 'screen' );

    const marker = {
      radius: 5,
      fillColor: 'rgba(' + sc.brandPrimary + ', 1)',
      weight: 0,
      opacity: 0.8,
      fillOpacity: 0.8,
    };

    switch ( whichLayer ) {
    // case 'permitted':
    //   marker.fillColor = 'rgba(' + sc.brandPrimary + ', 1)';
    //   break;
    case 'denied':
      marker.fillColor = 'rgba(' + sc.brandPrimary + ', 0.55)';
      break;
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
    case 'tempPoint':
      marker.fillColor = 'purple';
      marker.radius = 9;
      marker.fillOpacity = 1;
      break;
    case 'lastViewed':
      marker.radius = 9;
      marker.fillColor = 'blue';
      marker.stroke = true;
      marker.weight = 3;
      marker.color = 'lightblue';
      break;
    case 'hover':
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
     * except when isBaseLocationUpdate
     */

    if (
      whichLayer != 'permitted'
      && features[0]
      && !features[0].isBaseLocationUpdate
    ) {
      features.forEach( feature => {
        const cache = V.getCache( 'permitted' );
        const point = cache ? cache.data.find( point => point.uuidE == feature.uuidE ) : undefined;
        if ( point ) {

          /* if no location was entered by user, fill in the continent set by user */
          if ( !point.geometry.coordinates ) {
            point.geometry.coordinates = V.castJson( continentsLngLat[ point.geometry.continent - 1 ], 'clone' );
          }
          Object.assign( feature.geometry, point.geometry );
        }
      } );
    }

    if ( ['search', 'highlights', 'tempPoint', 'lastViewed'].includes( whichLayer ) ) {
      exec.onEachFeature = function( feature, marker ) {
        marker.bindPopup( L.popup().setContent( castPopup( feature ) ), popUpSettings );
        if ( options && options.isJoin ) {
          marker.on( 'add', function( event ) {
            event.target.openPopup();
          } );
        }
      };
    }

    return L.geoJSON( features, exec );

  }

  function castReturnedPointData( item ) {
    return {
      uuidE: item.a,
      uuidP: item.d,
      role: item.c.replace( 'Mapped', '' ),
      privacy: item.f,
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

    const mapData = V.getLocal( 'map-center' );

    if ( mapData ) {
      const map = JSON.parse( mapData );
      viMap = L.map( 'background', {
        tapTolerance: 22,
        // renderer: L.canvas( { tolerance: 30 } ),
      } ).setView( [ map.lat, map.lng ], map.zoom );
      V.setState( 'map', { lat: map.lat, lng: map.lng, zoom: map.zoom } );
    }
    else {
      viMap = L.map( 'background', {
        tapTolerance: 22,
        // renderer: L.canvas( { tolerance: 30 } ),
      } ).setView( [ mapSettings.lat, mapSettings.lng ], mapSettings.zoom );
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

    viMap.on( 'moveend', setMapCenterInState );

    // viMap.on( 'moveend', handleMapMoveEnd );
    /*
     .on( 'moveend', handleMapMoveEnd ) creates bugs:
       - causes point rendering incomplete and too small
       - exceeded stack
    */

  }

  function getMapDefault(
    which = V.getSetting( 'mapDefault' ),
  ) {
    return mapDefaults[which];
  }

  function getPoints() {

    if ( V.getSetting( 'marketContent' ) == 1 ) { return Promise.resolve() }

    return V.getEntity( 'point' ).then( res => {
      if ( res.success ) {
        const castPoints = res.data.map( item => {

          /* if no location was entered by user, fill in the continent set by user */
          if ( !item.zz ) {
            item.zz = { i: V.castJson( continentsLngLat[ 7 ], 'clone' ) };
          }
          else if ( !item.zz.i ) {
            item.zz.i = V.castJson( continentsLngLat[ item.zz.m - 1 ], 'clone' );
          }

          /* slightly offset same coordinates */
          const geoStr = JSON.stringify( item.zz.i );
          if ( coordinatesCache.includes( geoStr ) ) {
            item.zz.i[0] += ( ( Math.random() - 0.5 ) / 10  ).toFixed( 4 ) * 1;
            item.zz.i[1] += ( ( Math.random() - 0.5 ) / 10  ).toFixed( 4 ) * 1;
            coordinatesCache.push( JSON.stringify( item.zz.i ) );
          }
          else {
            coordinatesCache.push( geoStr );
          }

          /* cast points data */
          return castReturnedPointData( item );
        } );

        /* set a cache with all points */
        V.setCache( 'points', castPoints );

        /* set a cache with permitted points */
        const permitted = castPoints.filter( item => [ 0, null ].includes( item.privacy ) );
        V.setCache( 'permitted', permitted );

        /* set a cache with denied points */
        const denied = castPoints.filter( item => item.privacy == 2 );
        V.setCache( 'denied', denied );
      }
    } );
  }

  function setPoints( whichRole ) {

    if ( permittedLayer ) {
      permittedLayer.remove();
    }

    if ( deniedLayer ) {
      deniedLayer.remove();
    }

    const cache = V.getCache( 'points' );

    if ( !cache ) { return }

    let filtered = cache.data;

    if ( 'Person' == whichRole ) {
      filtered = filtered.filter( item => ['aa', 'ab'].includes( item.role ) );
    }
    else if ( 'all' != whichRole ) {
      filtered = filtered.filter( item => item.role == V.castRole( whichRole ) );
    }

    /* draw publicly accessible points (permitted points) */

    const permitted = filtered.filter( item => [ 0, null ].includes( item.privacy ) );

    permittedLayer = castLayer( 'permitted', permitted );

    permittedLayer.on( 'click', handlePointClick );

    permittedLayer.addTo( viMap );

    /* draw non-accessible, but visible points (denied points) */

    const denied = filtered.filter( item => item.privacy == 2 );

    deniedLayer = castLayer( 'denied', denied );

    deniedLayer.addTo( viMap );
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

    // highlightLayer.on( 'click', handleHighlightClick );

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

    // searchLayer.on( 'click', handleHighlightClick );

    // if( !viMap.getZoom() == 3 ) {
    //   viMap.setView( [geo[1] - 9, geo[0]], 3 );
    // // viMap.setView( [41.858, -87.964], 8 );
    // }

    searchLayer.addTo( viMap );

    const lat = features[0].geometry.coordinates[1];
    const lng = features[0].geometry.coordinates[0];

    viMap.setView( [lat, lng], 3 );
    V.setState( 'map', {
      lat: lat,
      lng: lng,
      zoom: 3,
    } );
  }

  function setHover( features ) {

    if ( lastViewedLayer ) {
      lastViewedLayer.remove();
    }

    if ( hoverLayer ) {
      hoverLayer.remove();
    }

    hoverLayer = castLayer( 'hover', features );

    hoverLayer.addTo( viMap );

  }

  function setLastViewed( features, options ) {
    if ( lastViewedLayer ) {
      lastViewedLayer.remove();
    }

    /* if no location was entered by user, fill in the continent set by user */
    if ( !features[0].geometry.coordinates ) {
      features[0].geometry.coordinates = V.castJson( continentsLngLat[ features[0].geometry.continent - 1 ], 'clone' );
    }

    lastViewedLayer = castLayer( 'lastViewed', features, options );

    const sc = V.getState( 'screen' );

    const geo = V.getState( 'active' ).lastLngLat
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

  function setTempPoint( feature ) {
    if ( tempPointLayer ) {
      tempPointLayer.remove();
    }
    tempPointLayer = castLayer( 'tempPoint', feature );
    setTimeout( () => {
      tempPointLayer
        .addTo( viMap );
    }, 500 );
  }

  // function handleHighlightClick( e ) {
  //
  //   /**
  //    * make the coordinates of the clicked point available in state,
  //    * which ensures that the correct latLng is used in "setLastViewed",
  //    * otherwise a random geolocation will be rendered again, leading to a map crash
  //    */
  //   V.setState( 'active', {
  //     lastLngLat: [ e.layer.getLatLng().lng, e.layer.getLatLng().lat ],
  //   } );
  // }

  async function handlePointClick( e ) {

    /**
     * see comment in handleHighlightClick
     */

    // V.setState( 'active', {
    //   lastLngLat: [ e.layer.getLatLng().lng, e.layer.getLatLng().lat ],
    // } );

    if ( e.layer.feature.privacy > 0 ) {
      return;
    }

    const uuidE = e.layer.feature.uuidE;
    const uuidP = e.layer.feature.uuidP;
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

    const inCache = V.getFromCache( 'viewed', uuidE );

    if ( inCache ) {
      entity = V.successTrue( 'used cache', inCache );
    }
    else {

      entity = await V.getEntity( { uuidE: uuidE, uuidP: uuidP, isMapPopUp: true } )
        .then( res => {
          if ( res.success ) {
            // V.setCache( 'viewed', res.data );
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

  // function handleMapMoveEnd() {
  //   console.log( 'map moved' );
  //   viMap.off( 'moveend' );
  //   setMapPositionInState();
  //   viMap.on( 'moveend', handleMapMoveEnd );
  // }

  // function setMapPositionInState() {
  //   const map = viMap.getCenter();
  //   Object.assign( map, { zoom: viMap.getZoom() } );
  //   V.setState( 'map', map );
  //   V.setLocal( 'map-state', map );
  // }

  function setMapCenterInState() {
    const mapCenter = viMap.getCenter();
    Object.assign( mapCenter, { zoom: viMap.getZoom() } );
    V.setState( 'mapCenter', mapCenter );
    V.setLocal( 'map-center', mapCenter );
  }

  /* ============ public methods and exports ============ */

  function draw( data, options ) {
    if ( V.getSetting( 'drawMap' ) ) {
      view( data, options );
    }
  }

  function getState() {
    return {
      center: viMap.getCenter(),
      zoom: viMap.getZoom(),
      bounds: viMap.getBounds(),
    };
  }

  return {
    launch: launch,
    draw: draw,
    getState: getState,
  };

} )();
