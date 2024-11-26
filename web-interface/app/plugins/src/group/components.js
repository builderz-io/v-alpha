const GroupComponents = ( function() {

  const ui = ( () => {
    const strings = {
      newGroup: 'Add new group',
      noGroups: 'No groups available',
      groups: 'Groups',
      grouping: 'Grouping',
      noAssignedEntities: 'No entities assigned to group',
      plots: 'Plots',
      soilBalanceTitle: 'Soil Balance',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  function handleProfileDraw() {
    const path = V.castPathOrId( this.textContent );
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( path );
    Profile.draw( path );
  }

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

  function updateGroupedEntities( group, groupedEntities ) {
    return V.setEntity( group.fullId, {
      field: `servicefields.${V.castServiceField( 'groupedEntities' )}`,
      data: V.castJson( groupedEntities ),
      activeProfile: group.uuidP,
    } );
  }

  function handleGroupSelection( group, entity ) {
    return ( event ) => {
      event.target.disabled = true;

      const groupFields = new Set( V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ) ||  [] );

      if ( event.target.checked ) {
        if ( !groupFields.has( entity.uuidE ) ) {
          groupFields.add( entity.uuidE );
        }

        updateGroupedEntities( group, [...groupFields.values()] );

        drawCheckboxGroupTotalBalanceWidget( group.uuidE, [...groupFields.values()] )
          .then( widget => {
            const loadingElement = V.gN( `[data-plot-group=${group.uuidE}] .calculator-loader` );
            if ( loadingElement ) {loadingElement.remove()}
            event.target.disabled = false;
            V.setNode( `[data-plot-group=${group.uuidE}]`, widget );
          } );

        V.setNode( `[data-plot-group=${group.uuidE}]`, V.cN( {
          c: 'zero-auto pxy calculator-loader',
          a: { style: 'max-width: fit-content;' },
          h: InteractionComponents.confirmClickSpinner( { color: 'black' } ),
        } ) );
      }
      else {
        const totalBalanceWidget = V.gN( `[data-group-calc=${group.uuidE}]` );
        if ( totalBalanceWidget ) {
          if ( groupFields.has( entity.uuidE ) ) {
            groupFields.delete( entity.uuidE );
          }

          updateGroupedEntities( group, [...groupFields.values()] )
            .then( () =>  ( event.target.disabled = false )  );

          totalBalanceWidget.remove();
        }
      }
    };
  }

  function handleInputType( group, inputType ) {
    const selectGroupNodes = V.getNodes( `[data-plot-group=${group.uuidE}] .group-selection-element`  );
    const editTitleNodes = V.getNodes( `[data-plot-group=${group.uuidE}] .group-title-edit-element`  );

    for ( const el of selectGroupNodes ) {
      el.classList.toggle( 'hide', inputType === 'editTitle' );
    }

    for ( const el of editTitleNodes ) {
      el.classList.toggle( 'hide', inputType === 'selectGroup' );
    }
  }

  function toggleChangeTitleLoading( element, inputElement, isLoading, elementAfterLoad ) {
    element.innerHTML = '';
    element.append(
      isLoading
        ? InteractionComponents.confirmClickSpinner( { color: 'black' } )
        : elementAfterLoad || '',
    );
    inputElement.disabled = isLoading;
  }

  function drawCheckboxGroupTotalBalanceWidget( groupId, plotIds ) {
    return V.getEntity( plotIds )
      .then( result => {
        const plotAccumulatedData = SoilCalculator.getAccumulatedSequenceResults(
          result.data.map(
            plot => plot.servicefields[V.castServiceField( 'yearsAverageSequence' )]
              ? V.castJson( plot.servicefields[V.castServiceField( 'yearsAverageSequence' )] )
              : V.castJson( plot.servicefields[V.castServiceField( 'averageSequence' )] ),
          ),
        );
        return V.cN( {
          a: { 'data-group-calc': groupId },
          h: SoilCalculatorComponents.drawTotalBalance( plotAccumulatedData ),
        } );
      } );
  }

  function drawGroupCheckbox( group, entity, entityInGroup ) {
    const selectGroupLabel = V.cN( {
      t: 'button',
      c: 'group-selection-element w-full text-left',
      h: group.title,
      k: () => handleInputType( group, 'editTitle' ),
    } );

    const selectGroupComponent = [
      V.cN( {
        c: 'group-selection-element w-full flex',
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
          selectGroupLabel,
        ],
      } ),
    ];

    const inputTitleElement = V.cN( {
      t: 'input',
      c: 'w-full',
      a: { value: group.title },
    } );

    const doneImageComponent = V.cN( {
      t: 'span',
      a: { style: 'pointer-events: none' },
      h: V.getIcon( 'done' ),
    } );

    const titleChangeButtonComponent =  V.cN( {
      c: 'hide group-title-edit-element',
      t: 'button',
      h: [doneImageComponent],
      k: ( event ) => {
        const inputElement = V.getNode( `[data-plot-group="${group.uuidE}"] .group-title-edit-element input` );
        const newValue = inputElement.value;

        if ( group.title === newValue ) {
          handleInputType( group, 'selectGroup' );
          return;
        }

        toggleChangeTitleLoading( event.target, inputElement, true );

        V.setEntity( group.fullId, {
          field: 'profile.title',
          data: newValue,
          activeProfile: group.uuidE,
        } ).then( () =>  {
          inputTitleElement.value = newValue;
          selectGroupLabel.textContent = newValue;
          toggleChangeTitleLoading( event.target, inputElement, false, doneImageComponent );
          handleInputType( group, 'selectGroup' );
        } );
      },
    } );

    const editTitleComponent = [
      V.cN( {
        c: 'w-full hide group-title-edit-element',
        h: [inputTitleElement],
      } ),
      titleChangeButtonComponent,
    ];

    const children = [
      V.cN( { c: 'plot-group-selection__item flex justify-between', h: [ ...selectGroupComponent, ...editTitleComponent ] } ),
    ];

    if ( entityInGroup ) {
      drawCheckboxGroupTotalBalanceWidget(
        group.uuidE,
        V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ),
      ).then( widget => V.setNode( `[data-plot-group=${group.uuidE}]`, widget ) );
    }

    return V.cN( { c: 'pxy', a: { 'data-plot-group': group.uuidE }, h: children } );
  }

  function drawGroupCheckboxes( groups ) {
    const entity = V.getState( 'active' ).lastViewedEntity;

    return groups.sort( sortGroupsByPlotExistence( entity ) ).map( group => {
      const plotsInGroup = V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] ) || [];
      const entityInGroup = Array.isArray( plotsInGroup ) && plotsInGroup.includes( entity.uuidE );
      return drawGroupCheckbox( group, entity, entityInGroup );
    } );
  }

  /* ============ public methods and exports ============ */

  function drawGroupWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role !== 'Plot' ) {return ''}

    const groupsOfUser = V.aE() ? V.aE().holderOf
      .filter( item => item.c === 'Group' )
      .map( item => item.a ) : [];

    const addNewGroupButton = V.cN(
      {
        t: 'button',
        y: {
          'margin-top': '0.5rem',
        },
        c: 'new-group-button w-full pxy text-left bkg-white txt-gray',
        h: V.getString( ui.newGroup ),
        k: () => {
          V.setNode( 'body', JoinRoutine.draw( V.getNavItem( '/groups', 'serviceNav' ).use ) );
        },
      },
    );

    if ( groupsOfUser.length > 0 ) {
      V.getEntity( groupsOfUser ).then( ( { data } ) => {
        const groupSelection = V.getNode( '.plot-group-selection' );

        V.setNode( '.plot-group-selection', '' );

        groupSelection.append(
          V.cN(
            {
              c: 's-calc-form-background',
              h: [...drawGroupCheckboxes( data ), addNewGroupButton],
            },
          ),
        );
      } );
    }

    const parent = V.cN( {
      c: 'plot-group-selection w-full',
      h: [
        groupsOfUser.length > 0
          ? InteractionComponents.confirmClickSpinner( { color: 'black' } )
          : V.cN(
            {
              c: 's-calc-form-background',
              h: [
                addNewGroupButton,
              ],
            },
          ),
      ],
    } );

    return CanvasComponents.card( parent, V.getString( ui.grouping ) );
  }

  function drawGroupPlotWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role !== 'Group' ) { return '' }

    const groupedEntities = V.castJson( entity.servicefields[V.castServiceField( 'groupedEntities' )] );

    if ( !groupedEntities || groupedEntities.length <= 0 ) {
      return CanvasComponents.card( V.cN( {
        c: 'pxy',
        h: V.getString( ui.noAssignedEntities ),
      } ), V.getString( ui.plots ) );
    }

    V.getEntity( groupedEntities )
      .then( result => {
        const plots = V.cN( {
          c: 'group-plots pxy',
          h: result.data
            .map( plot => V.cN( {
              t: 'p',
              c: 'pxy',
              y: {
                cursor: 'pointer',
              },
              h: plot.fullId,
              k: handleProfileDraw,
            } ) ),
        } );

        const container = V.getNode( '.group-plots__list' );
        V.setNode( container, '' );
        container.append( plots );
      } );

    const node = V.cN( {
      c: 'group-plots__list',
      h: [ InteractionComponents.confirmClickSpinner( { color: 'black' } ) ],
    } );

    return CanvasComponents.card( node, V.getString( ui.plots ) );
  }

  document.addEventListener( 'ENTITY_CREATED', ( { detail } ) => {
    const { entity: group } = detail;

    if ( group.role !== 'Group' ) {
      return;
    }

    const activeEntity = V.getState( 'active' ).lastViewedEntity;
    if ( !activeEntity || activeEntity.role !== 'Plot' ) {
      return;
    }

    const plotsInEntity = V.castJson( group.servicefields[V.castServiceField( 'groupedEntities' )] );

    const isActivePlotInGroup = !plotsInEntity || plotsInEntity.length <= 0
      ? false
      : plotsInEntity.includes( activeEntity.uuidE );

    const groupsContainer = V.getNode( '.plot-group-selection div' );

    const newGroupCheckbox = drawGroupCheckbox( group, activeEntity, isActivePlotInGroup );

    if ( groupsContainer ) {
      if ( isActivePlotInGroup ) {
        groupsContainer.insertAdjacentElement( 'afterbegin', newGroupCheckbox );
      }
      else {
        groupsContainer.insertBefore( newGroupCheckbox, V.getNode( '.new-group-button' ) );
      }
    }
  } );

  document.addEventListener( 'DATAPOINT_CHANGED', () => {
    const activeEntity = V.getState( 'active' ).lastViewedEntity;
    if ( !activeEntity || activeEntity.role !== 'Plot' ) {
      return;
    }

    const groups = document.querySelectorAll( '[data-plot-group]' );
    for ( const groupElement of groups ) {
      const groupId = groupElement.dataset.plotGroup;
      V.getEntity( groupId )
        .then( result => V.getEntity( V.castJson( result.data[0].servicefields[V.castServiceField( 'groupedEntities' )] ) ) )
        .then( result => {
          const avgBalance = SoilCalculator.getAccumulatedSequenceResults(
            result.data.map(
              plot => plot.servicefields[V.castServiceField( 'yearsAverageSequence' )]
                ? V.castJson( plot.servicefields[V.castServiceField( 'yearsAverageSequence' )] )
                : V.castJson( plot.servicefields[V.castServiceField( 'averageSequence' )] ),
            ),
          );
          groupElement.querySelector( '#s-calc-result__T_BAL_C' ).textContent = avgBalance.C.toFixed( 1 );
          groupElement.querySelector( '#s-calc-result__T_BAL_N' ).textContent = avgBalance.N.toFixed( 1 );
        } );
    }
  } );

  function drawGroupTotalBalanceWidget() {
    const entity = V.getState( 'active' ).lastViewedEntity;

    if ( entity.role != 'Group' ) { return '' }

    const groupedEntities = V.castJson( entity.servicefields[V.castServiceField( 'groupedEntities' )] );

    V.getEntity( groupedEntities )
      .then( ( { data } ) => {
        const plotAccumulatedData = SoilCalculator.getAccumulatedSequenceResults(
          data.map(
            plot => plot.servicefields[V.castServiceField( 'yearsAverageSequence' )]
              ? V.castJson( plot.servicefields[V.castServiceField( 'yearsAverageSequence' )] )
              : V.castJson( plot.servicefields[V.castServiceField( 'averageSequence' )] ),
          ),
        );

        document.querySelector( '#s-calc-result__T_BAL_N' ).textContent = plotAccumulatedData.N.toFixed( 1 );
        document.querySelector( '#s-calc-result__T_BAL_C' ).textContent = plotAccumulatedData.C.toFixed( 1 );
      } );

    return CanvasComponents.card( SoilCalculatorComponents.drawTotalBalance(), V.getString( ui.soilBalanceTitle ) );
  }

  return {
    drawGroupWidget: drawGroupWidget,
    drawGroupPlotWidget: drawGroupPlotWidget,
    drawGroupTotalBalanceWidget: drawGroupTotalBalanceWidget,
  };
} )();
