const Profile = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity display page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    if (
      isNaN( Number( which.slice( -4 ) ) ) ||
      which.slice( -5, -4 ) != '-'
    ) {
      return {
        success: null,
        status: 'not a valid profile link'
      };
    }

    const fullId = V.castPathOrId( which );

    const inCache = V.getCache().all ? V.getCache().all.data.find( entity => {
      return entity.path == which;
    } ) : undefined;

    let query;

    if ( inCache ) {
      query = {
        success: true,
        data: [inCache]
      };
    }
    else {
      query = await V.getEntity( fullId );
    }

    const mapData = [];

    if ( query.success ) {

      const entity = query.data[0];

      V.setState( 'active', { lastViewed: entity.fullId } );

      /*
       * Pool data
       *
       */

      let txHistory, sendVolume = 0, receiveVolume = 0;

      if ( entity.profile.role == 'pool' ) {
        if ( V.aA() || !V.aE() ) {
          if ( entity.evmCredentials ) {
            txHistory = await V.getAddressHistory( entity.evmCredentials.address );
            if ( txHistory.success && txHistory.data.length ) {
              txHistory.data.forEach( tx => {
                tx.txType == 'out'? sendVolume += Number( tx.amount ) : null;
                tx.txType == 'in'? receiveVolume += Number( tx.amount ) : null;
              } );
            }
          }
          else {
          // TODO: other ledgers ...
          }
        }
        else {
          if ( !entity.stats ) {
            Object.assign( entity, { stats: {
              sendVolume: 0,
              receiveVolume: 0,
            } } );
          }
          sendVolume = entity.stats.sendVolume;
          receiveVolume = entity.stats.receiveVolume;
        }
      }

      /*
       * Map data
       *
       */

      mapData.push( {
        type: 'Feature',
        geometry: entity.geometry,
        profile: entity.profile,
        thumbnail: entity.thumbnail,
        path: entity.path
      } );

      return {
        success: true,
        status: 'entities retrieved',
        data: [{
          which: which,
          entity: entity,
          sendVolume: sendVolume,
          receiveVolume: receiveVolume,
          mapData: mapData,
        }]
      };
    }
    else {
      return {
        success: null,
        status: 'cound not retrieve entities'
      };
    }
  }

  function view( data ) {

    let $list;

    if ( data.success ) {

      /**
       * sets up the profile data for use in components
       *
       */

      UserComponents.setData( {
        entity: data.data[0].entity,
        editable: false
      } );

      $list = CanvasComponents.list( 'narrow' );

      V.setNode( $list, [
        UserComponents.thumbnailCard(),
        UserComponents.roleCard(),
        UserComponents.entityCard(),
        UserComponents.descriptionCard(),
        UserComponents.questionnaireCard(),
        UserComponents.fundingStatusCard( data.data[0].sendVolume, data.data[0].receiveVolume ),
        UserComponents.financialCard(),
        UserComponents.locationCard(),
        UserComponents.socialCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.evmAddressCard(),
        UserComponents.evmReceiverAddressCard(),
        UserComponents.socialShareButtons(),
      ] );

      Navigation.draw( data.data[0].entity );

      Chat.drawMessageForm();

      Page.draw( {
        listings: $list,
      } );

      VMap.draw( data.data[0].mapData );
    }
    else {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
    }
  }

  function preview() {

    /**
     * removes "Get Started"/"Watch intro" button, to exclude it
     * from "last position" update.
     *
     */

    V.setNode( '#get-started', 'clear' );

    Button.draw( 'all', { fade: 'out' } );

    Page.draw( {
      position: 'top',
    } );
  }

  /* ============ public methods and exports ============ */

  function draw( which ) {
    preview();
    presenter( which ).then( data => { view( data ) } );
  }

  return {
    draw: draw,
  };

} )();
