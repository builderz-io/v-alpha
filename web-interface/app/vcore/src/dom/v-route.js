const VRoute = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module for routing
   *
   */

  'use strict';

  window.onpopstate = () => {
    V.setState( 'active', window.history.state );
    Canvas.draw( window.history.state );
  };

  const routes = [
    {
      path: '',
      action: () => {
        return {
          status: 'home',
          data: [ '/market/all' ]
        };
      }
    },
    {
      path: '/profile',
      children: [
        {
          path: '/:rawentity',
          action: ( context ) => {
            return {
              status: 'profile',
              data: [ context.params.rawentity ]
            };
          }
        }
      ]
    },
    {
      path: '/chat',
      children: [
        {
          path: '/everyone',
          action: () => {
            return {
              status: 'chat everyone',
              data: [ '/chat/everyone' ]
            };
          }
        },
        {
          path: '/:id',
          action: ( context ) => {
            return {
              status: 'chat id',
              data: [ context.params.id ]
            };
          }
        }
      ]
    },
    {
      path: '/market',
      children: [
        {
          path: '',
          action: () => {
            return {
              status: 'market',
              data: [ '/market' ]
            };
          }
        },
        {
          path: '/:id',
          action: ( context ) => {
            return {
              status: 'market category',
              data: [ '/market/' + context.params.id ]
            };
          }
        }
      ]
    },
    {
      path: '/me',
      children: [
        {
          path: '/transfers',
          action: () => {
            return {
              status: 'user account',
              data: [ '/me/transfers' ]
            };
          }
        },
        {
          path: '/profile',
          action: () => {
            return {
              status: 'user profile',
              data: [ '/me/profile' ]
            };
          }
        },
        {
          path: '/settings',
          action: () => {
            return {
              status: 'user settings',
              data: [ '/me/settings' ]
            };
          }
        },
        {
          path: '/entities',
          action: () => {
            return {
              status: 'user entities',
              data: [ '/me/entities' ]
            };
          }
        }
      ]
    },
    {
      path: '/media',
      children: [
        {
          path: '',
          action: () => {
            return {
              status: 'media',
              data: [ '/media' ]
            };
          }
        },
        {
          path: '/:id',
          action: ( context ) => {
            return {
              status: 'media category',
              data: [ '/media/' + context.params.id ]
            };
          }
        }
      ]
    },
    {
      path: '/data',
      action: () => {
        return {
          status: 'data',
          data: [ '/data' ]
        };
      }
    },
    {
      path: '/pools',
      action: () => {
        return {
          status: 'pool',
          data: [ '/pools' ]
        };
      }
    },
    // {
    //   path: '/events',
    //   action: () => {
    //     return {
    //       status: 'events',
    //       data: [ '/events' ]
    //     };
    //   }
    // }
  ];

  const Router = new UniversalRouter( routes );

  /* ================== public methods ================== */

  function castRoute( route ) {
    return Router.resolve( route );
  }

  function setRoute() {
    // todo
  }

  function setBrowserHistory( path ) {

    const data = { path: path };
    // console.log( data );
    // console.log( V.castJson( V.getState( 'active' ), 'clone' ) );
    if( V.getState( 'active' ).path != data.path ) {
      window.history.pushState(
        data,
        data.path,
        window.location.origin + data.path
      );
      V.setState( 'active', { path: data.path } );
    }
  }

  /* ====================== export ====================== */

  V.castRoute = castRoute;
  V.setRoute = setRoute;
  V.setBrowserHistory = setBrowserHistory;

  return {
    castRoute: castRoute,
    setRoute: setRoute,
    setBrowserHistory: setBrowserHistory
  };

} )();
