const Profile = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity display page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    if ( typeof which == 'string' ) {
      which = V.castPathOrId( which );
    }
    else {
      Object.assign( which, { isDisplay: true } );
    }

    const cache = V.getCache( 'viewed' );
    const now = Date.now();

    if (
      cache
      && ( now - cache.timestamp ) > ( V.getSetting( 'viewedCacheDuration' ) * 60 * 1000 )
    ) {
      V.setCache( 'viewed', 'clear' );
    }

    let query;

    const inCache = V.getViewed( which.uuidE || which );

    if ( inCache ) {
      query = V.successTrue( 'used cache', inCache );
    }
    else {
      query = await V.getEntity(
        which,
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
        lastViewedRoleCode: entity.roleCode,
        lastLngLat: entity.geometry.coordinates,
        lastViewedEntity: entity,
      } );

      const data = {
        typeOfWhich: typeof which,
        entity: entity,
      };

      return V.successTrue( 'retrieved entities', data );
    }
    else {
      return V.successFalse( 'retrieve entities' );
    }
  }

  function view( data ) {

    if ( !data.success ) {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
      return;
    }

    const entity = data.data[0].entity;

    /* set up the profile data for use in components */
    UserComponents.setData( {
      entity: entity,
      editable: false,
    } );

    const $list = CanvasComponents.list( 'narrow' );

    V.setNode( $list, [
      UserComponents.mediumImageCard(),
      // UserComponents.roleCard(),
      UserComponents.entityCard(),
      UserComponents.locationCard(),
      Pool.drawWidget(),
      Farm.drawPlotWidget(),
      UserComponents.descriptionCard(),
      UserComponents.questionnaireCard(),
      UserComponents.socialCard(),
      UserComponents.preferredLangsCard(),
      UserComponents.financialCard(),
      UserComponents.evmAddressCard(),
      UserComponents.evmReceiverAddressCard(),
      UserComponents.managementCard(),
      UserComponents.holderOfCard(),
      UserComponents.socialShareButtons(),
    ] );

    VMap.draw( [entity] );

    setTimeout( function delayedEntityViewMap() {
      $( '.join-loc-picker__input-profile-view' ).leafletLocationPicker( {
        alwaysOpen: true,
        mapContainer: '.join-loc-picker__map',
        height: 140,
        map: {
          zoom: 13,
          center: L.latLng( entity.geometry.coordinates.reverse() ),
          zoomControl: false,
          attributionControl: false,
        },
        onChangeLocation: function pickedLocation( data ) {

          setResponse( '', 'setAsIs' );

          entityData.location = 'picked location';
          entityData.lat = data.latlng.lat;
          entityData.lng = data.latlng.lng;
        },
      } );
    }, 400 );

    if ( data.data[0].typeOfWhich == 'string' ) {
      // in this case the profile is fetched using a path and the navigation has not been set in preview
      Navigation.draw( entity ).then( () => {
        Page.draw( {
          position: 'top',
          listings: $list,
        } );
        MagicButton.draw( 'chat' );
        // delayedMessageForm( entity );
      } );
    }
    else {
      Page.draw( {
        position: 'top',
        listings: $list,
      } );
      MagicButton.draw( 'chat' );
      // delayedMessageForm( entity );
    }

    if ( entity.images.tinyImage ) {
      Navigation.drawImage( entity );
    }

  }

  // function delayedMessageForm( entity ) {
  //   if ( !V.aE() ) { return }
  //
  //   /** This is a hacky way to wait for V.aE( 'uuidE' ) to be available */
  //   setTimeout( function delayMsgForm() {
  //     entity.uuidE != V.aE( 'uuidE' )
  //       ? Chat.drawMessageForm()
  //       : null;
  //   }, 1800, entity );
  // }

  function preview( data ) {

    /**
     * removes "Get Started"/"Watch intro" button, to exclude it
     * from "last position" update.
     *
     */

    const $list = CanvasComponents.list( 'narrow' );

    V.setNode( $list, UserComponents.entityPlaceholderImage() );

    for ( let i = 0; i < 1; i++ ) {
      const $ph = UserComponents.entityPlaceholderCard();
      const $card = CanvasComponents.card( $ph );

      V.setNode( $list, $card );
    }

    V.setNode( '#get-started', 'clear' );

    // Button.draw( 'all', { fade: 'out' } );

    if (
      !( data.navReset === false )
      && data.uuidE
    ) {
      Navigation.draw( data ).then( () => {
        Page.draw( {
          position: 'top',
          listings: $list,
        } );
      } );
    }
    else {
      Page.draw( {
        position: 'top',
        listings: $list,
      } );
    }

  }

  /* ============ public methods and exports ============ */

  function draw( data ) {
    preview( data );
    presenter( data ).then( data => { view( data ) } );
  }

  return {
    draw: draw,
  };

} )();
