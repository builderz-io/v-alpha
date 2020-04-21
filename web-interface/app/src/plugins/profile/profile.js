const Profile = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the profile pages,
  * including the logged in user profile
  *
  */

  'use strict';

  /* ================== private methods ================= */

  function addToNavItems( entity ) {
    const slug = V.castSlugOrId( entity.fullId );
    V.setNavItem( 'entityNav', {
      cid: '1003',
      f: entity.fullId,
      title: V.castInitials( entity.profile.title ),
      path: '/profile/' + slug,
      use: {
        button: 'none',
      },
      draw: function( slug ) {
        Profile.draw( slug );
      }
    } );
    console.log( V.getState() );
  }

  async function presenter( which ) {

    const fullId = V.castSlugOrId( which );
    const query = await V.getEntity( fullId );

    let $topcontent, $list;
    const mapData = [];

    if ( query.success ) {
      // add a navItem to entityNav
      const entity = query.data[0];

      mapData.push( { type: 'Feature', geometry: entity.geometry } );

      addToNavItems( entity );

      $topcontent = ProfileComponents.topcontent( entity.fullId );
      $list = CanvasComponents.list( 'narrow' );
      const $loc = ProfileComponents.locationCard( entity );
      const $card = CanvasComponents.card( $loc );
      V.setNode( $list, $card );
    }

    if ( which == 'active entity' ) {
      const aE = V.getState( 'activeEntity' );
      if ( aE ) {
        const eB = await V.getEntityBalance( aE );
        V.setNode( $list, InteractionComponents.entityFound( aE, eB ) );
      }
      else {
        V.setNode( $list, V.cN( { t: 'p', h: 'please join first' } ) );
      }
    }

    const data = {
      mapData: mapData,
      pageData: {
        topcontent: $topcontent,
        listings: $list,
        position: 'top',
      }
    };

    return data;
  }

  function view( data ) {
    Navigation.animate( 'profile' );
    Page.draw( data.pageData );
    VMap.draw( data.mapData );
  }

  /* ============ public methods and exports ============ */

  function launch() {

    V.setNavItem( 'entityNav', [
      // c = count  d = display Name  l = latest position (menu index)   s = short name   o = online
      {
        cid: '1001',
        f: 'Me',
        title: 'Me',
        path: '/profile/me',
        draw: function() {
          Profile.draw( 'me' );
        }
      },
      {
        cid: '1002',
        f: 'Profile',
        title: 'Profile',
        path: '/profile/profile',
        use: {
          button: 'none',
        },
        draw: function() {
          Profile.draw( 'profile' );
        }
      },
    ] );

  }

  function draw( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  return {
    draw: draw,
    launch: launch
  };

} )();
