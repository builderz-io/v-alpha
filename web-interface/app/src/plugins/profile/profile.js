const Profile = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the profile pages,
  * including the logged in user profile
  *
  */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  function addNavItem( entity ) {
    // const obj = {};
    // obj[V.castCamelCase( entity.profile.title )] = {
    //   cid: '1003',
    //   c: 0,
    //   l: -1,
    //   f: entity.fullId,
    //   title: V.castInitials( entity.profile.title ),
    //   // role: 'member',
    //   // draw: function() { Chat.draw() },
    //   o: false,
    //   path: '/profile/jane-wood-2121',
    //   use: {
    //     button: 'none',
    //   },
    //   draw: function() {
    //     Profile.draw( 'jane-wood-2121' );
    //   }
    // };
    // V.setState( 'entityNav', obj );

    V.setNavItem( 'entityNav', {
      cid: '1003',
      c: 0,
      l: -1,
      f: entity.fullId,
      title: V.castInitials( entity.profile.title ),
      // role: 'member',
      // draw: function() { Chat.draw() },
      o: false,
      path: '/profile/jane-wood-2121',
      use: {
        button: 'none',
      },
      draw: function() {
        Profile.draw( 'jane-wood-2121' );
      }
    } );
    console.log( V.getState() );
  }

  async function presenter( which ) {

    const split = which.split( '-' );
    const tag = '#' + split.pop();
    const title = V.castEntityTitle( split.join( ' ' ) ).data[0];
    const fullId = title + ' ' + tag;

    const query = await V.getEntity( fullId );

    console.log( query );

    let $topcontent, $list;
    if ( query.success ) {
      // add a navItem to entityNav
      const entity = query.data[0];

      addNavItem( entity );

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

    const pageData = {
      topcontent: $topcontent,
      listings: $list,
      position: 'top',
    };

    return pageData;
  }

  function view( pageData ) {

    Navigation.animate( 'profile' );

    Page.draw( pageData );
  }

  /* ============ public methods and exports ============ */

  function launch() {

    V.setNavItem( 'entityNav', [
      // c = count  d = display Name  l = latest position (menu index)   s = short name   o = online
      {
        cid: '1001',
        c: 0,
        l: -1,
        f: 'Me',
        title: 'Me',
        // role: 'member',
        // draw: function() { Chat.draw() },
        o: true,
        path: '/profile/me',
        draw: function() {
          Profile.draw( 'me' );
        }
      },
      {
        cid: '1002',
        c: 0,
        l: -1,
        f: 'Profile',
        title: 'Profile',
        // role: 'member',
        // draw: function() { Chat.draw() },
        o: false,
        path: '/profile/profile',
        use: {
          button: 'none',
        },
        draw: function() {
          Profile.draw( 'profile' );
        }
      },
      // {
      //   cid: '1002',
      //   c: 0,
      //   l: -1,
      //   f: 'Me2',
      //   title: 'Me2',
      //   // role: 'member',
      //   // draw: function() { Chat.draw() },
      //   o: true,
      // }
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
