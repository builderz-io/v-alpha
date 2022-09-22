const User = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity edit page
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      transfers: 'Transfers',
      settings: 'Settings',
      disconnect: 'Disconnect',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  async function presenter( which ) {

    if ( typeof which == 'string' ) {
      which = V.castPathOrId( which );
    }
    else {
      Object.assign( which, { isDisplay: true } );
    }

    let query;
    const inCache = V.getCache().viewed ? V.getCache().viewed.data.find( entity => entity.path == which ) : undefined;

    if ( !V.aE() ) {
      return {
        success: false,
        status: '',
      };
    }
    if ( inCache ) {
      query = {
        success: true,
        data: [inCache],
      };
    }
    else {
      query = await V.getEntity(
        which,
        // which.length == V.getSetting( 'uuidStringLength' ) && // checks whether which is a uuidE or a path
        // isNaN( Number( which.slice( -5 ) ) )
        //   ? which
        //   : V.castPathOrId( which )
      ).then( res => {
        if ( res.success ) {
          V.setCache( 'points', res.data );
          V.setCache( 'viewed', res.data );
          return res;
        }
        else {
          return false;
        }
      } );
    }
    if ( query.success ) {

      const entity = query.data[0];

      V.setState( 'active', {
        lastViewed: entity.fullId,
        lastViewedUuidE: entity.uuidE,
        lastViewedUuidP: entity.uuidP,
      } );

      return {
        success: true,
        status: 'editable entity retrieved',
        data: [entity],
      };
    }
  }

  function view( viewData ) {

    let $topcontent, $list;

    if ( viewData.success ) {
      UserComponents.setData( {
        entity: viewData.data[0],
        editable: true,
      } );

      $list = CanvasComponents.list();
      $topcontent = UserComponents.topcontent();

      V.setNode( $list, [
        // InteractionComponents.onboardingCard(),
        // UserComponents.roleCard(),
        UserComponents.addOrChangeImage(),
        UserComponents.locationCard(),
        Farm.drawPlotWidget(),
        UserComponents.questionnaireCard(),
        UserComponents.descriptionCard(),
        UserComponents.socialCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.financialCard(),
        UserComponents.entityCard(),
        UserComponents.evmAddressCard(),
        UserComponents.evmReceiverAddressCard(),
        UserComponents.accessKeysCard(),
        UserComponents.managementCard(),
        // UserComponents.adminOfCard(),
        UserComponents.socialShareButtons(),
      ] );

      // if( viewData.data.drawNav ) {
      //   Navigation.draw( viewData.data[0].entity );
      // }

      Page.draw( {
        // topcontent: $topcontent,
        listings: $list,
      } ).then( () => {

        $( '.location__base' ).leafletLocationPicker( {
          alwaysOpen: true,
          mapContainer: '.join-loc-picker__map',
          height: 140,
          map: {
            zoom: 13,
            center: L.latLng(
              V.getState( 'userLocChange' )
                ? [ V.getState( 'userLocChange' ).lat, V.getState( 'userLocChange' ).lng ]
                : V.castClone( viewData.data[0].geometry.coordinates ).reverse(),
            ),
            zoomControl: false,
            attributionControl: false,
          },
          onChangeLocation: function newPickedLocation( data ) {
            V.setState( 'userLocChange', {
              lat: data.latlng.lat,
              lng: data.latlng.lng,
              loc: 'picked location',
            } );
            V.setEntity( V.getState( 'active' ).lastViewed, {
              field: 'geometry.baseLocation',
              data: {
                lat: data.latlng.lat,
                lng: data.latlng.lng,
                loc: 'picked location',
              },
            } );
          },
        } );

        const loc = viewData.data[0].geometry
          ? viewData.data[0].geometry.baseLocation == 'picked location'
            ? 'Lat ' + viewData.data[0].geometry.coordinates[1] + ' Lng ' + viewData.data[0].geometry.coordinates[0]
            : viewData.data[0].geometry.baseLocation
          : undefined;

        Google.launch().then( () => { // adds places lib script
          Google.initAutocomplete( 'user', loc );
        } );
      } );

      // setTimeout( function delayedEntityViewMap() {
      //   $( '.join-loc-picker__input-profile-view' ).leafletLocationPicker( {
      //     alwaysOpen: true,
      //     mapContainer: '.join-loc-picker__map',
      //     height: 140,
      //     map: {
      //       zoom: 13,
      //       center: L.latLng( V.castClone( viewData.data[0].geometry.coordinates ).reverse() ),
      //       zoomControl: false,
      //       attributionControl: false,
      //     },
      //     // onChangeLocation: function pickedLocation( data ) {
      //     //
      //     //   setResponse( '', 'setAsIs' );
      //     //
      //     //   entityData.location = 'picked location';
      //     //   entityData.lat = data.latlng.lat;
      //     //   entityData.lng = data.latlng.lng;
      //     // },
      //   } );
      // }, 400 );

      VMap.draw( [viewData.data[0]] );
    }
    else {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
    }
  }

  function preview( /* path */ ) {
    MagicButton.draw( 'chat' );

    // Button.draw( 'all', { fade: 'out' } );

    // if ( path == '/me/profile' ) {
    //   Navigation.draw( path );
    // }

    Page.draw( {
      position: 'top',
    } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNavItem( 'userNav', [
      // {
      //   title: 'Edit',
      //   path: '/me/edit',
      //   use: {
      //     button: 'plus search',
      //   },
      //   draw: function( path ) {
      //     EntityList.draw( path );
      //   },
      // },
      {
        title: ui.transfers,
        path: '/me/transfers',
        use: {
          button: 'search',
        },
        draw: function( path ) {
          Account.draw( path );
        },
      },
      // {
      //   title: 'Profile',
      //   path: '/me/profile',
      //   use: {
      //     button: 'plus search',
      //   },
      //   draw: function( path ) {
      //     User.draw( { path: path } );
      //   }
      // },
      {
        title: ui.settings,
        path: '/me/settings',
        use: {
          button: 'plus search',
        },
        draw: function( path ) {
          Settings.draw( path );
        },
      },
      {
        title: ui.disconnect,
        path: '/me/disconnect',
        draw: function( path ) {
          User.draw( { path: path } );
        },
      },
    ] );
  }

  function draw( data ) {
    if ( data.path == '/me/disconnect' ) {
      Modal.draw( 'disconnect' );
    }
    else {
      preview( /* path */ );
      presenter( data ).then( viewData => { view( viewData ) } );
    }
  }

  return {
    draw: draw,
    launch: launch,
  };

} )();
