const Farm = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the display of farms, plots and other related data
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      farm: 'Farm',
      farms: 'Farms',
      plot: 'Plot',
      plots: 'Plots',
      widgetTitle: '',
      noPlots: 'No plots found',
      loginForPlots: 'Sign in to see your plots. Use the + button to create a plot, or open a plot profile you manage.',
      backToPlots: 'Back to plots',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  function preview( whichPath ) {
    Navigation.draw( whichPath );
    Page.draw( {
      position: 'peek',
    } );
  }

  function isPlotsPath( which ) {
    return which === '/farms/plots' || which === '/farms/plots/';
  }

  async function presenterPlots() {
    if ( V.aE() && V.aE().holderOf && V.aE().holderOf.length ) {
      const plotIds = V.aE().holderOf
        .filter( item => item.c === 'ap' || V.castRole( item.c ) === 'Plot' )
        .map( item => item.a );
      if ( plotIds.length ) {
        const ids = plotIds.length > 50 ? plotIds.slice( 0, 50 ) : plotIds;
        return V.getEntity( ids );
      }
    }

    const search = await V.getQuery( { role: 'Plot', query: ' ', field: 'title' } );
    if ( search.success && search.data && search.data.length ) {
      return search;
    }

    return {
      success: false,
      status: 'no plots for active entity',
      data: [],
    };
  }

  function viewPlots( queryResult ) {
    const $slider = CanvasComponents.slider();
    const $list = CanvasComponents.list();

    V.setState( 'active', { navItem: '/farms/plots' } );
    const $addcard = MarketplaceComponents.entitiesAddCard();
    V.setNode( $slider, $addcard );

    if ( queryResult.success && queryResult.data && queryResult.data.length ) {
      if ( V.aE() && V.aE().holderOf ) {
        V.setNode( $list, SoilCalculatorComponents.plotCompareTable( queryResult.data ) );
      }
      queryResult.data.forEach( entity => {
        V.setNode( $list, UserComponents.entityListCard( entity ) );
      } );
      VMap.draw( queryResult.data, { isSearch: true } );
    }
    else {
      V.setNode( $list, V.cN( {
        c: 'pxy',
        h: [
          CanvasComponents.notFound( 'plots' ),
          V.cN( {
            c: 's-calc-validation-banner mt-r',
            h: V.aE()
              ? V.getString( ui.noPlots )
              : V.getString( ui.loginForPlots ),
          } ),
        ],
      } ) );
      VMap.draw( [{ role: 'Plot' }] );
    }

    Page.draw( {
      topslider: $slider,
      listings: $list,
    } );
  }

  function drawPlotWorkspace( rawentity ) {
    Page.draw( {
      position: 'peek',
    } );

    V.getEntity( rawentity ).then( res => {
      if ( !res.success || !res.data[0] ) {
        Page.draw( {
          listings: CanvasComponents.notFound( 'plot' ),
        } );
        return;
      }

      const entity = res.data[0];
      V.setState( 'active', {
        lastViewedEntity: entity,
        lastViewed: entity.fullId,
      } );
      UserComponents.setData( {
        entity: entity,
        editable: false,
      } );

      const quality = SoilCalculatorComponents.getDataQualitySummary( entity.servicefields );
      const location = entity.properties && entity.properties.baseLocation
        ? entity.properties.baseLocation
        : '';

      const $header = V.cN( {
        c: 's-calc-plot-header',
        h: [
          V.cN( {
            t: 'button',
            c: 's-calc-plot-header__back',
            h: '← ' + V.getString( ui.backToPlots ),
            k: () => {
              V.setBrowserHistory( '/farms/plots' );
              Farm.draw( '/farms/plots' );
            },
          } ),
          V.cN( {
            c: 's-calc-plot-header__main',
            h: [
              V.cN( {
                t: 'h1',
                c: 's-calc-plot-header__title',
                h: entity.title || entity.fullId,
              } ),
              V.cN( {
                c: 's-calc-plot-header__meta',
                h: [
                  location ? V.cN( { t: 'span', h: location } ) : '',
                  V.cN( { c: 's-calc-quality-badge', h: quality.label } ),
                ].filter( Boolean ),
              } ),
            ],
          } ),
        ],
      } );

      const $workspace = SoilCalculatorComponents.drawPlotWorkspace();
      SoilCalculatorComponents.drawWorkspaceContent( 'workspace', entity.servicefields );

      /* mount inside a `list` so the page has its scroll container (page.js looks
         for `<list>`); a bare div overflows the overflow-hidden page and breaks scrolling */
      const $list = CanvasComponents.list();
      V.setNode( $list, $workspace );

      Page.draw( {
        topslider: $header,
        listings: $list,
      } );

      VMap.draw( [entity] );
    } );
  }

  /* ============ public methods and exports ============ */

  function launch() {
    const navItems = {
      farms: {
        title: ui.farms,
        path: '/farms',
        use: {
          form: 'new entity',
          role: 'Farm',
          join: 5,
          privacy: 2,
        },
        draw: function( path ) {
          Farm.draw( path );
        },
      },
      plots: {
        title: ui.plots,
        path: '/farms/plots',
        use: {
          form: 'new entity',
          role: 'Plot',
          join: 4,
          privacy: 1,
          noKeyDwnl: true,
        },
        draw: function( path ) {
          Farm.draw( path );
        },
      },
    };
    V.setNavItem( 'serviceNav', V.getSetting( 'plugins' ).farm.map( item => navItems[item] ) );
  }

  function draw( which ) {
    preview( which );
    if ( isPlotsPath( which ) ) {
      presenterPlots().then( viewPlots );
      return;
    }
    Marketplace.draw( which );
  }

  function drawPlotWidget( display ) {

    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role != 'Plot' ) { return ''}

    const path = window.location.pathname || '';
    if ( path.indexOf( '/calculator' ) !== -1 ) { return '' }

    if ( V.getSetting( 'soilCalcTimeline' ) !== false ) {
      const $compact = SoilCalculatorComponents.drawCompactDashboard(
        entity.servicefields || {},
      );
      if ( !SoilCalculator.isParametersReady() ) {
        SoilCalculator.whenReady.then( () => {
          const host = V.getNode( '.s-calc-compact' );
          if ( host && host.parentElement ) {
            const refreshed = SoilCalculatorComponents.drawCompactDashboard(
              entity.servicefields || {},
            );
            host.parentElement.replaceWith( refreshed );
          }
        } );
      }
      return $compact;
    }

    SoilCalculator.whenReady.then( () => {
      SoilCalculatorComponents.drawWidgetContent( display, entity.servicefields );
    } );

    return SoilCalculatorComponents.widget( display );

  }

  V.setState( 'availablePlugins', { farm: launch } );

  return {
    launch: launch,
    draw: draw,
    drawPlotWidget: drawPlotWidget,
    drawPlotWorkspace: drawPlotWorkspace,
  };

} )();
