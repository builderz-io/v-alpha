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
      return V.successFalse( 'validate profile link' );
    }

    let query;

    const inCache = V.getViewed( which );

    if ( inCache ) {
      query = V.successTrue( 'used cache', inCache );
    }
    else {
      query = await V.getEntity( V.castPathOrId( which ) ).then( res => {
        if ( res.success ) {

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
      const data = {
        which: which,
        entity: entity,
        sendVolume: sendVolume,
        receiveVolume: receiveVolume,
      };

      return V.successTrue( 'retrieved entities', data );
    }
    else {
      return V.successFalse( 'retrieve entities' );
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
        editable: false,
      } );

      $list = CanvasComponents.list( 'narrow' );

      V.setNode( $list, [
        UserComponents.mediumImageCard(),
        // UserComponents.roleCard(),
        UserComponents.descriptionCard(),
        UserComponents.questionnaireCard(),
        UserComponents.socialCard(),
        UserComponents.locationCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.fundingStatusCard( data.data[0].sendVolume, data.data[0].receiveVolume ),
        UserComponents.financialCard(),
        UserComponents.entityCard(),
        UserComponents.evmAddressCard(),
        UserComponents.evmReceiverAddressCard(),
        UserComponents.managementCard(),
        UserComponents.adminOfCard(),
        UserComponents.socialShareButtons(),
      ] );

      VMap.draw( [data.data[0].entity] );

      Navigation.draw( data.data[0].entity ).then( () => {
        Page.draw( {
          position: 'top',
          listings: $list,
        } );
        Chat.drawMessageForm();
      } );
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
