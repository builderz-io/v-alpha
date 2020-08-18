const Profile = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity display page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    const fullId = V.castPathOrId( which );

    const query = await V.getEntity( fullId );

    const mapData = [];

    if ( query.success ) {

      V.setState( 'active', { lastViewed: query.data[0].fullId } );

      /*
       * Pool data
       *
       */

      let txHistory, sendVolume = 0, receiveVolume = 0;

      if ( query.data[0].profile.role == 'pool' ) {
        if ( V.getState( 'activeAddress' ) || !V.getState( 'activeEntity' ) ) {
          if ( query.data[0].evmCredentials ) {
            txHistory = await V.getAddressHistory( query.data[0].evmCredentials.address );
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
          if ( !query.data[0].stats ) {
            Object.assign( query.data[0], { stats: {
              sendVolume: 0,
              receiveVolume: 0,
            } } );
          }
          sendVolume = query.data[0].stats.sendVolume;
          receiveVolume = query.data[0].stats.receiveVolume;
        }
      }

      /*
       * Map data
       *
       */

      mapData.push( {
        type: 'Feature',
        geometry: query.data[0].geometry,
        profile: query.data[0].profile,
        thumbnail: query.data[0].thumbnail,
        path: query.data[0].path
      } );

      return {
        success: true,
        status: 'entities retrieved',
        data: [{
          which: which,
          entity: query.data[0],
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

      UserComponents.setData( {
        entity: data.data[0].entity,
        editable: false
      } );

      $list = CanvasComponents.list( 'narrow' );

      V.setNode( $list, [
        UserComponents.thumbnailCard(),
        UserComponents.entityCard(),
        UserComponents.fundingStatusCard( data.data[0].sendVolume, data.data[0].receiveVolume ),
        UserComponents.financialCard(),
        UserComponents.descriptionCard(),
        UserComponents.locationCard(),
        UserComponents.socialCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.evmAddressCard(),
        UserComponents.evmReceiverAddressCard(),
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
