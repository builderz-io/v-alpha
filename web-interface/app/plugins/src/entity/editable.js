const User = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the entity edit page
   *
   */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {
    let query;
    const inCache = V.getCache().viewed ? V.getCache().viewed.data.find( entity => entity.path == which ) : undefined;

    if ( !V.aE() ) {
      return {
        success: false,
        status: '',
      };
    }
    if ( inCache ) {
      query = {
        success: true,
        data: [inCache],
      };
    }
    else {
      query = await V.getEntity(
        which.length == V.getSetting( 'uuidStringLength' ) && // checks whether which is a uuidE or a path
        isNaN( Number( which.slice( -5 ) ) )
          ? which
          : V.castPathOrId( which )
      ).then( res => {
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

      V.setState( 'active', {
        lastViewed: entity.fullId,
        lastViewedUuidE: entity.uuidE,
        lastViewedUuidP: entity.uuidP,
      } );

      return {
        success: true,
        status: 'editable entity retrieved',
        data: [entity],
      };
    }
  }

  function view( viewData ) {

    let $topcontent, $list;

    if ( viewData.success ) {
      UserComponents.setData( {
        entity: viewData.data[0],
        editable: true,
      } );

      $list = CanvasComponents.list( 'narrow' );
      $topcontent = UserComponents.topcontent();

      V.setNode( $list, [
        // InteractionComponents.onboardingCard(),
        // UserComponents.roleCard(),
        UserComponents.addOrChangeImage(),
        UserComponents.descriptionCard(),
        UserComponents.questionnaireCard(),
        UserComponents.socialCard(),
        UserComponents.locationCard(),
        UserComponents.preferredLangsCard(),
        UserComponents.financialCard(),
        UserComponents.entityCard(),
        UserComponents.evmAddressCard(),
        UserComponents.evmReceiverAddressCard(),
        UserComponents.accessKeysCard(),
        UserComponents.managementCard(),
        // UserComponents.adminOfCard(),
        UserComponents.socialShareButtons(),
      ] );

      // if( viewData.data.drawNav ) {
      //   Navigation.draw( viewData.data[0].entity );
      // }

      Page.draw( {
        // topcontent: $topcontent,
        listings: $list,
      } ).then( () => {
        Google.launch().then( () => { // adds places lib script
          Google.initAutocomplete( 'user' );
        } );
      } );

      VMap.draw( [viewData.data[0]] );
    }
    else {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'entity' ),
      } );
    }
  }

  function preview( /* path */ ) {
    Button.draw( 'all', { fade: 'out' } );

    // if ( path == '/me/profile' ) {
    //   Navigation.draw( path );
    // }

    Page.draw( {
      position: 'top',
    } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    V.setNavItem( 'userNav', [
      // {
      //   title: 'Edit',
      //   path: '/me/edit',
      //   use: {
      //     button: 'plus search',
      //   },
      //   draw: function( path ) {
      //     EntityList.draw( path );
      //   },
      // },
      {
        title: 'Transfers',
        path: '/me/transfers',
        use: {
          button: 'search',
        },
        draw: function( path ) {
          Account.draw( path );
        },
      },
      // {
      //   title: 'Profile',
      //   path: '/me/profile',
      //   use: {
      //     button: 'plus search',
      //   },
      //   draw: function( path ) {
      //     User.draw( path );
      //   }
      // },
      {
        title: 'Settings',
        path: '/me/settings',
        use: {
          button: 'plus search',
        },
        draw: function( path ) {
          Settings.draw( path );
        },
      },
      {
        title: 'Disconnect',
        path: '/me/disconnect',
        draw: function( path ) {
          User.draw( path );
        },
      },
    ] );
  }

  function draw( path ) {
    if ( path == '/me/disconnect' ) {
      Modal.draw( 'disconnect' );
    }
    else {
      preview( path );
      presenter( path ).then( viewData => { view( viewData ) } );
    }
  }

  return {
    draw: draw,
    launch: launch,
  };

} )();
