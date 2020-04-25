const Profile = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the profile pages,
  * including the logged in user profile
  *
  */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    const fullId = V.castSlugOrId( which );
    const query = await V.getEntity( fullId );

    const mapData = [];

    if ( query.success ) {
      mapData.push( { type: 'Feature', geometry: query.data[0].geometry } );

      // add a navItem to entityNav
      // addToNavItems( query.data[0] );

      return {
        success: true,
        status: 'entities retrieved',
        data: [{
          which: which,
          entity: query.data[0],
          mapData: mapData,
        }]
      };
    }
    else {
      return {
        success: false,
        status: 'cound not retrieve entities',
        data: [{
          which: which,
          entity: {},
          mapData: [],
        }]
      };
    }
  }

  function view( data ) {

    let $topcontent, $list;

    if ( data.success ) {
      const entity = data.data[0].entity;

      $topcontent = ProfileComponents.topcontent( entity.fullId );
      $list = CanvasComponents.list( 'narrow' );
      const $loc = ProfileComponents.locationCard( entity );
      const $card = CanvasComponents.card( $loc );
      V.setNode( $list, $card );

      Navigation.drawV2( entity );
      // Navigation.animate( 'profile' );

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
        position: 'top',
      } );

      VMap.draw( data.mapData );
    }
  }

  // function addToNavItems( entity ) {
  //   const slug = V.castSlugOrId( entity.fullId );
  //
  //   const clone = JSON.parse( JSON.stringify( V.getState() ) );
  //   console.log( 'before add', clone );
  //
  //   V.setNavItem( 'entityNav', {
  //     cid: '1003',
  //     f: entity.fullId,
  //     title: V.castInitials( entity.profile.title ),
  //     path: '/profile/' + slug,
  //     use: {
  //       button: 'none',
  //     },
  //     draw: function( slug ) {
  //       Profile.draw( slug );
  //     }
  //   } );
  //   console.log( 'after add', V.getState() );
  // }

  /* ============ public methods and exports ============ */

  function launch() {

    /*
    V.setNavItem( 'entityNav', [
      // c = count  d = display Name  l = latest position (menu index)   s = short name   o = online
      // {
      //   cid: '1001',
      //   f: 'Me',
      //   title: 'Me',
      //   path: '/profile/me',
      //   draw: function() {
      //     Profile.draw( 'me' );
      //   }
      // },
      {
        cid: '1002',
        f: 'Profile',
        title: 'Profile',
        path: '/profile',
        use: {
          button: 'none',
        },
        draw: function() {
          Profile.draw( 'profile' );
        }
      },
    ] );
    */

  }

  function draw( which ) {
    presenter( which ).then( data => { view( data ) } );
  }

  return {
    draw: draw,
    launch: launch
  };

} )();
