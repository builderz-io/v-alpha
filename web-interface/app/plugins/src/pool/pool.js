const Pool = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the display of pools aka crowdfunding campaigns
   *
   * Note: Currently for DEMO PURPOSE only
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = {
    funding: 'Funding Status',
  };

  function getString( string, scope ) {
    return V.i18n( string, 'pool', scope || 'pool cards content' ) + ' ';
  }

  /* ================== private methods ================= */

  // async function presenter() {
  //
  //   const poolPoints = V.getCache( 'points' ).data
  //     .filter( item => item.role == 'an' );
  //
  //   if ( !poolPoints ) {
  //     return {
  //       success: false,
  //     };
  //   }
  //
  //   const entities = await V.getEntity( poolPoints.map( item => item.uuidE ) );
  //
  //   return entities;
  // }

  // function view( poolData ) {
  //   const $slider = CanvasComponents.slider();
  //   const $list = CanvasComponents.list();
  //
  //   const $addcard = MarketplaceComponents.entitiesAddCard();
  //   V.setNode( $slider, $addcard );
  //
  //   if ( poolData.data[0] ) {
  //     poolData.data.forEach( cardData => {
  //       const $cardContent = MediaComponents.mediaCard( cardData );
  //       const $card = CanvasComponents.card( $cardContent );
  //       V.setNode( $list, $card );
  //
  //     } );
  //   }
  //   else {
  //     V.setNode( $list, CanvasComponents.notFound( 'pool' ) );
  //   }
  //
  //   Page.draw( {
  //     topslider: $slider,
  //     listings: $list,
  //     // position: 'top',
  //   } );
  // }

  function preview( whichPath ) {
    Navigation.draw( whichPath );
    Page.draw( {
      position: 'top',
    } );
  }

  async function getFundingStatus( entity ) {

    let sendVolume = 0, receiveVolume = 0;
    const txHistory = await V.getAddressHistory( {
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
    return {
      sendVolume: sendVolume,
      receiveVolume: receiveVolume,
      target: entity.properties.target,
    };
  }

  /* ============ public methods and exports ============ */

  function launch() {
    const navItems = {
      pools: {
        title: 'Crowdfunding',
        path: '/pools',
        use: {
          form: 'new entity',
          role: 'Pool',
        },
        draw: function( path ) {
          Pool.draw( path );
        },
      },
    };
    V.setNavItem( 'serviceNav', V.getSetting( 'plugins' ).pool.map( item => navItems[item] ) );
  }

  function draw( which ) {
    preview( which );
    Marketplace.draw( which );
    // presenter( which ).then( viewData => { view( viewData ) } );
  }

  function drawWidget() {

    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role != 'Pool' ) { return ''}

    /* replaces preview with retrieved data */

    getFundingStatus( entity )
      .then( data => {
        setTimeout( function drawFundingStatus() {
          V.setNode( '.funding-status-wrapper', '' );
          V.setNode( '.funding-status-wrapper', PoolComponents.fundingStatusContent( data ) );
        }, 50 );
      } );

    /* draws the preview */

    const preview = {
      sendVolume: 0,
      receiveVolume: 0,
      target: V.getState( 'active' ).lastViewedEntity.properties.target,
    };

    const $inner = PoolComponents.fundingStatusWrapper( PoolComponents.fundingStatusContent( preview ) );

    return CanvasComponents.card( $inner, getString( ui.funding ) );

  }

  V.setState( 'availablePlugins', { pool: launch } );

  return {
    launch: launch,
    draw: draw,
    drawWidget: drawWidget,
  };

} )();
