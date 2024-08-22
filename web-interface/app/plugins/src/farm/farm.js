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
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

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
      position: 'peek',
    } );
  }

  function sortGropusByPlotExistence( entity ) {
    return ( a, b ) => {
      const groupedEntitiesA = a.servicefields[V.castServiceField( 'groupedEntities' )];
      const groupedEntitiesB = b.servicefields[V.castServiceField( 'groupedEntities' )];

      if ( groupedEntitiesA && groupedEntitiesA.includes( entity.uuidE ) && ( !groupedEntitiesB || !groupedEntitiesB.includes( entity.uuidE ) ) ) {
        return -1;
      }

      if ( groupedEntitiesB && groupedEntitiesB.includes( entity.uuidE ) && ( !groupedEntitiesA || !groupedEntitiesA.includes( entity.uuidE ) ) ) {
        return 1;
      }

      return 0;
    };
  }

  function groupSelectionEventHandler( group, entity ) {
    return ( event ) => {
      event.target.disabled = true;

      const groupFields = group.servicefields[V.castServiceField( 'groupedEntities' )]
        ? group.servicefields[V.castServiceField( 'groupedEntities' )].split( ',' )
        : [];

      if ( event.target.checked ) {
        groupFields.push( entity.uuidE );

        V.setEntity( group.fullId, {
          field: `servicefields.${V.castServiceField( 'groupedEntities' )}`,
          data: groupFields.join( ',' ),
          activeProfile: group.uuidP,
        } ).then( () => {
          event.target.disabled = false;
        } );

        const totalBalanceWidget = V.cN( {
          a: {
            'data-group-calc': group.uuidE,
          },
          h: SoilCalculatorComponents.drawTotalBalance(),
        } );

        V.setNode( `[data-plot-group=${group.uuidE}]`, totalBalanceWidget );
      }
      else {
        const totalBalanceWidget = V.gN( `[data-group-calc=${group.uuidE}]` );
        if ( totalBalanceWidget ) {
          if ( groupFields.includes( entity.uuidE ) ) {
            const idx = groupFields.indexOf( entity.uuidE );
            groupFields.splice( idx, 1 );
          }

          V.setEntity( group.fullId, {
            field: `servicefields.${V.castServiceField( 'groupedEntities' )}`,
            data: groupFields.join( ',' ),
            activeProfile: group.uuidP,
          } ).then( () => {
            event.target.disabled = false;
          } );

          totalBalanceWidget.remove();
        }
      }
    };
  }

  function drawGroupCheckboxes( groups ) {
    const entity = V.getState( 'active' ).lastViewedEntity;

    return groups.sort( sortGropusByPlotExistence( entity ) ).map( group => {
      const entityInGroup = group.servicefields[V.castServiceField( 'groupedEntities' )]
        ? group.servicefields[V.castServiceField( 'groupedEntities' )].includes( entity.uuidE )
        : false;

      const children = [
        V.cN( {
          c: 'plot-group-selection__item',
          h: [
            {
              c: 'mr-rr',
              t: 'input',
              a: {
                type: 'checkbox',
                id: group.uuidE,
                value: group.uuidE,
                checked: entityInGroup,
              },
              k: groupSelectionEventHandler( group, entity ),
            },
            {
              t: 'label',
              a: { for: group.uuidE },
              h: group.fullId,
            },
          ] } ),
      ];

      if ( entityInGroup ) {
        const groupTotalBalanceWidget =  V.cN( {
          a: {
            'data-group-calc': group.uuidE,
          },
          h: SoilCalculatorComponents.drawTotalBalance(),
        } );
        children.push( groupTotalBalanceWidget );
      }

      return V.cN( {
        c: 'pxy',
        a: {
          'data-plot-group': group.uuidE,
        },
        h: children,
      } );
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
    Marketplace.draw( which );
    // presenter( which ).then( viewData => { view( viewData ) } );
  }

  function drawPlotWidget( display ) {

    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role != 'Plot' ) { return ''}

    /* replaces preview with retrieved data */

    setTimeout( function datasetRetrieval() {
      SoilCalculatorComponents.drawWidgetContent( display, entity.servicefields );
    }, 800 );

    /* draws the preview */

    const $inner = SoilCalculatorComponents.widget( display );

    // return CanvasComponents.card( $inner, V.getString( ui.widgetTitle ) );
    return $inner;

  }

  function drawGroupWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role !== 'Plot' ) {return ''}

    V.getEntity()
      .then( ( { data } ) => {
        const groups = data.filter( item => item.role === 'Group' );

        const groupSelection = V.getNode( '.plot-group-selection' );
        groupSelection.classList.remove( 'zero-auto' );
        groupSelection.classList.add( 'w-full' );
        V.getNode( '.plot-group-selection .confirm-click-spinner' ).remove();
        groupSelection.append(
          V.cN(
            {
              h: [
                ...drawGroupCheckboxes( groups ),
                V.cN(
                  {
                    t: 'button',
                    c: 'w-full pxy text-left bkg-lightblue txt-gray',
                    h: V.getString( 'New group' ),
                    k: () => {
                      Page.draw( { position: 'closed', reset: false, navReset: false } );
                      V.setNode( 'body', JoinRoutine.draw( V.getNavItem( '/group', 'serviceNav' ).use ) );
                    },
                  },
                ),
              ],
            },
          ),
        );
      } );

    const parent = V.cN( {
      c: 'pxy plot-group-selection zero-auto',
      h: [InteractionComponents.confirmClickSpinner( { color: 'black' } )],
    } );

    return CanvasComponents.card( parent, V.getString( 'Groups' ) );
  }

  V.setState( 'availablePlugins', { farm: launch } );

  return {
    launch: launch,
    draw: draw,
    drawPlotWidget: drawPlotWidget,
    drawGroupWidget: drawGroupWidget,
  };

} )();
