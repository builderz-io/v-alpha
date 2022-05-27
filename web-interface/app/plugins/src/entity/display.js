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
      } );

      /*
       * Pool data
       *
       */

      let txHistory, sendVolume = 0, receiveVolume = 0;

      /*
      if ( entity.role == 'Pool' ) {
        if ( V.cA() || !V.aE() ) {
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
      */

      if ( entity.role == 'Pool' ) {
        txHistory = await V.getAddressHistory( {
          address: entity.evmCredentials.address,
          fromBlock: 0, // could be entity creation block
          toBlock: 'latest',
        } );
        if ( txHistory.success && txHistory.data.length ) {
          txHistory.data.forEach( tx => {
            tx.txType == 'out'? sendVolume += Number( tx.amount ) : null;
            tx.txType == 'in'? receiveVolume += Number( tx.amount ) : null;
          } );
        }
      }

      const data = {
        typeOfWhich: typeof which,
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
      // if ( window.location.host.includes( 'localhost' ) ) {
      //   V.getAddressState( data.data[0].entity.evmCredentials.address )
      //     .then( res => {
      //       console.log( '*** ADDRESS STATE *** ' );
      //       for ( const key in res.data[0] ) {
      //         console.log( key, ':', res.data[0][key] );
      //       }
      //       console.log( '*** ADDRESS STATE END *** ' );
      //     } );
      // }

      /**
       * sets up the profile data for use in components
       *
       */

      const entity = data.data[0].entity;

      UserComponents.setData( {
        entity: entity,
        editable: false,
      } );

      $list = CanvasComponents.list( 'narrow' );

      V.setNode( $list, [
        UserComponents.mediumImageCard(),
        // UserComponents.roleCard(),
        UserComponents.fundingStatusCard( data.data[0].sendVolume, data.data[0].receiveVolume ),
        UserComponents.descriptionCard(),
        UserComponents.questionnaireCard(),
        UserComponents.socialCard(),
        UserComponents.locationCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.financialCard(),
        UserComponents.entityCard(),
        UserComponents.evmAddressCard(),
        UserComponents.evmReceiverAddressCard(),
        UserComponents.managementCard(),
        UserComponents.holderOfCard(),
        UserComponents.socialShareButtons(),
      ] );

      VMap.draw( [entity] );

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
    else {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
    }
  }

  function delayedMessageForm( entity ) {
    if ( !V.aE() ) { return }

    /** This is a hacky way to wait for V.aE( 'uuidE' ) to be available */
    setTimeout( function delayMsgForm() {
      entity.uuidE != V.aE( 'uuidE' )
        ? Chat.drawMessageForm()
        : null;
    }, 1800, entity );
  }

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
