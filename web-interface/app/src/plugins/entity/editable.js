const User = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity edit page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    if ( !V.getState( 'activeEntity' ) ) {
      return {
        success: false,
        status: ''
      };
    }
    else {
      return {
        success: true,
        status: 'active entity retrieved',
        data: [{
          which: which,
          entity: V.getState( 'activeEntity' ),
          mapData: [{ type: 'Feature', geometry: V.getState( 'activeEntity' ).geometry }],
        }]
      };
    }
    //
    // const fullId = V.getState( 'activeEntity' ).fullId;
    // const query = await V.getEntity( fullId ); // query again for changes
    //
    // const mapData = [];
    //
    // if ( query.success ) {
    //
    //   mapData.push( { type: 'Feature', geometry: query.data[0].geometry } );
    //
    //   return {
    //     success: true,
    //     status: 'user retrieved',
    //     data: [{
    //       which: which,
    //       entity: query.data[0],
    //       mapData: mapData,
    //     }]
    //   };
    // }
    // else {
    //   return {
    //     success: null,
    //     status: 'cound not retrieve user'
    //   };
    // }
  }

  function view( data ) {

    let $topcontent, $list;

    if ( data.success ) {
      UserComponents.setData( {
        entity: data.data[0].entity,
        editable: true
      } );

      $list = CanvasComponents.list( 'narrow' );
      $topcontent = UserComponents.topcontent();

      V.setNode( $list, [
        Join.onboardingCard(),
        UserComponents.entityCard(),
        UserComponents.locationCard(),
        UserComponents.introCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.financialCard(),
        UserComponents.socialCard(),
        UserComponents.evmAddressCard(),
      ] );

      Navigation.draw( data.data[0].which );

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
        position: 'top',
      } ).then( () => {
        Google.launch().then( () => { // adds places lib script
          Google.initAutocomplete( 'user' );
        } );
      } );

      Chat.drawMessageForm( 'clear' );

      VMap.draw( data.data[0].mapData );
    }
    else if ( data.success === null ) {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
    }
    else {
      Marketplace.draw();
    }
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNavItem( 'userNav', [
      {
        title: 'Account',
        path: '/me/account',
        use: {
          button: 'search',
        },
        draw: function( path ) {
          Account.draw( path );
        }
      },
      {
        title: 'Profile',
        path: '/me/profile',
        use: {
          button: 'plus search',
        },
        draw: function( path ) {
          User.draw( path );
        }
      },
      {
        title: 'Settings',
        path: '/me/settings',
        use: {
          button: 'plus search',
        },
        draw: function( path ) {
          Settings.draw( path );
        }
      },
      {
        title: 'Entities',
        path: '/me/entities',
        use: {
          button: 'plus search',
        },
        draw: function( path ) {
          EntityList.draw( path );
        }
      }
    ] );
  }

  function draw( which ) {
    presenter( which ).then( data => { view( data ) } );
  }

  return {
    draw: draw,
    launch: launch
  };

} )();
