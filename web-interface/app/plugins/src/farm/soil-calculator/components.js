const SoilCalculatorComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for the soil calculator in context of the VI app
   *
   */

  'use strict';

  const settings = {
    numCropEntries: 24,
    numFertilizerGroups: 5,
    dbFieldSITE: 31,
  };

  const locale = V.getAppLocale();

  V.setStyle( {
    // 's-calc-widget': {
    //   height: '80vh',
    // },
    'tabs-wrapper': {
      padding: '0.5rem',
    },
    's-calc-form': {
      // 'border-radius': '20px',
      // 'border': '1px solid lightgray',
      // background: '#eee',

    },
    's-calc-form-background': {
      'background': '#fafbfc',
      'padding': '0.75rem',
      'margin': '0.5rem 0',
      'border': '1px solid #eceff1',
      'border-radius': '8px',
    },
    's-calc-results-show-btn': {
      'text-align': 'center',
      'text-decoration': 'underline',
      'cursor': 'pointer',
      'transform': 'rotate(0deg)',
      'transition': 'transform 0.25s ease-out',
    },
    's-calc-results-wrapper': {
      'margin-top': '0.5rem',
    },
    's-calc-results': {
      'border-radius': '5px',
      'background': 'whitesmoke',
      'margin': '0.5rem 0',
    },
    's-calc-total-balance': {
      // background: 'azure',
    },
    's-calc-form__section': {
      'padding': '0 0.5rem',
      'margin-top': '0.7rem',
    },
    's-calc-summary': {
      'padding': '0 0.5rem',
      'margin-top': '0.7rem',
    },
    's-calc-summary__data': {
      'margin-top': '0.7rem',
    },
    's-calc-summary__item': {
      'margin-bottom': '0.7rem',
      'font-size': '0.9rem',
    },
    's-calc-summary__yearly-item': {
      'justify-content': 'space-between',
      'margin': '0.7rem 0',
    },
    's-calc-summary__item-number': {
      'margin-right': '0.7rem',
      'min-width': '88px',
    },
    's-calc-results-visibility': {
      display: 'block !important',
      // visibility: 'hidden',
    },
    's-calc-input-wrapper': {
      'display': 'flex',
      'flex-wrap': 'wrap',
      'align-items': 'center',
      'gap': '0.35rem',
      'margin-bottom': '0.7rem',
    },
    // 's-calc-input-label': {
    //   width: '170px',
    // },
    's-calc-input-radio': {
      // 'border': '2px solid white',
      // 'box-shadow': '0 0 0 1px #392',
      'appearance': 'none',
      'border-radius': '50%',
      'width': '16px',
      'height': '16px',
      'background-color': '#fff',
      'transition': 'all ease-in 0.15s',
    },
    's-calc-input-radio:checked': {
      'background-color': '#bbb',
    },
    's-calc-input-number': {
      'max-width': '100%',
      'width': '5.5rem',
      'padding': '0.2rem 0.4rem',
      'font-weight': '600',
      'border-radius': '3px',
      'text-align': 'right',
      'box-sizing': 'border-box',
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': '#e2ddd3',
    },
    's-calc-input-date': {
      'padding': '0.2rem 0.4rem',
      'border-radius': '3px',
      'width': '100%',
      'max-width': '100%',
      'box-sizing': 'border-box',
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': '#e2ddd3',
    },
    's-calc-input-select': {
      'width': '100%',
      'max-width': '100%',
      'padding': '0.2rem 0.4rem',
      'border-radius': '3px',
      'text-align': 'left',
      'box-sizing': 'border-box',
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': '#e2ddd3',
    },
    's-calc-wizard-btn': {
      'flex': '1',
      'min-height': '44px',
      'padding': '0.55rem 0.85rem',
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': '#e2ddd3',
      'border-radius': '8px',
      'background-color': '#fff',
      'color': '#2d3748',
      'font-size': '0.95rem',
    },
    's-calc-wizard-btn--primary': {
      'background-color': '#2d3748',
      'border-color': '#2d3748',
      'color': '#fff',
    },
    's-calc-add-fertilizer': {
      'display': 'block',
      'width': '100%',
      'min-height': '44px',
      'margin': '0.5rem 0 0.75rem',
      'padding': '0.65rem 0.85rem',
      'border-width': '2px',
      'border-style': 'dashed',
      'border-color': '#e2ddd3',
      'border-radius': '8px',
      'background-color': '#f6f3ec',
      'color': '#2d3748',
      'font-size': '0.92rem',
      'text-align': 'center',
    },
    's-calc-input-label': {
      'flex': '1 1 8rem',
      'min-width': '0',
    },
    's-calc-form__field-group-title': {
      // height: '2rem',
      'margin-bottom': '0.7rem',
    },
    's-calc-form__section-title': {
      'margin-bottom': '0.5rem',
    },
    's-calc__crop-sequence-nav': {
      overflow: 'hidden',
      display: 'flex',
    },
    's-calc-tab-nav': {
      // background: 'azure',
      overflow: 'scroll',
      width: '67%',
    },
    's-calc-input-unit': {
      'font-size': '0.75rem',
      'font-style': 'italic',
      'margin-left': '1rem',
    },
    // 's-calc-tab-content': {
    //   // background: 'azure',
    //   'background': '#eee',
    //   'padding': '0.5rem',
    //   'border-radius': '0 0 5px 5px',
    //
    // },
    's-calc-results-table': {
      // background: 'azure',
      padding: '1.2rem',
    },
    // 's-calc-tab-content': {
    //   background: 'honeydew',
    // },
    // 's-calc-form__field-single': {
    //   padding: '0 20px',
    // },
    // 's-calc-form__field-group': {
    //   padding: '10px 20px',
    // },
    's-calc-input-radio-wrapper': {
      'display': 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'width': '100%',
      'max-width': '12rem',
    },
    's-calc-safe': {
      'margin': '10px 0 0 0',
      'padding': '5px 0',
      'background': 'gray',
      'color': 'white',
      'text-align': 'center',
      'border-radius': '50px',

    },

    // 'fertilizers .s-calc-input-wrapper:first-of-type': {
    //   'font-weight': '700',
    //   'font-family': 'IBM Plex Bold',
    // },

    'fertilizers .s-calc-input-wrapper:not(:first-of-type)': {
      'padding': '0 0 1rem 1rem',
      'margin': '0',
      'border-left': '1px solid black',
    },
    's-calc-save-status': {
      'font-size': '0.8rem',
      'color': '#666',
      'text-align': 'right',
      'padding': '0.25rem 0.5rem',
    },
    's-calc-skeleton': {
      'padding': '1rem',
      'color': '#888',
    },
    's-calc-form-error': {
      'color': '#b00020',
      'font-size': '0.8rem',
      'margin': '-0.4rem 0 0.5rem 0',
    },
    's-calc-sticky-balance': {
      'background': 'white',
    },
  } );

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      cropSequenceTitle: 'Crop Sequence',
      soilBalanceTitle: 'Soil Balance',
      siteDataTitle: 'Plot Data',
      year: 'Jahr',

      yes: 'yes',
      no: 'no',
      noCropSelected: 'None selected',
      noFertilizerSelected: 'No fertilizer',
      safeDataset: 'Save this set',
      showDetails: 'Show details',
      overview: 'Overview',
      incompleteDates: 'Date entries are currently incomplete. As a result, the total reflects the average of the crop sequence rather than the yearly average.',
      saving: 'Saving…',
      saved: 'Saved',
      unsavedChanges: 'Unsaved changes',
      balanceCarbonGain: 'Net carbon gain for this plot (sequence average).',
      balanceCarbonLoss: 'Net carbon loss for this plot (sequence average).',
      balanceNitrogenGain: 'Net nitrogen gain for this plot (sequence average).',
      balanceNitrogenLoss: 'Net nitrogen loss for this plot (sequence average).',
      balanceNeutral: 'Carbon and nitrogen balances are near neutral on average.',
      invalidDate: 'Enter a valid date (1850–2070).',
      harvestBeforeSow: 'Harvest date must be after sowing date.',
      turnBeforeHarvest: 'Soil turn date must be before harvest.',
      addSeason: 'Add season',
      newSeason: 'New season',
      editSeason: 'Edit',
      seasonEditorNewHint: 'Enter crop, fertilizer, and harvest for this season below.',
      seasonEditorHint: 'Edit this season below.',
      duplicateSeason: 'Duplicate',
      removeSeason: 'Remove',
      addFertilizerApplication: '+ Add another application',
      fertilizerType: 'Fertilizer type',
      fertilizerAmount: 'Amount',
      fertilizerDate: 'Application date',
      fertilizerApplication: 'Application {n}',
      pickFertilizerType: 'Select type below',
      fertilizerStepHint: 'Pick the fertilizer type, then enter amount and application date. Use “Add another application” if you spread more than once this season.',
      openCalculator: 'Open soil calculator',
      dataQuality: 'Season data',
      seasonsComplete: 'complete seasons',
      exportCsv: 'Export CSV',
      expertMode: 'Expert mode',
      wizardStepCrop: 'Crop',
      wizardStepFertilizer: 'Fertilizer',
      wizardStepHarvest: 'Harvest & dates',
      wizardStepReview: 'Review',
      groupIncompleteRollup: 'Some plots have incomplete season data; group totals may be understated.',
      guidedSeasonEntry: 'Guided season entry',
      wizardNext: 'Next',
      wizardBack: 'Back',
      wizardClose: 'Close',
      plotCompareTitle: 'Plot comparison',
      loadingCalculator: 'Loading soil calculator…',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  const SAVE_DEBOUNCE_MS = 1500;
  const RECALC_DEBOUNCE_MS = 300;

  const ux = {
    saveStatus: 'idle',
    isDirty: false,
    pendingWrites: {},
    saveTimer: null,
    recalcTimer: null,
    selectedSeason: 1,
    fertilizerSlotsVisible: {},
    wizardOpen: false,
    wizardStep: 0,
    formError: '',
    widgetDataCache: null,
  };

  function useTimeline() {
    return V.getSetting( 'soilCalcTimeline' ) !== false;
  }

  function useExpertMode() {
    return V.getSetting( 'soilCalcExpertMode' ) === true
      || V.getLocal( 'soil-calc-expert' ) === '1';
  }

  function setSaveStatus( status ) {
    ux.saveStatus = status;
    const node = V.getNode( '.s-calc-save-status' );
    if ( !node ) { return }
    node.className = 's-calc-save-status';
    if ( status === 'saving' ) {
      node.classList.add( 's-calc-save-status--busy' );
      node.textContent = V.getString( ui.saving );
    }
    else if ( status === 'saved' ) {
      node.classList.add( 's-calc-save-status--saved' );
      node.textContent = V.getString( ui.saved );
      ux.isDirty = false;
    }
    else if ( status === 'dirty' ) {
      node.classList.add( 's-calc-save-status--busy' );
      node.textContent = V.getString( ui.unsavedChanges );
    }
    else {
      node.textContent = '';
    }
  }

  function balanceSignClass( value ) {
    const n = value != null ? Number( value ) : 0;
    if ( Math.abs( n ) <= 0.05 ) { return 's-calc-meter--neutral' }
    return n > 0 ? 's-calc-meter--gain' : 's-calc-meter--loss';
  }

  function balanceMeter( label, value, id, unitHtml ) {
    const num = value != null ? Number( value ) : 0;
    return V.cN( {
      c: 's-calc-meter ' + balanceSignClass( num ),
      h: [
        V.cN( { c: 's-calc-meter__label', h: label } ),
        V.cN( {
          t: 'span',
          c: 's-calc-meter__value s-calc-result',
          i: id,
          h: num.toFixed( 1 ),
        } ),
        unitHtml ? V.cN( {
          c: 's-calc-meter__unit',
          innerHtml: unitHtml,
        } ) : '',
      ],
    } );
  }

  function formatHarvestYear( hvst ) {
    if ( hvst == null || hvst === '' || hvst === -1 ) { return '' }
    const s = String( hvst );
    if ( s.length < 4 || s.charAt( 0 ) === '-' ) { return '' }
    const y = s.substr( 0, 4 );
    return /^\d{4}$/.test( y ) ? y : '';
  }

  function getSeasonMeta( tabNum, data ) {
    const raw = data[ 's' + tabNum ];
    const dpWrap = typeof raw === 'string' ? V.castJson( raw ) : raw;
    const datapoint = dpWrap && dpWrap.datapoint ? dpWrap.datapoint : dpWrap;
    const year = datapoint && datapoint.DATE
      ? formatHarvestYear( datapoint.DATE.HVST )
      : '';
    const crop = isSeasonActive( datapoint )
      ? SoilCalculator.getCropName( datapoint.CROP.ID, locale )
      : V.getString( ui.newSeason );
    return { year, crop };
  }

  function seasonEditorHeader( tabNum, data ) {
    const raw = data[ 's' + tabNum ];
    const dpWrap = typeof raw === 'string' ? V.castJson( raw ) : raw;
    const datapoint = dpWrap && dpWrap.datapoint ? dpWrap.datapoint : dpWrap;
    const title = getTabLabel( tabNum, data );
    const isNew = !isSeasonActive( datapoint );

    return V.cN( {
      c: 's-calc-season-editor__head',
      h: [
        V.cN( { c: 's-calc-season-editor__title', h: title } ),
        V.cN( {
          c: 's-calc-season-editor__subtitle',
          h: isNew
            ? V.getString( ui.seasonEditorNewHint )
            : V.getString( ui.seasonEditorHint ),
        } ),
      ],
    } );
  }

  function balanceChipClass( value ) {
    const n = value != null ? Number( value ) : 0;
    if ( Math.abs( n ) <= 0.05 ) { return '' }
    return n > 0 ? ' s-calc-chip--gain' : ' s-calc-chip--loss';
  }

  function getSeasonBalanceChips( tabNum ) {
    const slot = V.getState( 'cropSequence' )[ 's' + tabNum ];
    if ( !slot || !slot.results || !slot.results.SOM || !slot.results.SOM.BAL ) {
      return '';
    }
    const c = slot.results.SOM.BAL.C;
    const n = slot.results.SOM.BAL.N;
    return V.cN( {
      c: 's-calc-balance-chips',
      h: [
        V.cN( {
          c: 's-calc-chip' + balanceChipClass( c ),
          h: 'C ' + ( c != null ? Number( c ).toFixed( 1 ) : '–' ),
        } ),
        V.cN( {
          c: 's-calc-chip' + balanceChipClass( n ),
          h: 'N ' + ( n != null ? Number( n ).toFixed( 1 ) : '–' ),
        } ),
      ],
    } );
  }

  function refreshBalanceMeterClasses() {
    [
      { id: 's-calc-result__T_BAL_C', el: 'C' },
      { id: 's-calc-result__T_BAL_N', el: 'N' },
    ].forEach( ( { id } ) => {
      const valueNode = document.getElementById( id );
      const meter = valueNode && valueNode.closest( '.s-calc-meter' );
      if ( !meter ) { return }
      const parsed = parseFloat( valueNode.textContent );
      meter.className = 's-calc-meter ' + balanceSignClass( isNaN( parsed ) ? 0 : parsed );
    } );
  }

  function refreshSeasonBalanceChips() {
    if ( !useTimeline() ) { return }
    V.getNodes( '.s-calc-season-row' ).forEach( row => {
      const slot = row.getAttribute( 'data-season-slot' );
      const existing = row.querySelector( '.s-calc-balance-chips' );
      const fresh = getSeasonBalanceChips( slot );
      if ( existing && fresh ) {
        existing.replaceWith( fresh );
      }
      else if ( existing && !fresh ) {
        existing.remove();
      }
      else if ( !existing && fresh ) {
        const main = row.querySelector( '.s-calc-season-row__main' );
        if ( main ) { main.appendChild( fresh ) }
      }
    } );
  }

  function wizardStepDots() {
    return V.cN( {
      c: 's-calc-wizard-steps',
      h: [0, 1, 2, 3].map( step => V.cN( {
        c: 's-calc-wizard-step'
          + ( step === ux.wizardStep ? ' s-calc-wizard-step--active' : '' )
          + ( step < ux.wizardStep ? ' s-calc-wizard-step--done' : '' ),
      } ) ),
    } );
  }

  function markDirty() {
    ux.isDirty = true;
    setSaveStatus( 'dirty' );
  }

  function queuePersist( subField, data, immediate ) {
    ux.pendingWrites[subField] = data;
    markDirty();
    if ( ux.saveTimer ) { clearTimeout( ux.saveTimer ); }
    const flush = () => {
      const writes = { ...ux.pendingWrites };
      ux.pendingWrites = {};
      setSaveStatus( 'saving' );
      const keys = Object.keys( writes );
      let chain = Promise.resolve();
      keys.forEach( subField => {
        chain = chain.then( () => persistToEntity( subField, writes[subField] ) );
      } );
      chain.then( () => setSaveStatus( 'saved' ) );
    };
    if ( immediate ) {
      flush();
    }
    else {
      ux.saveTimer = setTimeout( flush, SAVE_DEBOUNCE_MS );
    }
  }

  function persistToEntity( subField, data ) {
    const jsonStr = V.castJson( data );
    return V.setEntity( V.getState( 'active' ).lastViewed, {
      field: 'servicefields.' + subField,
      data: jsonStr,
    } ).then( () =>
      document.dispatchEvent( new CustomEvent( 'DATAPOINT_CHANGED', { detail: data } ) ) );
  }

  function scheduleRecalc( e ) {
    if ( ux.recalcTimer ) { clearTimeout( ux.recalcTimer ); }
    ux.recalcTimer = setTimeout( () => runRecalc( e ), RECALC_DEBOUNCE_MS );
  }

  /* ===================== handlers ==================== */

  function handleDatapointChange( e ) {
    if ( e ) {
      scheduleRecalc( e );
      return;
    }
    runRecalc( e );
  }

  async function runRecalc( e ) {
    let run = { run: true };

    if ( e ) {
      run = getDatapoint( e );
      if ( run.run && run.validationMessage ) {
        showFormError( run.validationMessage );
      }
      else {
        showFormError( '' );
      }
    }

    if ( !e ) {
      toggleFTLZGroups();
      toggleNumCuts();
    }

    toggleFTLZUnit();
    refreshFertilizerSlotHeader( e );

    if ( !run.run ) { return }

    setStateDatapoint();

    await setStateDatapointResults();
    await setStateYearlyResults();
    await setStateAndDbSequenceAverageResult();
    await setStateAndDbYearsAverageResult();

    drawResetResults();
    drawDatapointResults();
    drawTotalResult();
    refreshBalanceMeterClasses();
    refreshBalanceInterpretation();
    drawSummary();
    drawSeasonListHighlight();
    drawResultsBullets();

    if ( e && run.newDatapoint === -10 ) {
      resetDatapointInDb( run.subFieldNum );
    }
    else if ( e ) {
      if ( run.subFieldNum != settings.dbFieldSITE ) {
        const slot = V.getState( 'cropSequence' )[ 's' + run.subFieldNum ];
        if ( slot && slot.results ) {
          Object.assign( run.newDatapoint.PCIPAPI, slot.results.PCIPAPI );
          Object.assign( run.newDatapoint, { SOM: { BAL: {} } } );
          Object.assign( run.newDatapoint.SOM.BAL, slot.results.SOM.BAL );
        }
      }
      queuePersist( 's' + run.subFieldNum, run.newDatapoint );
    }

  }

  function showFormError( message ) {
    ux.formError = message || '';
    const node = V.getNode( '.s-calc-form-error' );
    if ( node ) {
      node.textContent = message || '';
      node.style.display = message ? 'block' : 'none';
    }
  }

  function handleRadioButton( e ) {
    drawRadioBtnChange( e );
    handleDatapointChange( e );
  }

  function handleShowDetails() {
    V.getNodes( '.s-calc-results-wrapper' ).forEach( $elem => {
      $elem.classList.toggle( 's-calc-results-visibility' );
    } );

    V.getNodes( '.s-calc-results-show-btn' ).forEach( $elem => {
      $elem.classList.contains( 'rotate' )
        ? $elem.classList.remove( 'rotate' ) // reset animation
        : $elem.classList.add( 'rotate' ); // start animation
    } );

  }

  function handleNavScroll() {
    // Thanks ChatGPT
    const tabContainer = document.querySelector( '.s-calc-tab-nav' );
    const scrollAmount = this === 'left' ? -tabContainer.offsetWidth : tabContainer.offsetWidth;
    tabContainer.scrollBy( { left: scrollAmount, behavior: 'smooth' } );
  }

  /* ================== private methods ================= */

  function drawRadioBtnChange( e ) {
    const formName = e.target.closest( 'form' ).getAttribute( 'name' );

    /* Set side product to not harvested if main product is not harvested */
    if (
      e.target.id == 's-calc-input-BMASS_MP_HVST_N_' + formName
    ) {
      V.getNode( '#s-calc-input-BMASS_SP_HVST_N_' + formName ).checked = true;
    }
  }

  function normalizeDatapointIds( datapoint ) {
    if ( !datapoint || typeof datapoint !== 'object' ) { return datapoint }

    if ( datapoint.CROP && ( datapoint.CROP.ID == null || datapoint.CROP.ID === -1 ) ) {
      datapoint.CROP.ID = 1000;
    }

    if ( datapoint.FTLZ ) {
      for ( let i = 1; i <= settings.numFertilizerGroups; ++i ) {
        const slot = datapoint.FTLZ[ 'F' + i ];
        if ( slot && ( slot.ID == null || slot.ID === -1 ) ) {
          slot.ID = 5000;
        }
      }
    }

    return datapoint;
  }

  function parseServicefieldDatapoint( raw ) {
    if ( !raw ) { return null }
    const parsed = typeof raw === 'string' ? V.castJson( raw ) : raw;
    if ( !parsed ) { return null }
    const datapoint = parsed.datapoint ? parsed.datapoint : parsed;
    return normalizeDatapointIds( datapoint );
  }

  /** Site slot is stored flat ({ SITE: … }); crop slots use { datapoint: … }. */
  function getSiteSliceFromState() {
    const siteSlot = V.getState( 'cropSequence' )[ 's' + settings.dbFieldSITE ];
    if ( !siteSlot ) { return null }
    if ( siteSlot.SITE ) { return siteSlot }
    if ( siteSlot.datapoint && siteSlot.datapoint.SITE ) { return siteSlot.datapoint }
    return siteSlot.datapoint || siteSlot;
  }

  function hydrateCropSequenceFromData( data ) {
    if ( !data ) { return }

    V.setState( 'cropSequence', 'clear' );

    const siteDp = parseServicefieldDatapoint( data[ 's' + settings.dbFieldSITE ] );
    if ( siteDp ) {
      V.setState( 'cropSequence', {
        [ 's' + settings.dbFieldSITE ]: siteDp,
      } );
    }

    for ( let i = 1; i <= settings.numCropEntries; i++ ) {
      const datapoint = parseServicefieldDatapoint( data[ 's' + i ] );
      if ( !datapoint ) { continue }
      V.setState( 'cropSequence', {
        [ 's' + i ]: { datapoint: datapoint },
      } );
    }

    const avgKey = 's' + V.castServiceField( 'averageSequence' );
    const yearsKey = 's' + V.castServiceField( 'yearsAverageSequence' );
    const avgRaw = parseServicefieldDatapoint( data[avgKey] );
    const yearsRaw = parseServicefieldDatapoint( data[yearsKey] );

    if ( yearsRaw && yearsRaw.T ) {
      V.setState( 'cropSequenceYearsAverageResult', { T: yearsRaw.T } );
    }
    else if ( avgRaw && avgRaw.T ) {
      V.setState( 'cropSequenceAverageResult', { T: avgRaw.T } );
    }
  }

  function setStateDatapoint() {
    if ( document.forms.SITE ) {
      const siteData = getFormData( 'SITE' );
      if ( typeof siteData === 'object' && siteData !== null && siteData.SITE ) {
        V.setState( 'cropSequence', {
          [ 's' + settings.dbFieldSITE ]: siteData,
        } );
      }
    }

    for ( let i = 1; i <= settings.numCropEntries; i++ ) {
      const form = document.forms[ 'CROP-' + i ];
      if ( !form ) { continue }

      const cropData = getFormData( 'CROP-' + i );
      V.setState( 'cropSequence', {
        [ 's' + i ]: { datapoint: cropData },
      } );
    }
  }

  async function setStateDatapointResults() {
    const siteSlice = getSiteSliceFromState();
    for ( let i = 1; i <= settings.numCropEntries; i++ ) {
      const cropData = V.getState( 'cropSequence' )[ 's' + i ];
      if (
        !cropData
        || !cropData.datapoint
        || typeof cropData.datapoint === 'number'
      ) {
        continue;
      }

      const prevCropData = getFirstPrevious( i );

      if ( siteSlice ) {
        Object.assign( cropData.datapoint, siteSlice ); // merge SITE into the datapoint
      }

      /**
       * Note that at this stage the cropData includes
       * new inputs from the user (in the datapoint key),
       * but previous inputs and results
       */

      await SoilCalculator
        .getDatapointResults( cropData, prevCropData )
        .then( res => {
          Object.assign( V.getState( 'cropSequence' )[ 's' + i ], { inputs: res.inputs, results: res.results } );
        } );

    }

    return {
      success: true,
    };
  }

  async function setStateYearlyResults() {
    const sequence = V.getState( 'cropSequence' );

    let sequencesByYear = {};

    // write sequences by year into sequencesByYear object
    for ( const key in sequence ) {

      if (
        ['undefined', 'number'].includes( typeof sequence[key].datapoint )
      ) {
        continue;
      }

      if (
        !sequence[key].datapoint.DATE.HVST
      ) {

        /** reset the object to no content and break out of the loop,
        if user did not fill out all dates, which causes the UI to display
         the sequence average instead of the yearly average */

        sequencesByYear = {};
        break;
      }

      const year = sequence[key].datapoint.DATE.HVST.substr( 0, 4 );

      if ( !sequencesByYear[year] ) { sequencesByYear[year] = {} }

      sequencesByYear[year][key] = sequence[key];

    }

    // reset and calculate result for each year
    V.setState( 'cropSequenceResultsByYear', 'clear' );

    for ( const year in sequencesByYear ) {
      SoilCalculator
        .getSequenceResults( sequencesByYear[year], locale )
        .then( res => {
          const obj = {};
          obj[year] = res;
          V.setState( 'cropSequenceResultsByYear', obj );
        } );
    }

    // create a placeholder, if user did not fill out all dates
    if ( !Object.keys( sequencesByYear ).length ) {
      V.setState( 'cropSequenceResultsByYear', 'clear' );
      const now = new Date();
      const obj = {};
      obj[now.getFullYear()] = { T: SoilCalculator.getSchema( 'results' ).T };
      V.setState( 'cropSequenceResultsByYear', obj );
    }

    return {
      success: true,
    };
  }

  async function setStateAndDbSequenceAverageResult() {
    SoilCalculator
      .getSequenceResults( V.getState( 'cropSequence' ), locale )
      .then( res => {
        if ( !res || !res.T || res.T.BAL.C === null ) {
          V.setState( 'cropSequenceAverageResult', 'clear' );
          return;
        }
        V.setState( 'cropSequenceAverageResult', { T: res.T } );

        // const activeEntity = V.getState( 'active' ).lastViewedEntity;
        // V.setEntity( activeEntity.fullId, {
        //   field: `servicefields.${V.castServiceField( 'averageSequence' )}`,
        //   data: V.castJson( res.T ),
        // } );

        queuePersist( V.castServiceField( 'averageSequence' ), res.T );
      } );
  }

  async function setStateAndDbYearsAverageResult() {
    SoilCalculator
      .getYearsAverageResults( V.getState( 'cropSequenceResultsByYear' ), locale )
      .then( res => {
        if ( !res || !res.T || res.T.BAL.C === null ) {
          V.setState( 'cropSequenceYearsAverageResult', 'clear' );
          return;
        }
        V.setState( 'cropSequenceYearsAverageResult', { T: res.T } );

        // const activeEntity = V.getState( 'active' ).lastViewedEntity;
        // V.setEntity( activeEntity.fullId, {
        //   field: `servicefields.${V.castServiceField( 'yearsAverageSequence' )}`,
        //   data: V.castJson( res.T ),
        // } );

        queuePersist( V.castServiceField( 'yearsAverageSequence' ), res.T );

      } );
  }

  function getFirstPrevious( i ) {
    for ( let j = 1; j <= settings.numCropEntries - 1; j++ ) {
      if ( i - j < 1 ) { return null }
      // console.log( i-j );
      const cropData = V.getState( 'cropSequence' )[ 's' + ( i - j ) ].datapoint;
      if ( typeof cropData != 'number'  ) {
        return cropData;
      }
    }
    return null;
  }

  function drawResetResults() {
    V.getNodes( '.s-calc-result' ).forEach( $elem => {
      $elem.innerText = '';
    } );
  }

  function drawDatapointResults() {
    const sequence = V.getState( 'cropSequence' );

    if ( useTimeline() ) {
      drawSeasonListHighlight();
      drawResultsBullets();
      refreshSeasonBalanceChips();
      const slot = ux.selectedSeason;
      const entry = sequence[ 's' + slot ];
      if ( entry && entry.results && typeof entry.datapoint !== 'number' ) {
        drawResults( entry.results, slot );
      }
      return;
    }

    for ( const key in sequence ) {

      const tabNum = key.replace( 's', '' );

      if (
        ['undefined', 'number'].includes( typeof sequence[key].datapoint )
      ) {

        /* remove highlight from tab number */
        if ( tabNum <= settings.numCropEntries ) {
          const $tabLabel = V.getNode( 'label[for="tab' + tabNum + '"]' );
          if ( $tabLabel ) { $tabLabel.classList.remove( 'font-bold' ) }
        }

        continue;
      }

      /* add highlight to tab number */
      const $tabLabelActive = V.getNode( 'label[for="tab' + tabNum + '"]' );
      if ( $tabLabelActive ) { $tabLabelActive.classList.add( 'font-bold' ) }

      drawResults( sequence[key].results, tabNum );
    }
  }

  function refreshBalanceInterpretation() {
    const node = V.getNode( '.s-calc-balance-interpretation' );
    if ( node ) {
      node.textContent = balanceInterpretationLine();
    }
  }

  function drawTotalResult() {
    const totalsToDisplay = V.getState( 'cropSequenceYearsAverageResult' )
    || V.getState( 'cropSequenceAverageResult' );

    drawResults( totalsToDisplay );
  }

  function drawSummary() {
    const years = V.getState( 'cropSequenceResultsByYear' );
    const sequence = deleteFields( V.castClone( V.getState( 'cropSequence' ) ) );

    V.setNode( '.s-calc-summary__yearly', 'clear' );
    V.setNode( '.s-calc-summary__data', 'clear' );
    V.getNode( '.s-calc-summary' ).append( summaryTableYearly( years ) );
    V.getNode( '.s-calc-summary' ).append( summaryTable( sequence ) );
  }

  function toggleFTLZUnit() {
    const mineralFertilizers = ['5005'];

    for ( let cropIdx = 1; cropIdx <= settings.numCropEntries; ++cropIdx ) {
      if ( !document.forms[ 'CROP-' + cropIdx ] ) { continue }

      for ( let fertilizerGroupIdx = 1; fertilizerGroupIdx <= settings.numFertilizerGroups; ++fertilizerGroupIdx ) {
        const fertilizerSelectElement = V.getNode( `form[name="CROP-${cropIdx}"] .FTLZ_F${fertilizerGroupIdx} #s-calc-input__FTLZ_F${fertilizerGroupIdx}_ID` );
        if (
          !fertilizerSelectElement
          || !fertilizerSelectElement.selectedOptions
          || !fertilizerSelectElement.selectedOptions.length
        ) {
          continue;
        }

        const selectedFertilizerValue = fertilizerSelectElement.selectedOptions[0].value;

        const unitElement = V.getNode( `form[name="CROP-${cropIdx}"] .FTLZ_F${fertilizerGroupIdx} .s-calc-input-unit:not(:empty)` );
        if ( !unitElement ) { continue }

        if ( mineralFertilizers.includes( selectedFertilizerValue ) ) {
          unitElement.textContent = SoilCalculator.getFieldString( `FTLZ_F${fertilizerGroupIdx}_QTY`, locale, 'mineralUnit' );
        }
        else {
          unitElement.textContent = SoilCalculator.getFieldString( `FTLZ_F${fertilizerGroupIdx}_QTY`, locale, 'unit' );
        }
      }
    }
  }

  function toggleFTLZGroups( formName ) {

    // If formName is not provided, loop through all forms
    if ( !formName ) {
      for ( let i = 0; i < document.forms.length; i++ ) {
        const name = document.forms[i].name;
        if ( name ) { toggleFTLZGroups( name ) }
      }
      return; // Exit function after looping through all forms
    }

    if ( 'SITE' == formName ) { return }

    const form = document.forms[formName];
    if ( !form ) { return }

    const _ = form.elements;
    for ( let i = 1; i <= settings.numFertilizerGroups; ++i ) {
      const nxtFTLZ = i+1;
      const groupElemToToggle = form.querySelector( `.FTLZ_F${nxtFTLZ}` );

      if (
        nxtFTLZ > settings.numFertilizerGroups
        || !groupElemToToggle
        || !_[`FTLZ_F${i}_ID`]
        || !_[`FTLZ_F${nxtFTLZ}_ID`]
      ) {
        return
      }

      if (
        _[`FTLZ_F${i}_ID`].value  !== '5000'
        && !!_[`FTLZ_F${i}_QTY`].value
        || _[`FTLZ_F${nxtFTLZ}_ID`].value  !== '5000'
          && !!_[`FTLZ_F${nxtFTLZ}_QTY`].value
      ) {
        groupElemToToggle.classList.remove( 'hidden' ); // Ensure element is visible
      }
      else if (
        _[`FTLZ_F${i}_ID`].value === '5000'
      ) {
        groupElemToToggle.classList.add( 'hidden' ); // Hide element
      }
    }
  }

  function toggleNumCuts( formName ) {

    const crops = [1270, 1280]; // the crops for which cuts shall be displayed otherwise hide and set to 1

    // If formName is not provided, loop through all forms
    if ( !formName ) {
      for ( let i = 0; i < document.forms.length; i++ ) {
        const name = document.forms[i].name;
        if ( name ) { toggleNumCuts( name ) }
      }
      return; // Exit function after looping through all forms
    }

    if ( 'SITE' == formName ) { return }

    const form = document.forms[formName];
    if ( !form || !form.elements.CROP_ID ) { return }

    const _ = form.elements;
    const cutsInput = form.querySelector( '#s-calc-input__DATE_CUTS' );
    if ( !cutsInput || !cutsInput.closest ) { return }
    const elemToToggle = cutsInput.closest( '.s-calc-form__field-single' );
    if ( !elemToToggle ) { return }

    if ( crops.includes( Number( _.CROP_ID.value ) ) ) {
      elemToToggle.classList.remove( 'hidden' ); // Ensure element is visible
    }
    else {
      _.DATE_CUTS.value = '1';
      elemToToggle.classList.add( 'hidden' ); // Hide element
    }
  }

  function getDatapoint( e ) {

    const formName = e.target.closest( 'form' ).getAttribute( 'name' );

    const subFieldNum = formName === 'SITE'
      ? settings.dbFieldSITE
      : formName.replace( 'CROP-', '' );

    const newDatapoint = getFormData( formName );

    const returnObj = {
      run: true,
      newDatapoint: newDatapoint,
      subFieldNum: subFieldNum,
    };

    document.activeElement.classList.remove( 'txt-red' );

    if ( e.target.name.includes( 'FTLZ' ) ) {
      toggleFTLZGroups( formName );
    }
    if ( 'CROP_ID' == e.target.name ) {
      toggleNumCuts( formName );
    }

    if (
      newDatapoint === -30
    ) {

      document.activeElement.classList.add( 'red-background', 'txt-red' );

      setTimeout( () => {
        document.activeElement.classList.remove( 'red-background' );
      }, 400 );

      returnObj.run = false;
      returnObj.validationMessage = ux.formError || V.getString( ui.invalidDate );

    }

    if (
      newDatapoint === -20
    ) {
      returnObj.run = false;
    }

    return returnObj;

  }

  function resetDatapointInDb( subFieldNum ) {
    V.setEntity( V.getState( 'active' ).lastViewed, {
      field: 'servicefields.s' + subFieldNum,
      data: null,
    } );
  }

  function setDatabase( subField, data ) {
    queuePersist( subField, data );
  }

  function getFormData( formName ) {
    const form = document.forms[formName];
    if ( !form ) { return -20 }

    const _ = form.elements;

    const validation = validateFormData( _, formName );

    if ( validation < 1 ) { return validation }

    const __ = V.castClone( SoilCalculator.getSchema( 'request' ) );

    if ( formName === 'SITE' ) {
      delete __.CROP;
      delete __.FTLZ;
      delete __.BMASS;
      delete __.DATE;
      delete __.PCIPAPI;
      __.SITE.CN = Number( _.SITE_CN.value );
      // __.SITE.FCAP = Number( _.SITE_FCAP.value );
      __.SITE.STYP.ID = Number( _.SITE_STYP_ID.value );
      __.SITE.PCIP.QTY = Number( _.SITE_PCIP_QTY.value );
      __.SITE.PCIP.MUL = Number( _.SITE_PCIP_MUL.value );
      __.SITE.N.DEP = Number( _.SITE_N_DEP.value );
    }
    else {
      delete __.SITE;

      __.CROP.ID = Number( _.CROP_ID.value );

      for ( let i = 1; i <= settings.numFertilizerGroups; ++i ) {
        __.FTLZ[`F${i}`].ID = Number( _[`FTLZ_F${i}_ID`] ? _[`FTLZ_F${i}_ID`].value : '' );

        /* enforce quantity and date reset, if no fertilizer is selected */
        if ( _[`FTLZ_F${i}_ID`].value == '5000' ) {
          _[`FTLZ_F${i}_QTY`].value = ''
          _[`FTLZ_F${i}_DATE`].value = ''
        }

        __.FTLZ[`F${i}`].QTY = Number( _[`FTLZ_F${i}_QTY`] ? _[`FTLZ_F${i}_QTY`].value : '' );
        __.FTLZ[`F${i}`].DATE = _[`FTLZ_F${i}_DATE`] ? _[`FTLZ_F${i}_DATE`].value : '';
      }

      __.BMASS.MP.QTY = Number( _.BMASS_MP_QTY.value );
      __.BMASS.MP.HVST = ( _.BMASS_MP_HVST.value === 'true' );

      __.BMASS.SP.QTY = Number( _.BMASS_SP_QTY.value );
      __.BMASS.SP.HVST = ( _.BMASS_SP_HVST.value === 'true' );

      __.DATE.SOWN = _.DATE_SOWN.value;
      __.DATE.HVST = _.DATE_HVST.value;
      __.DATE.TURN = _.DATE_TURN.value;
      __.DATE.CUTS = _.DATE_CUTS.value;

      __.PCIPAPI.MM = _.PCIPAPI_MM.value || -1;
      __.PCIPAPI.STATION.ID = _.PCIPAPI_STATION_ID.value || -1;
      __.PCIPAPI.STATION.NAME = _.PCIPAPI_STATION_NAME.value;
      __.PCIPAPI.STATION.LAT = _.PCIPAPI_STATION_LAT.value || -1;
      __.PCIPAPI.STATION.LON = _.PCIPAPI_STATION_LON.value || -1;
      __.PCIPAPI.DATE.FIRST = _.PCIPAPI_DATE_FIRST.value;
      __.PCIPAPI.DATE.LAST = _.PCIPAPI_DATE_LAST.value;
    }

    // console.log( 'New Dataset: ', __ );

    /* return the new dataset */

    return __;

  }

  function validateFormData( _, formName ) {

    const isValidDate = ( dateString ) => {
      // Parse the input string to create a Date object

      if ( dateString === '' ) {
        return true;
      }

      const enteredDate = new Date( dateString );

      // Check if the enteredDate is a valid date and not NaN
      if ( isNaN( enteredDate.getTime() ) ) {
        return false;
      }

      // Check if the year is witin accepted range
      const year = enteredDate.getFullYear();
      return year >= 1850 && year <= 2070;
    };

    const hasEntry = ( formName ) => {
      const formNumber = Number( formName.replace( 'CROP-', '' ) );
      const entry = V.getState( 'cropSequence' )[ 's' + formNumber ];
      return entry ? typeof entry.datapoint != 'number' : undefined;
    };

    if ( formName === 'SITE' ) { return 1 } // TODO

    if(
      _.DATE_SOWN
      && !isValidDate( _.DATE_SOWN.value )
    ) {
      return -30;
    }

    if(
      _.DATE_HVST
      && !isValidDate( _.DATE_HVST.value )
    ) {
      return -30;
    }

    if(
      _.DATE_TURN
      && !isValidDate( _.DATE_TURN.value )
    ) {
      return -30;
    }

    if(
      _.DATE_SOWN && _.DATE_HVST
      && new Date( _.DATE_SOWN.value ) >= new Date( _.DATE_HVST.value )
    ) {
      ux.formError = V.getString( ui.harvestBeforeSow );
      return -30;
    }

    if(
      _.DATE_TURN && _.DATE_HVST
      && new Date( _.DATE_TURN.value ) >= new Date( _.DATE_HVST.value )
    ) {
      ux.formError = V.getString( ui.turnBeforeHarvest );
      return -30;
    }

    for ( let i = 1; i <= settings.numFertilizerGroups; ++i ) {
      const isValid = isValidDate( _[`FTLZ_F${i}_DATE`] ? _[`FTLZ_F${i}_DATE`].value : '' );
      if ( !isValid ) {
        return -30;
      }
    }

    if(
      hasEntry( formName )
      && _.CROP_ID.value == 1000
      && !_.BMASS_MP_QTY.value
    ) {
      return -10; // resets entry
    }

    if(
      _.CROP_ID.value == 1000
      || !_.BMASS_MP_QTY.value
    ) {
      return -20;
    }

    return 1;

  }

  function drawResults( res, tabNum ) {

    /* set results into ui-fields, by querying the ids, e.g. "s-calc-result__tab-1__SOM_LOSS" */
    const prefix = '#s-calc-result' + ( tabNum ? '__tab-' + tabNum : '' ) + '__';

    for ( const section in res ) {
      for ( const field in res[section] ) {
        if ( typeof res[section][field] == 'object' ) {
          for ( const subField in res[section][field] ) {
            const fieldString = section + '_' + field + '_' + subField;
            let value = res[section][field][subField];
            if ( !value ) { continue }
            if ( typeof value === 'number' ) { value = value.toFixed( 1 ) }
            if ( value == -1 ) { value = '' }
            V.setNode( prefix + fieldString, value );
          }
        }
        else {
          const fieldString = section + '_' + field;
          let value = res[section][field];
          if ( !value ) { continue }
          if ( typeof value === 'number' ) { value = value.toFixed( 1 ) }
          if ( value == -1 ) { value = '' }
          V.setNode( prefix + fieldString, value );
        }
      }
    }

    castNewUnitStringOnTotals();

  }

  function castNewUnitStringOnTotals() {

    const tUnit = document.getElementById( 's-calc-result__T_UNIT' );

    if ( !tUnit ) { return }

    if( tUnit.innerHTML.includes( 'WARN' ) ) {
      setTimeout( function delayedWarnAppend() {
        tUnit.append( V.cN( {
          t: 'span',
          y: {
            'margin-left': '0.2rem',
            'cursor': 'pointer',
            'position': 'relative',
            'top': '2px',
          },
          k: function handleIncompleteDateWarning() {
            Modal.draw( 'validation error', V.getString( ui.incompleteDates ) );
          },
          h: V.getIcon( 'warn_mark', '16px' ),
        } ) );
      }, 50 );
    }

    tUnit.innerHTML = tUnit.innerHTML.replace( /-1/g, '<sup>-1</sup>' ).replace( 'WARN', '' );

  }

  function castFlatFieldTitle( section, field, subField ) {
    return section + '_' + field + ( subField ? '_' + subField : '' );
  }

  function mapFields( array, tabNum ) {
    return array.map( function( row ) { return rowObj( row, this.tabNum ) }, { tabNum: tabNum } );
  }

  function simpleSeparator( x ) {
    return x.toString().replace( /\B(?=(\d{3})+(?!\d))/g, '.' );
  }

  function deleteFields( data ) {
    delete data.s25;
    delete data.s26;
    delete data.s27;
    delete data.s28;
    delete data.s29;
    delete data.s30;
    delete data.s31;
    return data;
  }

  /* ================== components ================= */

  function help( text, leftCorrect ) {
    return {
      t: 'span',
      y: {
        'margin-left': '0.28rem',
        'cursor': 'pointer',
        'position': 'relative',
        'top': '2px',
        'left': leftCorrect ? '-7px' : '0px',
      },
      k: function handleHelpModal() {
        Modal.draw( 'help', text );
      },
      h: V.getIcon( 'help', '15px' ),
    };
  }

  function fertilizerFieldLabel( fieldTitle ) {
    if ( /^FTLZ_F\d+_ID$/.test( fieldTitle ) ) {
      return V.getString( ui.fertilizerType );
    }
    if ( /^FTLZ_F\d+_QTY$/.test( fieldTitle ) ) {
      return V.getString( ui.fertilizerAmount );
    }
    if ( /^FTLZ_F\d+_DATE$/.test( fieldTitle ) ) {
      return V.getString( ui.fertilizerDate );
    }
    return SoilCalculator.getFieldString( fieldTitle, locale );
  }

  function fertilizerSlotHeader( section, field, slotData ) {
    const slotNum = field.replace( 'F', '' );
    const rawFertId = slotData && slotData.ID != null ? slotData.ID : 5000;
    const fertId = rawFertId === -1 ? 5000 : rawFertId;
    const fertName = SoilCalculator.getFertilizerName( fertId, locale );
    const picked = Number( fertId ) !== 5000 && Number( fertId ) !== 1000;

    return V.cN( {
      c: 's-calc-fertilizer-slot__head',
      h: [
        V.cN( { c: 's-calc-fertilizer-slot__num', h: slotNum } ),
        V.cN( {
          c: 's-calc-fertilizer-slot__label',
          h: [
            V.cN( {
              t: 'strong',
              h: V.getString( ui.fertilizerApplication ).replace( '{n}', slotNum ),
            } ),
            V.cN( {
              c: 's-calc-fertilizer-slot__picked'
                + ( picked ? '' : ' s-calc-fertilizer-slot__picked--empty' ),
              h: picked ? fertName : V.getString( ui.pickFertilizerType ),
            } ),
          ],
        } ),
      ],
    } );
  }

  function shouldShowAllFertilizerSlots( tabNum, datapoint ) {
    return useExpertMode()
      || ux.fertilizerSlotsVisible[tabNum]
      || countFertilizerSlotsInUse( datapoint ) > 1;
  }

  function addFertilizerButton( tabNum, data, remountWizard ) {
    return V.cN( {
      t: 'button',
      c: 's-calc-add-fertilizer',
      h: V.getString( ui.addFertilizerApplication ),
      k: () => {
        ux.fertilizerSlotsVisible[tabNum] = true;
        if ( remountWizard ) {
          mountSeasonWizard( tabNum, data );
        }
        else {
          refreshTimelineUI();
        }
      },
    } );
  }

  function refreshFertilizerSlotHeader( e ) {
    if ( !e || !e.target || !/^FTLZ_F\d+_ID$/.test( e.target.name || '' ) ) {
      return;
    }

    const match = ( e.target.name || '' ).match( /^FTLZ_(F\d+)_ID$/ );
    if ( !match ) { return; }

    const group = e.target.closest( '.s-calc-fertilizer-slot' );
    if ( !group ) { return; }

    const pickedEl = group.querySelector( '.s-calc-fertilizer-slot__picked' );
    if ( !pickedEl ) { return; }

    const fertId = Number( e.target.value );
    const picked = fertId !== 5000;

    pickedEl.textContent = picked
      ? SoilCalculator.getFertilizerName( fertId, locale )
      : V.getString( ui.pickFertilizerType );
    pickedEl.classList.toggle( 's-calc-fertilizer-slot__picked--empty', !picked );
  }

  function castSectionTitle( section, locale, hide ) {

    if ( hide ) { return }

    const title = SoilCalculator.getFieldString( section, locale );
    const helpText = SoilCalculator.getFieldString( section, locale, 'help' );
    if ( helpText ) {
      return V.cN( {
        c: 's-calc-form__section-title font-bold',
        h: [
          {
            t: 'span',
            h: title,
          },
          help( helpText ),
        ],
      } );
    }
    else {
      return {
        c: 's-calc-form__section-title font-bold',
        h: title,
      };
    }
  }

  function rowObj( row, tabNum ) {
    return {
      t: 'tr',
      // c: 'fs-l',
      h: [
        {
          t: 'td',
          h: SoilCalculator.getFieldString( row, locale ),
        },
        {
          t: 'td',
          i: 's-calc-result' + ( tabNum ? '__tab-' + tabNum : '' ) + '__' + row,
          c: 's-calc-result td-right txt-right break-words',
          h: InteractionComponents.confirmClickSpinner( { color: 'black' } ),
        },
        // {
        //   t: 'td',
        //   h: SoilCalculator.getFieldString( row, locale, 'unit' ),
        // },
      ],
    };
  }

  function resultsSOM( tabNum ) {
    return {
      c: 's-calc-results s-calc-results__som',
      h: [
        {
          t: 'table',
          c: 's-calc-results-table w-full',
          h: mapFields( ['SOM_LOSS', 'SOM_SUPP', 'SOM_BAL_C', 'SOM_BAL_N'], tabNum ),
        },
        {
          y: {
            'text-align': 'right',
            'padding': '0 1.5rem 1rem',
            'font-size': '0.75rem',
            'font-style': 'italic',
            'color': '#aaa',
          },
          innerHtml: 'in kg ha<sup>-1</sup>',
        },
      ],
    };
  }

  function resultsDemand( tabNum ) {
    return {
      c: 's-calc-results',
      h: [
        {
          t: 'table',
          c: 's-calc-results-table w-full',
          h: mapFields( ['N_PB', 'N_FIX', 'N_FTLZ_SUM', 'N_FTLZ_GRS', 'N_DEP', 'N_NYR'], tabNum ),
        },
        {
          y: {
            'text-align': 'right',
            'padding': '0 1.5rem 1rem',
            'font-size': '0.75rem',
            'font-style': 'italic',
            'color': '#aaa',
          },
          innerHtml: 'in kg ha<sup>-1</sup>',
        },
      ],
    };
  }

  function resultsSupply( tabNum ) {
    return {
      c: 's-calc-results',
      h: [
        {
          t: 'table',
          c: 's-calc-results-table w-full',
          h: mapFields( ['N_CR', 'N_FTLZ_REM', 'C_CR', 'C_FTLZ_REM'], tabNum ),
        },
        {
          y: {
            'text-align': 'right',
            'padding': '0 1.5rem 1rem',
            'font-size': '0.75rem',
            'font-style': 'italic',
            'color': '#aaa',
          },
          innerHtml: 'in kg ha<sup>-1</sup>',
        },
      ],
    };
  }

  function resultsPcip( tabNum ) {
    return {
      c: 's-calc-results',
      h: [
        {
          t: 'table',
          c: 's-calc-results-table w-full',
          h: mapFields( ['PCIPAPI_MM', 'PCIPAPI_STATION_NAME' /*, 'PCIPAPI_DATE_FIRST', 'PCIPAPI_DATE_LAST' */], tabNum ),
        },
        {
          y: {
            'text-align': 'right',
            'padding': '0 1.5rem 1rem',
            'font-size': '0.75rem',
            'font-style': 'italic',
            'color': '#aaa',
          },
          innerHtml: 'in mm',
        },
      ],
    };
  }

  function totalBalance( balance, isGroup ) {
    const cVal = balance && balance.C != null ? balance.C : 0;
    const nVal = balance && balance.N != null ? balance.N : 0;
    const unitFallback = isGroup ? 'kg ha<sup>-1</sup> a<sup>-1</sup>' : '';

    const core = V.cN( {
      c: 's-calc-balance-panel',
      h: [
        V.cN( {
          c: 's-calc-meters',
          h: [
            balanceMeter( 'Carbon', cVal, 's-calc-result__T_BAL_C' ),
            balanceMeter( 'Nitrogen', nVal, 's-calc-result__T_BAL_N' ),
          ],
        } ),
        V.cN( {
          t: 'p',
          c: 's-calc-meter__unit s-calc-balance-unit'
            + ( isGroup ? ' s-calc-result__T_UNIT_GROUP' : '' ),
          i: !isGroup ? 's-calc-result__T_UNIT' : '',
          innerHtml: unitFallback,
        } ),
      ],
    } );

    if ( isGroup ) { return core }

    return V.cN( {
      h: [
        incompleteDatesBannerNode(),
        core,
        V.cN( {
          c: 's-calc-balance-interpretation',
          h: balanceInterpretationLine(),
        } ),
      ],
    } );
  }

  function isSeasonActive( datapoint ) {
    if ( !datapoint || typeof datapoint === 'number' ) { return false }
    return datapoint.CROP && datapoint.CROP.ID && datapoint.CROP.ID !== 1000 && datapoint.CROP.ID !== -1;
  }

  function getActiveSeasonIndices( data ) {
    const indices = [];
    for ( let i = 1; i <= settings.numCropEntries; i++ ) {
      const raw = data[ 's' + i ];
      const dp = typeof raw === 'string' ? V.castJson( raw ) : raw;
      const datapoint = dp && dp.datapoint ? dp.datapoint : dp;
      if ( isSeasonActive( datapoint ) ) {
        indices.push( i );
      }
    }
    if ( !indices.length && ux.selectedSeason ) {
      indices.push( ux.selectedSeason );
    }
    return indices;
  }

  function getNextFreeSeasonSlot( data ) {
    for ( let i = 1; i <= settings.numCropEntries; i++ ) {
      const raw = data[ 's' + i ];
      if ( !raw ) { return i }
      const dp = typeof raw === 'string' ? V.castJson( raw ) : raw;
      const datapoint = dp && dp.datapoint ? dp.datapoint : dp;
      if ( !isSeasonActive( datapoint ) ) {
        return i;
      }
    }
    return null;
  }

  function getTabLabel( tabNum, data ) {
    if ( tabNum === 'AA' ) { return V.getString( ui.overview ) }
    const raw = data[ 's' + tabNum ];
    const dp = typeof raw === 'string' ? V.castJson( raw ) : raw;
    const datapoint = dp && dp.datapoint ? dp.datapoint : dp;
    if ( !isSeasonActive( datapoint ) ) { return V.getString( ui.newSeason ) }
    const name = SoilCalculator.getCropName( datapoint.CROP.ID, locale );
    const year = datapoint.DATE ? formatHarvestYear( datapoint.DATE.HVST ) : '';
    return year ? name + ' ' + year : name;
  }

  function getSeasonBalanceBadges( tabNum ) {
    const slot = V.getState( 'cropSequence' )[ 's' + tabNum ];
    if ( !slot || !slot.results || !slot.results.SOM || !slot.results.SOM.BAL ) {
      return '';
    }
    const c = slot.results.SOM.BAL.C;
    const n = slot.results.SOM.BAL.N;
    return 'C ' + ( c != null ? Number( c ).toFixed( 1 ) : '–' )
      + ' · N ' + ( n != null ? Number( n ).toFixed( 1 ) : '–' );
  }

  function drawSeasonListHighlight() {
    if ( !useTimeline() ) { return }
    V.getNodes( '.s-calc-season-row' ).forEach( row => {
      const slot = row.getAttribute( 'data-season-slot' );
      row.classList.toggle(
        's-calc-season-row--active',
        String( slot ) === String( ux.selectedSeason ),
      );
    } );
  }

  function drawResultsBullets() {
    const container = V.getNode( '.s-calc-results-bullets' );
    if ( !container ) { return }
    const slot = V.getState( 'cropSequence' )[ 's' + ux.selectedSeason ];
    if ( !slot || !slot.results || !slot.results.SOM ) {
      container.textContent = '';
      return;
    }
    const loss = slot.results.SOM.LOSS;
    const supp = slot.results.SOM.SUPP;
    const bullets = [];
    if ( loss && loss.C != null ) {
      bullets.push( 'Carbon loss component: ' + Number( loss.C ).toFixed( 1 ) );
    }
    if ( supp && supp.C != null ) {
      bullets.push( 'Carbon supply component: ' + Number( supp.C ).toFixed( 1 ) );
    }
    if ( slot.results.PCIPAPI && slot.results.PCIPAPI.STATION && slot.results.PCIPAPI.STATION.NAME ) {
      bullets.push( 'Precipitation: ' + slot.results.PCIPAPI.STATION.NAME );
    }
    container.innerHTML = bullets.map( b => '<li>' + b + '</li>' ).join( '' );
  }

  function balanceInterpretationLine() {
    const totals = V.getState( 'cropSequenceYearsAverageResult' )
      || V.getState( 'cropSequenceAverageResult' );
    if ( !totals || !totals.T || !totals.T.BAL ) { return '' }
    const c = totals.T.BAL.C || 0;
    const n = totals.T.BAL.N || 0;
    const parts = [];
    if ( c > 0.05 ) { parts.push( V.getString( ui.balanceCarbonGain ) ) }
    else if ( c < -0.05 ) { parts.push( V.getString( ui.balanceCarbonLoss ) ) }
    if ( n > 0.05 ) { parts.push( V.getString( ui.balanceNitrogenGain ) ) }
    else if ( n < -0.05 ) { parts.push( V.getString( ui.balanceNitrogenLoss ) ) }
    if ( !parts.length ) { return V.getString( ui.balanceNeutral ) }
    return parts.join( ' ' );
  }

  function incompleteDatesBannerNode() {
    const years = V.getState( 'cropSequenceResultsByYear' );
    const hasYears = years && Object.keys( years ).length
      && V.getState( 'cropSequenceYearsAverageResult' );
    if ( hasYears ) { return '' }
    return V.cN( {
      c: 's-calc-date-pill',
      h: V.getString( ui.incompleteDates ),
    } );
  }

  function saveStatusNode() {
    return V.cN( {
      c: 's-calc-save-status',
      h: '',
    } );
  }

  function installDirtyNavigationGuard() {
    if ( window.__soilCalcBeforeUnload ) { return }
    window.__soilCalcBeforeUnload = true;
    window.addEventListener( 'beforeunload', ( e ) => {
      if ( ux.isDirty ) {
        e.preventDefault();
        e.returnValue = '';
      }
    } );
  }

  function isSeasonComplete( datapoint ) {
    if ( !isSeasonActive( datapoint ) ) { return false }
    return Boolean(
      datapoint.DATE
      && datapoint.DATE.HVST
      && datapoint.DATE.SOW,
    );
  }

  function getDataQualitySummary( data ) {
    const active = getActiveSeasonIndices( data || {} );
    let complete = 0;
    active.forEach( slot => {
      const raw = data[ 's' + slot ];
      const dp = typeof raw === 'string' ? V.castJson( raw ) : raw;
      const datapoint = dp && dp.datapoint ? dp.datapoint : dp;
      if ( isSeasonComplete( datapoint ) ) { complete++ }
    } );
    const label = complete + '/' + ( active.length || 0 ) + ' '
      + V.getString( ui.seasonsComplete );
    return { complete, total: active.length, label };
  }

  function getStoredPlotBalance( data ) {
    if ( !data ) { return null }
    const yf = V.castServiceField( 'yearsAverageSequence' );
    const af = V.castServiceField( 'averageSequence' );
    const raw = data[ 's' + yf ] || data[ 's' + af ];
    if ( !raw ) { return null }
    const parsed = typeof raw === 'string' ? V.castJson( raw ) : raw;
    if ( parsed && parsed.T && parsed.T.BAL ) {
      return { C: parsed.T.BAL.C, N: parsed.T.BAL.N };
    }
    return null;
  }

  function exportSeasonsCsv( data ) {
    if ( !data ) { return }
    const header = ['slot', 'crop', 'harvest_year', 'C_balance', 'N_balance'];
    const rows = [header];
    getActiveSeasonIndices( data ).forEach( slot => {
      const raw = data[ 's' + slot ];
      const dpWrap = typeof raw === 'string' ? V.castJson( raw ) : raw;
      const datapoint = dpWrap && dpWrap.datapoint ? dpWrap.datapoint : dpWrap;
      const name = SoilCalculator.getCropName( datapoint.CROP.ID, locale );
      const year = formatHarvestYear( datapoint.DATE && datapoint.DATE.HVST );
      const slotState = V.getState( 'cropSequence' )[ 's' + slot ];
      const bal = slotState && slotState.results && slotState.results.SOM
        ? slotState.results.SOM.BAL
        : {};
      rows.push( [
        slot,
        '"' + String( name ).replace( /"/g, '""' ) + '"',
        year,
        bal.C != null ? Number( bal.C ).toFixed( 2 ) : '',
        bal.N != null ? Number( bal.N ).toFixed( 2 ) : '',
      ] );
    } );
    const csv = rows.map( r => r.join( ',' ) ).join( '\n' );
    const blob = new Blob( [csv], { type: 'text/csv;charset=utf-8' } );
    const link = document.createElement( 'a' );
    link.href = URL.createObjectURL( blob );
    link.download = 'plot-seasons.csv';
    link.click();
    URL.revokeObjectURL( link.href );
  }

  function exportSeasonsJson( data ) {
    if ( !data ) { return }
    const out = {};
    getActiveSeasonIndices( data ).forEach( slot => {
      out[ 's' + slot ] = data[ 's' + slot ];
    } );
    out[ 's' + settings.dbFieldSITE ] = data[ 's' + settings.dbFieldSITE ];
    const blob = new Blob( [JSON.stringify( out, null, 2 )], { type: 'application/json' } );
    const link = document.createElement( 'a' );
    link.href = URL.createObjectURL( blob );
    link.download = 'plot-soil-data.json';
    link.click();
    URL.revokeObjectURL( link.href );
  }

  function openCalculatorRoute() {
    const entity = V.getState( 'active' ).lastViewedEntity;
    if ( !entity ) { return }
    const path = '/plot/' + encodeURIComponent( entity.fullId ) + '/calculator';
    V.setBrowserHistory( path );
    Canvas.draw( { path } );
  }

  function drawCompactDashboard( data ) {
    installDirtyNavigationGuard();
    ux.widgetDataCache = data;
    const quality = getDataQualitySummary( data );
    const balance = getStoredPlotBalance( data );
    const cardTitle = SoilCalculator.isParametersReady()
      ? castCardTitle( 'balance' )
      : V.getString( ui.loadingCalculator );

    return CanvasComponents.card(
      V.cN( {
        c: 's-calc-compact w-full',
        h: [
          totalBalance( balance ),
          V.cN( {
            c: 's-calc-compact-quality',
            h: V.getString( ui.dataQuality ) + ': ' + quality.label,
          } ),
          V.cN( {
            t: 'button',
            c: 's-calc-open-btn',
            h: V.getString( ui.openCalculator ),
            k: openCalculatorRoute,
          } ),
        ],
      } ),
      cardTitle,
    );
  }

  function plotCompareTable( plots ) {
    if ( !plots || !plots.length ) { return '' }
    const rows = plots.map( plot => {
      const sf = plot.servicefields || {};
      const balance = getStoredPlotBalance( sf );
      const q = getDataQualitySummary( sf );
      return V.cN( {
        t: 'tr',
        h: [
          { t: 'td', h: plot.title || plot.fullId },
          { t: 'td', h: balance ? balance.C.toFixed( 1 ) : '–' },
          { t: 'td', h: balance ? balance.N.toFixed( 1 ) : '–' },
          { t: 'td', h: q.label },
        ],
      } );
    } );
    return V.cN( {
      c: 's-calc-plot-compare pxy',
      h: [
        V.cN( { t: 'h3', c: 'font-bold', h: V.getString( ui.plotCompareTitle ) } ),
        V.cN( {
          t: 'table',
          c: 'w-full',
          h: [
            V.cN( {
              t: 'thead',
              h: V.cN( {
                t: 'tr',
                h: ['Plot', 'C', 'N', V.getString( ui.dataQuality )].map( h => ( { t: 'th', h } ) ),
              } ),
            } ),
            V.cN( { t: 'tbody', h: rows } ),
          ],
        } ),
      ],
    } );
  }

  function closeSeasonWizard( skipRefresh ) {
    ux.wizardOpen = false;
    const overlay = V.getNode( '.s-calc-wizard-overlay' );
    if ( overlay ) { overlay.remove() }
    if ( !skipRefresh ) {
      refreshTimelineUI();
    }
  }

  function mountSeasonWizard( tabNum, data ) {
    closeSeasonWizard( true );
    ux.wizardOpen = true;
    const steps = [
      { title: ui.wizardStepCrop, exclude: ['SITE', 'FTLZ', 'BMASS'] },
      { title: ui.wizardStepFertilizer, exclude: ['SITE', 'CROP', 'BMASS', 'DATE'] },
      { title: ui.wizardStepHarvest, exclude: ['SITE', 'CROP', 'FTLZ', 'BMASS', 'PCIPAPI'] },
      { title: ui.wizardStepReview, exclude: ['SITE'] },
    ];
    const step = steps[ux.wizardStep] || steps[0];
    const dataset = V.castJson( data[ 's' + tabNum ] );
    const dp = dataset && dataset.datapoint ? dataset.datapoint : dataset;
    const showAllFert = ux.wizardStep === 1 && shouldShowAllFertilizerSlots( tabNum, dp );
    const body = ux.wizardStep < 3
      ? V.cN( {
        h: [
          ux.wizardStep === 1 ? V.cN( {
            c: 's-calc-step-hint',
            h: V.getString( ui.fertilizerStepHint ),
          } ) : '',
          form( tabNum, dp, step.exclude, showAllFert ),
          ux.wizardStep === 1 && !showAllFert
            ? addFertilizerButton( tabNum, data, true )
            : '',
        ],
      } )
      : V.cN( {
        h: [
          getTabLabel( String( tabNum ), data ),
          ' — ',
          getSeasonBalanceBadges( tabNum ),
        ],
      } );

    document.body.appendChild( V.cN( {
      c: 's-calc-wizard-overlay',
      h: V.cN( {
        c: 's-calc-wizard-panel bkg-white',
        h: [
          wizardStepDots(),
          V.cN( { t: 'h3', h: V.getString( step.title ) } ),
          body,
          V.cN( {
            c: 's-calc-wizard-actions',
            h: [
              ux.wizardStep > 0 ? V.cN( {
                t: 'button',
                c: 's-calc-wizard-btn',
                h: V.getString( ui.wizardBack ),
                k: () => {
                  ux.wizardStep--;
                  mountSeasonWizard( tabNum, data );
                },
              } ) : '',
              ux.wizardStep < steps.length - 1 ? V.cN( {
                t: 'button',
                c: 's-calc-wizard-btn s-calc-wizard-btn--primary',
                h: V.getString( ui.wizardNext ),
                k: () => {
                  ux.wizardStep++;
                  mountSeasonWizard( tabNum, data );
                },
              } ) : V.cN( {
                t: 'button',
                c: 's-calc-wizard-btn s-calc-wizard-btn--primary',
                h: V.getString( ui.wizardClose ),
                k: () => {
                  closeSeasonWizard();
                  handleDatapointChange();
                },
              } ),
            ],
          } ),
        ],
      } ),
    } ) );
  }

  function openSeasonWizard( tabNum, data ) {
    ux.wizardStep = 0;
    mountSeasonWizard( tabNum, data );
  }

  function handleSelectSeason( slotNum ) {
    ux.selectedSeason = slotNum;
    refreshTimelineUI();
  }

  function handleAddSeason( data ) {
    const slot = getNextFreeSeasonSlot( data );
    if ( slot == null ) { return }
    ux.selectedSeason = slot;
    const schema = normalizeDatapointIds( V.castClone( SoilCalculator.getSchema( 'request' ) ) );
    data[ 's' + slot ] = JSON.stringify( schema );
    queuePersist( 's' + slot, schema, true );
    ux.widgetDataCache = data;
    refreshTimelineUI();
  }

  function handleDuplicateSeason( data, fromSlot ) {
    const slot = getNextFreeSeasonSlot( data );
    if ( slot == null ) { return }
    const raw = data[ 's' + fromSlot ];
    let copy = V.castJson( typeof raw === 'string' ? raw : JSON.stringify( raw ) );
    if ( copy && copy.datapoint ) { copy = copy.datapoint }
    data[ 's' + slot ] = JSON.stringify( copy );
    ux.selectedSeason = slot;
    queuePersist( 's' + slot, copy, true );
    ux.widgetDataCache = data;
    refreshTimelineUI();
  }

  function handleRemoveSeason( data, slotNum ) {
    if ( !window.confirm( 'Remove this season?' ) ) { return }
    resetDatapointInDb( slotNum );
    delete data[ 's' + slotNum ];
    const remaining = getActiveSeasonIndices( data );
    ux.selectedSeason = remaining[0] || 1;
    ux.widgetDataCache = data;
    refreshTimelineUI();
  }

  function refreshTimelineUI() {
    const host = V.getNode( '.s-calc-timeline-host' );
    if ( host && ux.widgetDataCache ) {
      /* replace the whole host: V.setNode appends, which would otherwise stack
         nested duplicate timelines on every click */
      const fresh = cropSeasonTimeline( ux.widgetDataCache );
      host.replaceWith( fresh );
      handleDatapointChange();
    }
  }

  function seasonEditorPanel( tabNum, data ) {
    const dataset = V.castJson( data[ 's' + tabNum ] );
    const dp = dataset && dataset.datapoint ? dataset.datapoint : dataset;
    const showAllFertilizer = shouldShowAllFertilizerSlots( tabNum, dp );

    return V.cN( {
      c: 's-calc-season-editor s-calc-form-background',
      h: [
        seasonEditorHeader( tabNum, data ),
        V.cN( { c: 's-calc-form-error', h: ux.formError } ),
        !useExpertMode() ? V.cN( {
          t: 'button',
          c: 's-calc-guided-entry',
          h: V.getString( ui.guidedSeasonEntry ),
          k: () => openSeasonWizard( tabNum, data ),
        } ) : '',
        form( tabNum, dp, ['SITE'], showAllFertilizer ),
        showAllFertilizer ? '' : addFertilizerButton( tabNum, data, false ),
        V.cN( { c: 's-calc-results-title pxy font-bold', h: castSectionTitle( 'CROP_RES', locale ) } ),
        resultsSOM( tabNum ),
        V.cN( {
          c: 's-calc-results-bullets',
          t: 'ul',
          h: [],
        } ),
        V.cN( {
          c: 's-calc-results-show-btn',
          h: V.getIcon( 'expand_more', '24px' ),
          k: handleShowDetails,
        } ),
        V.cN( {
          c: 's-calc-results-wrapper' + ( useExpertMode() ? '' : ' hidden' ),
          h: [
            resultsDemand( tabNum ),
            resultsSupply( tabNum ),
            resultsPcip( tabNum ),
          ],
        } ),
      ],
    } );
  }

  function countFertilizerSlotsInUse( datapoint ) {
    if ( !datapoint || !datapoint.FTLZ ) { return 0 }
    let n = 0;
    for ( let i = 1; i <= settings.numFertilizerGroups; i++ ) {
      const f = datapoint.FTLZ[ 'F' + i ];
      if ( f && f.ID && f.ID !== 5000 && f.ID !== -1 ) { n++ }
    }
    return n;
  }

  function cropSeasonTimeline( data ) {
    data = deleteFields( V.castClone( data ) );
    const active = getActiveSeasonIndices( data );

    /* include the selected slot even when it's a freshly added (still blank)
       season, otherwise "Add season" appears to do nothing */
    const slots = active.slice();
    if (
      ux.selectedSeason
      && !slots.includes( ux.selectedSeason )
      && data[ 's' + ux.selectedSeason ] != null
    ) {
      slots.push( Number( ux.selectedSeason ) );
      slots.sort( ( a, b ) => a - b );
    }

    if ( !slots.includes( ux.selectedSeason ) ) {
      ux.selectedSeason = slots[0] || 1;
    }

    const rows = slots.map( slotNum => {
      const meta = getSeasonMeta( String( slotNum ), data );
      return V.cN( {
        c: 's-calc-season-row'
          + ( String( slotNum ) === String( ux.selectedSeason ) ? ' s-calc-season-row--active' : '' ),
        a: { 'data-season-slot': slotNum },
        h: [
          V.cN( {
            c: 's-calc-season-row__main',
            h: [
              meta.year ? V.cN( { c: 's-calc-season-row__year', h: meta.year } ) : '',
              V.cN( { c: 's-calc-season-row__crop', h: meta.crop } ),
              getSeasonBalanceChips( slotNum ),
            ],
          } ),
          V.cN( {
            c: 's-calc-season-row__actions',
            h: [
              V.cN( {
                t: 'button',
                c: 's-calc-season-action',
                h: V.getString( ui.editSeason ),
                k: ( ev ) => { ev.stopPropagation(); handleSelectSeason( slotNum ) },
              } ),
              V.cN( { c: 's-calc-season-action-sep', h: '·' } ),
              V.cN( {
                t: 'button',
                c: 's-calc-season-action',
                h: V.getString( ui.duplicateSeason ),
                k: ( ev ) => { ev.stopPropagation(); handleDuplicateSeason( data, slotNum ) },
              } ),
              V.cN( { c: 's-calc-season-action-sep', h: '·' } ),
              V.cN( {
                t: 'button',
                c: 's-calc-season-action s-calc-season-action--danger',
                h: V.getString( ui.removeSeason ),
                k: ( ev ) => { ev.stopPropagation(); handleRemoveSeason( data, slotNum ) },
              } ),
            ],
          } ),
        ],
        k: () => handleSelectSeason( slotNum ),
      } );
    } );

    return V.cN( {
      c: 's-calc-timeline-host',
      h: [
        V.cN( {
          c: 's-calc-season-list',
          h: [
            ...rows,
            getNextFreeSeasonSlot( data ) != null ? V.cN( {
              t: 'button',
              c: 's-calc-add-season',
              h: '+ ' + V.getString( ui.addSeason ),
              k: () => handleAddSeason( data ),
            } ) : '',
          ],
        } ),
        seasonEditorPanel( ux.selectedSeason, data ),
      ],
    } );
  }

  function plotSetupSection( data ) {
    return V.cN( {
      c: 's-calc-plot-setup',
      h: siteData( data ),
    } );
  }

  function cropSequence( data = {} ) {

    if ( useTimeline() ) {
      return cropSeasonTimeline( data );
    }

    data = deleteFields( V.castClone( data ) );

    for ( let i = 1; i <= settings.numCropEntries; i++ ) {
      if ( !data['s' + i] ) {
        data['s' + i] = JSON.stringify( SoilCalculator.getSchema( 'request' ) );
      }
    }

    const sequence = Object.keys( data ).map( key => key.replace( 's', '' ) );

    sequence.push( 'AA' );

    const $tabs = V.cN( {
      t: 'tabs',
      h: sequence.map( tabNum => ( {
        t: 'input',
        c: 'tab-input',
        i: 'tab' + tabNum,
        a: {
          type: 'radio',
          name: 'crop-sequence',
          checked: tabNum === '1' ? true : undefined,
        },
      } ) ),
    } );

    $tabs.append( V.cN( {
      t: 'nav',
      c: 's-calc__crop-sequence-nav',
      h: [
        // {
        //   c: 's-calc-form__section-title pxy font-bold',
        //   h: V.getString( ui.year ),
        // },
        {
          t: 'label',
          // c: 'tab' + 'AA' + '__label',
          // for: 'tab' + 'AA',
          k: handleNavScroll.bind( 'left' ),
          h: V.getIcon( 'arrow_left', '30px' ),
        },
        {
          t: 'ul',
          c: 's-calc-tab-nav',
          h: sequence.map( tabNum => ( {
            t: 'li',
            h: {
              x: tabNum != 'AA',
              t: 'label',
              c: 'tab' + tabNum + '__label',
              for: 'tab' + tabNum,
              h: getTabLabel( tabNum, data ),
            },
          } ) ),
        },
        {
          t: 'label',
          k: handleNavScroll.bind( 'right' ),
          h: V.getIcon( 'arrow_right', '30px' ),
        },
        {
          t: 'label',
          c: 'tabAA__label',
          for: 'tabAA',
          h: V.getString( ui.overview ),
        },
      ],
    } ) );

    $tabs.append( V.cN( {
      t: 'content',
      h: sequence.map( function placeForm( tabNum ) {
        const dataset = V.castJson( this.data[ 's' + tabNum] );
        return {
          c: 's-calc-tab-content s-calc-form-background tab-content tab' + tabNum + '__content',
          y: {
            margin: 0,
          },
          h: [
            tabNum != 'AA'
              ? form( tabNum, dataset, /* exclude: */ ['SITE'] )
              : summary( this.data ),
            // V.cN( {
            //   c: 's-calc-results-title pxy font-bold',
            //   h: V.getString( ui.resultsTitle ),
            // } ),
            V.cN( {
              c: 's-calc-results-title pxy font-bold',
              h: castSectionTitle( 'CROP_RES', locale ),
            } ),

            resultsSOM( tabNum ),
            {
              c: 's-calc-results-show-btn',
              h: V.getIcon( 'expand_more', '24px' ), // V.getString( 'Show details' ),
              k: handleShowDetails,
            },
            V.cN( {
              c: 's-calc-results-wrapper hidden',
              h: [
                resultsDemand( tabNum ),
                resultsSupply( tabNum ),
                resultsPcip( tabNum ),
                // resultsCsupply( tabNum ),
              ],
            } ),
          ],
        };
      }, { data: data } ),

    } ) );

    const $tabsWrapper = V.cN( {
      c: 'tabs-wrapper w-full',
      h: $tabs,
    } );

    return $tabsWrapper;
  }

  function siteData( data ) {

    if (
      !data
      || ( data && !data[ 's' + settings.dbFieldSITE ] )
    ) {
      data = {};
      data[ 's' + settings.dbFieldSITE ] = JSON.stringify( {
        SITE: {
          STYP: {
            ID: 2010,
          },
          // FCAP: 40,
          CN: 10,
          PCIP: {
            QTY: 650,
            MUL: 0.5,
          },
          N: {
            DEP: 20,
          },
        },
      } );
    }

    const dataset = V.castJson( data[ 's' + settings.dbFieldSITE ] );
    return form( 0, dataset, /* exclude: */ ['BMASS', 'CROP', 'FTLZ'] );

  }

  function form( formNumber, data, exclude, showAllFertilizer ) {

    if ( !data ) {
      data = SoilCalculator.getSchema( 'request' );
    }

    data = V.castClone( data );

    exclude = exclude || [];
    showAllFertilizer = showAllFertilizer === true || useExpertMode();

    exclude.forEach( section => {
      delete data[section];
    } );

    const formName = Object.keys( data )[0] == 'SITE'
      ? 'SITE'
      : 'CROP'
    + ( formNumber
      ? '-' + formNumber
      : ''
    );

    const input = ( $inputElem, fieldTitle, unit, hide ) => ( {
      c: 's-calc-input-wrapper' + ( hide ? ' hidden' : '' ),
      h: [
        V.cN( {
          y: {
            'display': 'flex',
            'align-items': 'center',
          },
          h: [
            {
              t: 'label',
              c: 's-calc-input-label',
              for: 's-calc-input__' + fieldTitle,
              h: fertilizerFieldLabel( fieldTitle ),
            },
            {
              c: 's-calc-input-unit',
              innerHtml: unit ? unit.replace( /-1/g, '<sup>-1</sup>' ) : '',
            },
          ],
        } ),
        $inputElem,
        // !unit ? $inputElem : V.cN( {
        //   y: {
        //     'display': 'flex',
        //     'width': '85px',
        //     'align-items': 'center',
        //   },
        //   h: [
        //     $inputElem,
        //     {
        //       y: {
        //         'font-size': '0.75rem',
        //         'margin-left': '0.4rem',
        //       },
        //       h: unit,
        //     },
        //   ],
        // } ),
      ],
    } );

    const inputNum = ( val, fieldTitle, hide ) => {
      const unit = SoilCalculator.getFieldString( fieldTitle, locale, 'unit' );
      const $inputNumObj = V.cN( {
        t: 'input',
        c: 's-calc-input-number',
        i: 's-calc-input__' + fieldTitle,
        a: {
          type: 'number',
          step: 'any',
          min: '0',
          name: fieldTitle,
        },
        e: {
          input: V.debounce( handleDatapointChange, 320 ),
        },
        v: val === -1 ? 0 : val,
      } );
      return input( $inputNumObj, fieldTitle, unit, hide );
    };

    const inputText = ( val, fieldTitle ) => {
      const unit = SoilCalculator.getFieldString( fieldTitle, locale, 'unit' );
      const $inputTextObj = V.cN( {
        t: 'input',
        c: 's-calc-input-text',
        i: 's-calc-input__' + fieldTitle,
        a: {
          type: 'text',
          name: fieldTitle,
        },
        e: {
          input: V.debounce( handleDatapointChange, 320 ),
        },
        v: val === '' ? '' : val,
      } );
      return input( $inputTextObj, fieldTitle, unit );
    };

    const inputDropID = ( val, fieldTitle ) => {

      /**
       * Note that JSON files include ID 1000 (crops) and ID 5000 (fertilizers)
       * as "not selcted" options
       */

      const menuJson = fieldTitle == 'CROP_ID' && SoilCalculator.getCrops()
                       || fieldTitle == 'SITE_STYP_ID' && SoilCalculator.getSoilTypes()
                       || SoilCalculator.getFertilizers();

      const useDe = locale.includes( 'de_' );

      const $inputDropElem = V.cN( {
        t: 'select',
        c: 's-calc-input-select',
        i: 's-calc-input__' + fieldTitle,
        a: {
          name: fieldTitle,
        },
        e: {
          change: handleDatapointChange,
        },
        h: menuJson.map( option => ( {
          t: 'option',
          v: option.ID,
          a: {
            selected: option.ID == val ? true : undefined,
          },
          h: useDe ? option.NAME_DE : option.NAME,
        } ) ),
      } );

      // $inputDropElem.prepend( new Option(
      //   fieldTitle == 'CROP_ID'
      //     ? V.getString( ui.noCropSelected )
      //     : V.getString( ui.noFertilizerSelected ),
      //   'none',
      //   false,
      //   val == -1 ? true : false,
      // ) );

      return input( $inputDropElem, fieldTitle );
    };

    const inputRadio = ( val, fieldTitle ) => {
      const $inputRadioElem = V.cN( {
        c: 's-calc-input-radio-wrapper',
        h: [
          {
            t: 'input',
            c: 's-calc-input-radio',
            i: 's-calc-input-' + fieldTitle + '_Y',
            a: {
              type: 'radio',
              name: fieldTitle,
              checked: val ? true : undefined,
            },
            e: {
              change: handleRadioButton,
            },
            v: 'true',
          },
          {
            t: 'label',
            c: 's-calc-input-radio-label',
            for: 's-calc-input-' + fieldTitle + '_Y',
            h: V.getString( ui.yes ),
          },
          {
            t: 'input',
            c: 's-calc-input-radio',
            i: 's-calc-input-' + fieldTitle + '_N_' + formName,
            a: {
              type: 'radio',
              name: fieldTitle,
              checked: val ? undefined : true,
            },
            e: {
              change: handleRadioButton,
            },
            v: 'false',
          },
          {
            t: 'label',
            c: 's-calc-input-radio-label',
            for: 's-calc-input-' + fieldTitle + '_N_' + formName,
            h: V.getString( ui.no ),
          },
        ],
      } );
      return input( $inputRadioElem, fieldTitle );
    };

    const inputDate = ( val, fieldTitle ) => {
      const unit = SoilCalculator.getFieldString( fieldTitle, locale, 'unit' );
      const $inputDateObj = V.cN( {
        t: 'input',
        c: 's-calc-input-date',
        i: 's-calc-input__' + fieldTitle,
        a: {
          type: 'date',
          name: fieldTitle,
        },
        e: {
          input: V.debounce( handleDatapointChange, 320 ),
        },
        v: val === -1 ? 0 : val,
      } );
      return input( $inputDateObj, fieldTitle, unit );
    };

    const templates = {
      CROP: {
        ID: inputDropID,
      },
      FTLZ: {
        F1: {
          ID: inputDropID,
          QTY: inputNum,
          DATE: inputDate,
        },
        F2: {
          ID: inputDropID,
          QTY: inputNum,
          DATE: inputDate,
        },
        F3: {
          ID: inputDropID,
          QTY: inputNum,
          DATE: inputDate,
        },
        F4: {
          ID: inputDropID,
          QTY: inputNum,
          DATE: inputDate,
        },
        F5: {
          ID: inputDropID,
          QTY: inputNum,
          DATE: inputDate,
        },
      },
      BMASS: {
        MP: {
          QTY: inputNum,
          HVST: inputRadio,
        },
        SP: {
          QTY: inputNum,
          HVST: inputRadio,
        },
      },
      DATE: {
        hideTitle: true,
        SOWN: inputDate,
        HVST: inputDate,
        TURN: inputDate,
        CUTS: inputNum,
      },
      PCIPAPI: {
        hide: !useExpertMode(),
        MM: inputNum,
        STATION: {
          ID: inputNum,
          NAME: inputText,
          LAT: inputNum,
          LON: inputNum,
        },
        DATE: {
          FIRST: inputText,
          LAST: inputText,
        },
      },
      SITE: {
        STYP: {
          ID: inputDropID,
        },
        // FCAP: inputNum,
        CN: inputNum,
        PCIP: {
          QTY: inputNum,
          MUL: {
            hide: true,
            template: inputNum,
          },
        },
        N: {
          DEP: inputNum,
        },
      },
    };

    const fieldSingle = ( section, field ) => V.cN( {
      c: 's-calc-form__field-single',
      h: !templates[section][field] ? '' : templates[section][field]( data[section][field], castFlatFieldTitle( section, field, false ) ),
    } );

    const fieldGroup = ( section, field ) => V.cN( {
      c: `s-calc-form__field-group ${section}_${field}`
        + ( section === 'FTLZ' ? ' s-calc-fertilizer-slot' : '' ),
      h: [
        section === 'FTLZ'
          ? fertilizerSlotHeader( section, field, data[section][field] )
          : V.cN( {
            c: 's-calc-form__field-group-title font-bold hidden',
            h: SoilCalculator.getFieldString( section + '_' + field, locale ),
          } ),
        {
          c: `s-calc-form__field-group-fields ${section === 'FTLZ' ? 'fertilizers' : ''}`,
          h: Object.keys( data[section][field] )
            .map( subField => {
              const x = templates[section][field][subField];
              const template = typeof x == 'object' ? x.template : x;
              const hide = typeof x == 'object' ? x.hide : false;
              return template( data[section][field][subField], castFlatFieldTitle( section, field, subField ), hide );
            } ),
        },
      ],
    } );

    const $form = V.cN( {
      t: 'form',
      a: {
        name: formName,
      },
      c: 's-calc-form w-full' + ( formName == 'SITE' ? ' s-calc-form-background' : '' ),
      h: Object.keys( data ).map( section => !templates[section] ? '' : {
        c: 's-calc-form__section' + ( templates[section].hide ? ' hidden' : '' ),
        h: [
          castSectionTitle( section, locale, templates[section].hideTitle ),
          {
            c: 's-calc-form__section-fields',
            h: Object.keys( data[section] )
              .map( field => {
                const elem = typeof data[section][field] == 'object'
                  ? fieldGroup( section, field )
                  : fieldSingle( section, field );

                if ( section === 'FTLZ' && field !== 'F1' && !showAllFertilizer ) {
                  elem.classList.add( 'hidden' );
                }

                return elem;
              } ),
          },
        ],
      } ),
    } );

    return $form;
  }

  function summary( data ) {
    return V.cN( {
      c: 's-calc-summary',
      h: [
        V.cN( { c: 's-calc-summary__title font-bold', h: V.getString( ui.overview ) } ),
        summaryTableYearly(),
        summaryTable( data ),
      ],
    } );
  }

  function summaryTable( data ) {
    return V.cN( {
      c: 's-calc-summary__data',
      h: Object.values( data ).map( ( item, i ) => {
        item = item.datapoint || JSON.parse( item ); /* item is sourced from either state or db */
        // if ( !item.CROP || item.CROP.ID == -1 ) {
        //   return V.cN( {
        //     t: 'p',
        //     c: 's-calc-summary__item',
        //     h:
        //     ( i + 1 )
        //     + ' '
        //     + V.getString( ui.noCropSelected ),
        //   } );
        // }
        return V.cN( {
          x: i < 2 || item.CROP,
          t: 'p',
          c: 's-calc-summary__item flex',
          h: [
            {
              t: 'span',
              c: 's-calc-summary__item-number',
              h: SoilCalculator.getFieldString( 'CROP', locale ) + ' ' + ( i + 1 ),
            },
            {
              t: 'span',
              h: !item.CROP || item.CROP.ID == -1
                ? '' // V.getString( ui.noCropSelected )
                : (
                  SoilCalculator.getCropName( item.CROP.ID, locale )
                  + ', '
                  + SoilCalculator.getFertilizerName( item.FTLZ.F1 ? item.FTLZ.F1.ID : 5000, locale ) // @TODO(fertilizers): handle the multiple fertilizers?
                ),
            },
          ],
        } );
      } ),
    } );
  }

  function summaryTableYearly( data = {} ) {

    return V.cN( {
      c: 's-calc-summary__yearly',
      h: Object.keys( data ).map( year => V.cN( {
        t: 'p',
        c: 's-calc-summary__yearly-item flex',
        h: [
          {
            t: 'span',
            c: 's-calc-summary__year',
            h: year,
          },
          {
            t: 'span',
            c: 's-calc-summary__year-c',
            h: 'C ' + ( data[year].T.BAL.C ? data[year].T.BAL.C.toFixed( 1 ) : '0.00' ),
          },
          {
            t: 'span',
            c: 's-calc-summary__year-n',
            h: 'N ' + ( data[year].T.BAL.N ? data[year].T.BAL.N.toFixed( 1 ) : '0.00' ),
          },
        ],
      } ) ),
    } );
  }

  /*
  function saveBtn() {
    return V.cN( {
      c: 's-calc-safe',
      h: V.getString( ui.safeDataset ),
      k: handleSaveDataset,
    } );
  }
  */

  function calculatorToolbar( display ) {
    return V.cN( {
      t: 'li',
      c: 'pxy w-screen max-w-list zero-auto s-calc-toolbar-item',
      h: V.cN( {
        c: 's-calc-toolbar-wrap',
        h: V.cN( {
          c: 's-calc-toolbar',
        h: [
          V.cN( {
            c: 's-calc-toolbar__group',
            h: V.cN( {
              t: 'button',
              c: 's-calc-toolbar__btn'
                + ( useExpertMode() ? ' s-calc-toolbar__btn--active' : '' ),
              h: V.getString( ui.expertMode ),
              k: () => {
                const next = useExpertMode() ? '0' : '1';
                V.setLocal( 'soil-calc-expert', next );
                if ( ux.widgetDataCache ) {
                  const host = V.getNode( '.s-calc-workspace' )
                    ? '.s-calc-workspace'
                    : '.s-calc-widget';
                  V.setNode( host, '' );
                  V.setNode( host, content( display, ux.widgetDataCache ) );
                  handleDatapointChange();
                }
              },
            } ),
          } ),
          V.cN( {
            c: 's-calc-toolbar__group s-calc-toolbar__group--export',
            h: [
              V.cN( {
                t: 'button',
                c: 's-calc-toolbar__btn s-calc-toolbar__btn--ghost',
                h: V.getString( ui.exportCsv ),
                k: () => exportSeasonsCsv( ux.widgetDataCache ),
              } ),
              V.cN( {
                t: 'button',
                c: 's-calc-toolbar__btn s-calc-toolbar__btn--ghost',
                h: 'JSON',
                k: () => exportSeasonsJson( ux.widgetDataCache ),
              } ),
            ],
          } ),
          saveStatusNode(),
        ],
      } ),
      } ),
    } );
  }

  function content( display, data ) {
    ux.widgetDataCache = data || ux.widgetDataCache || {};

    if ( useTimeline() ) {
      /* timeline is the primary view: never collapse its cards via `display` */
      return [
        CanvasComponents.card(
          V.cN( {
            c: 's-calc-sticky-balance',
            h: totalBalance(),
          } ),
          castCardTitle( 'balance' ),
        ),
        calculatorToolbar( display ),
        CanvasComponents.card(
          cropSequence( data ),
          castCardTitle( 'sequence' ),
        ),
        CanvasComponents.card(
          plotSetupSection( data ),
          castCardTitle( 'site' ),
        ),
      ];
    }

    return [
      CanvasComponents.card(
        totalBalance(),
        castCardTitle( 'balance' ),
      ),
      CanvasComponents.card(
        cropSequence( data ),
        castCardTitle( 'sequence' ),
        undefined,
        display,
      ),
      CanvasComponents.card(
        siteData( data ),
        castCardTitle( 'site' ),
        undefined,
        display,
      ),
      calculatorToolbar( display ),
    ];
  }

  function widgetSkeleton() {
    return V.cN( {
      c: 's-calc-skeleton',
      h: V.getString( ui.loadingCalculator ),
    } );
  }

  function drawPlotWorkspace() {
    installDirtyNavigationGuard();
    return V.cN( {
      c: 's-calc-workspace s-calc-field-ledger w-full',
      h: widgetSkeleton(),
    } );
  }

  function drawWorkspaceContent( display, data ) {
    installDirtyNavigationGuard();
    SoilCalculator.whenReady.then( () => {
      ux.widgetDataCache = data;
      hydrateCropSequenceFromData( data );
      V.setNode( '.s-calc-workspace', '' );
      V.setNode( '.s-calc-workspace', content( display, data ) );
      return handleDatapointChange();
    } ).catch( err => {
      console.error( '[soil-calculator] failed to load parameters', err );
      V.setNode( '.s-calc-workspace', V.cN( {
        c: 'pxy',
        h: V.getString( ui.loadingCalculator ) + ' — check browser console.',
      } ) );
    } );
  }

  /* ================== public methods ================= */

  function castCardTitle( title ) {
    const cardTitles = SoilCalculator.getFieldString( 'CARD', locale );
    const helpText = cardTitles[title]['help'];

    if ( helpText ) {
      return V.cN( {
        h: [
          {
            t: 'span',
            c: 'w-full font-bold pxy',
            h: cardTitles[title]['title'],
          },
          help( helpText, 'leftCorrect' ),
        ],
      } );
    }
    else {
      return cardTitles[title]['title'];
    }
  }

  function drawTotalBalance( balance, isGroup ) {
    return totalBalance( balance, isGroup );
  }

  function drawWidgetContent( display, data ) {
    installDirtyNavigationGuard();
    const render = () => {
      ux.widgetDataCache = data;
      hydrateCropSequenceFromData( data );
      V.setNode( '.s-calc-widget', '' );
      V.setNode( '.s-calc-widget', content( display, data ) );
      return handleDatapointChange();
    };
    SoilCalculator.whenReady.then( render ).catch( err => {
      console.error( '[soil-calculator] failed to load parameters', err );
    } );
  }

  function widget( display ) {
    installDirtyNavigationGuard();
    return V.cN( {
      c: 's-calc-widget s-calc-field-ledger w-full',
      h: widgetSkeleton(),
    } );
  }

  return {
    widget: widget,
    drawWidgetContent: drawWidgetContent,
    drawTotalBalance: drawTotalBalance,
    drawCompactDashboard: drawCompactDashboard,
    drawPlotWorkspace: drawPlotWorkspace,
    drawWorkspaceContent: drawWorkspaceContent,
    plotCompareTable: plotCompareTable,
    getDataQualitySummary: getDataQualitySummary,
    getNumFertilizerGroups: settings.numFertilizerGroups,
    castCardTitle: castCardTitle,
  };

} )();
