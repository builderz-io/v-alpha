const GroupComponents = ( function() {
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
    drawGroupPlotWidget: drawGroupPlotWidget,
  };
} )();
