const GroupComponents = ( function() {

  /* ================== private methods ================= */

  function sortGroupsByPlotExistence( entity ) {
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

  function handleGroupSelection( group, entity ) {
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

    return groups.sort( sortGroupsByPlotExistence( entity ) ).map( group => {
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
              k: handleGroupSelection( group, entity ),
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

  function drawGroupPlotWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;
    if ( entity.role !== 'Group' ) {return ''}

    V.getEntity()
      .then( result => {
        const plots = V.cN( {
          c: 'pxy',
          h: result.data
            .filter( item => item.role === 'Plot' && entity.servicefields[V.castServiceField( 'groupedEntities' )].includes( item.uuidE ) )
            .map( plot => V.cN( { h: plot.fullId } ) ),
        } );

        const container = V.getNode( `[data-assigned-plots=${entity.uuidE}]` );
        container.classList.remove( 'zero-auto' );
        V.getNode( `[data-assigned-plots=${entity.uuidE}] .confirm-click-spinner` ).remove();
        container.append( plots );
      } );

    const node = V.cN( {
      c: 'zero-auto',
      a: {
        'data-assigned-plots': entity.uuidE,
      },
      h: [ InteractionComponents.confirmClickSpinner( { color: 'black' } ) ],
    } );
    return CanvasComponents.card( node, V.getString( 'Plots' ) );
  }

  return {
    drawGroupWidget: drawGroupWidget,
    drawGroupPlotWidget: drawGroupPlotWidget,
  };
} )();
