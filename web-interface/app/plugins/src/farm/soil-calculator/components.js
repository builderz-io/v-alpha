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
      'background': '#eee',
      'padding': '0.5rem',
      'margin': '0.5rem',
      'border-radius': '5px',
    },
    's-calc-results-show-btn': {
      'text-align': 'center',
      'text-decoration': 'underline',
      'cursor': 'pointer',
      'transform': 'rotate(0deg)',
      'transition': 'transform 0.25s ease-out',
    },
    's-calc-results': {
      'border-radius': '5px',
      'background': 'whitesmoke',
      'margin': '1.5rem',
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
      'justify-content': 'space-between',
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
      'width': '50px',
      // height: '1.74rem',
      'padding': '0.2rem 0.4rem',
      'font-weight': '600',
      // 'border-bottom': '1px solid gray',
      'border-radius': '3px',
      'text-align': 'right',
    },
    's-calc-input-date': {
      padding: '0.2rem 0.4rem',
    },
    's-calc-input-select': {
      'width': '210px',
      'border': 'none',
      // height: '1.74rem',
      'padding': '0.2rem 0.4rem',
      // 'font-weight': '600',
      'border-radius': '3px',
      'text-align': 'right',
      'background': '#eee',
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
      'width': '38%',
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
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ===================== handlers ==================== */

  async function handleDatapointChange( e ) {
    let run = { run: true };

    if ( e ) {

      /* is not the case when loading data from db */
      run = getDatapoint( e );
    }

    if ( !e ) {

      /* checking if on profile load, we need to toggle any fertilizer groups */
      toggleFertliziersGroups( 'CROP-1' );
    }

    toggleFertilizerUnit();

    if ( !run.run ) { return }

    setStateDatapoint();

    await setStateDatapointResults();
    await setStateYearlyResults();
    await setStateSequenceAverageResult();
    await setStateYearsAverageResult();

    drawResetResults();
    drawDatapointResults();
    drawTotalResult();
    drawSummary();

    if ( e && run.newDatapoint === -10 ) {
      resetDatapointInDb( run.subFieldNum );
    }
    else if ( e ) {

      /* add PCIPAPI and SOM to the CROP data to be saved */
      if ( run.subFieldNum != settings.dbFieldSITE ) {
        Object.assign( run.newDatapoint.PCIPAPI, V.getState( 'cropSequence' )[ 's' + run.subFieldNum ].results.PCIPAPI );
        Object.assign( run.newDatapoint, { SOM: { BAL: {} } } );
        Object.assign( run.newDatapoint.SOM.BAL, V.getState( 'cropSequence' )[ 's' + run.subFieldNum ].results.SOM.BAL );
      }

      setDatabase( run.subFieldNum, run.newDatapoint );
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

  function setStateDatapoint() {
    const obj = {};
    obj[ 's' + settings.dbFieldSITE ] = getFormData( 'SITE' );
    V.setState( 'cropSequence', obj );
    for ( let i = 1; i <= settings.numCropEntries; i++ ) {
      const obj = {};
      obj[ 's' + i ] = { datapoint: getFormData( 'CROP-' + i ) };
      V.setState( 'cropSequence', obj );
    }
  }

  async function setStateDatapointResults() {
    const siteData = V.getState( 'cropSequence' )[ 's' + settings.dbFieldSITE ];
    for ( let i = 1; i <= settings.numCropEntries; i++ ) {
      const cropData = V.getState( 'cropSequence' )[ 's' + i ];
      if ( typeof cropData.datapoint === 'number' ) { continue }

      const prevCropData = getFirstPrevious( i );

      Object.assign( cropData.datapoint, siteData ); // merge SITE into the datapoint

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

  async function setStateSequenceAverageResult() {
    SoilCalculator
      .getSequenceResults( V.getState( 'cropSequence' ), locale )
      .then( res => {
        if ( !res || !res.T || res.T.BAL.C === null ) {
          V.setState( 'cropSequenceAverageResult', 'clear' );
          return;
        }
        V.setState( 'cropSequenceAverageResult', { T: res.T } );
      } );
  }

  async function setStateYearsAverageResult() {
    SoilCalculator
      .getYearsAverageResults( V.getState( 'cropSequenceResultsByYear' ), locale )
      .then( res => {
        if ( !res || !res.T || res.T.BAL.C === null ) {
          V.setState( 'cropSequenceYearsAverageResult', 'clear' );
          return;
        }
        V.setState( 'cropSequenceYearsAverageResult', { T: res.T } );
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
    // console.log( 'drawDatapointResults' );
    // console.log( sequence );
    for ( const key in sequence ) {

      const tabNum = key.replace( 's', '' );

      if (
        ['undefined', 'number'].includes( typeof sequence[key].datapoint )
      ) {

        /* remove highlight from tab number */
        if ( tabNum <= settings.numCropEntries ) {
          V.getNode( 'label[for="tab' + tabNum + '"]' ).classList.remove( 'font-bold' );
        }

        continue;
      }

      /* add highlight to tab number */
      V.getNode( 'label[for="tab' + tabNum + '"]' ).classList.add( 'font-bold' );

      drawResults( sequence[key].results, tabNum );
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

  function toggleFertilizerUnit() {
    const mineralFertilizers = ['5005'];

    for ( let cropIdx = 1; cropIdx <= settings.numCropEntries; ++cropIdx ) {
      for ( let fertilizerGroupIdx = 1; fertilizerGroupIdx <= settings.numFertilizerGroups; ++fertilizerGroupIdx ) {
        const fertilizerSelectElement = V.getNode( `form[name="CROP-${cropIdx}"] .FTLZ_F${fertilizerGroupIdx} #s-calc-input__FTLZ_F${fertilizerGroupIdx}_ID` );
        const selectedFertilizerValue = fertilizerSelectElement.selectedOptions[0].value;

        const unitElement = V.getNode( `form[name="CROP-${cropIdx}"] .FTLZ_F${fertilizerGroupIdx} .s-calc-input-unit:not(:empty)` );
        if ( mineralFertilizers.includes( selectedFertilizerValue ) ) {
          unitElement.textContent = SoilCalculator.getFieldString( `FTLZ_F${fertilizerGroupIdx}_QTY`, locale, 'mineralUnit' );
        }
        else {
          unitElement.textContent = SoilCalculator.getFieldString( `FTLZ_F${fertilizerGroupIdx}_QTY`, locale, 'unit' );
        }
      }
    }
  }

  function toggleFertliziersGroups( formName ) {
    const _ = document.forms[formName].elements;
    for ( let i = 1; i <= settings.numFertilizerGroups; ++i ) {
      const nextFertilizerGroupIdx = i+1;

      const shouldDisplayTheNextFertilizerGroup
        = ( ( _[`FTLZ_F${i}_ID`] && _[`FTLZ_F${i}_ID`].value  !== '5000' ) && ( _[`FTLZ_F${i}_ID`] && !!_[`FTLZ_F${i}_QTY`].value ) )
          || ( ( _[`FTLZ_F${nextFertilizerGroupIdx}_ID`] && _[`FTLZ_F${nextFertilizerGroupIdx}_ID`].value  !== '5000' )
            && ( _[`FTLZ_F${nextFertilizerGroupIdx}_ID`] && !!_[`FTLZ_F${nextFertilizerGroupIdx}_QTY`].value ) );

      const groupElement = document.querySelector( `.FTLZ_F${nextFertilizerGroupIdx}` );
      if ( shouldDisplayTheNextFertilizerGroup && nextFertilizerGroupIdx <= settings.numFertilizerGroups && groupElement ) {
        groupElement.classList.toggle( 'hidden', false );
      }
      else if ( nextFertilizerGroupIdx <= settings.numFertilizerGroups && groupElement && _[`FTLZ_F${i}_ID`] && _[`FTLZ_F${i}_ID`].value === '5000' ) {
        groupElement.classList.toggle( 'hidden', true );
      }
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
      toggleFertliziersGroups( formName );
    }

    if (
      newDatapoint === -30
    ) {

      document.activeElement.classList.add( 'red-background', 'txt-red' );

      setTimeout( () => {
        document.activeElement.classList.remove( 'red-background' );
      }, 400 );

      returnObj.run = false;

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

  function setDatabase( subFieldNum, data ) {
    const jsonStr = V.castJson( data );
    V.setEntity( V.getState( 'active' ).lastViewed, {
      field: 'servicefields.s' + subFieldNum,
      data: jsonStr,
    } );
  }

  function getFormData( formName ) {
    // const s = document.forms.SITE.elements;

    const _ = document.forms[formName].elements;

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
      __.SITE.FCAP = Number( _.SITE_FCAP.value );
      __.SITE.PCIP.QTY = Number( _.SITE_PCIP_QTY.value );
      __.SITE.PCIP.MUL = Number( _.SITE_PCIP_MUL.value );
      __.SITE.N.DEP = Number( _.SITE_N_DEP.value );
    }
    else {
      delete __.SITE;

      __.CROP.ID = Number( _.CROP_ID.value );

      for ( let i = 1; i <= settings.numFertilizerGroups; ++i ) {
        __.FTLZ[`F${i}`].ID = Number( _[`FTLZ_F${i}_ID`] ? _[`FTLZ_F${i}_ID`].value : '' );
        __.FTLZ[`F${i}`].QTY = Number( _[`FTLZ_F${i}_QTY`] ? _[`FTLZ_F${i}_QTY`].value : '' );
        __.FTLZ[`F${i}`].DATE = _[`FTLZ_F${i}_DATE`] ? _[`FTLZ_F${i}_DATE`].value : '';
      }

      __.BMASS.MP.QTY = Number( _.BMASS_MP_QTY.value );
      __.BMASS.MP.HVST = ( _.BMASS_MP_HVST.value === 'true' );

      __.BMASS.SP.QTY = Number( _.BMASS_SP_QTY.value );
      __.BMASS.SP.HVST = ( _.BMASS_SP_HVST.value === 'true' );

      __.DATE.SOWN = _.DATE_SOWN.value;
      __.DATE.HVST = _.DATE_HVST.value;

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
      _.DATE_SOWN && _.DATE_HVST
      && new Date( _.DATE_SOWN.value ) >= new Date( _.DATE_HVST.value )
    ) {
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

  function totalBalance() {
    return {
      c: 's-calc-total-balance w-full',
      // h: {
      //   t: 'table',
      //   c: 'w-full pxy',
      //   h: mapFields( ['T_BAL_N', 'T_BAL_C'], null ),
      // },
      h: [
        {
          y: {
            'display': 'flex',
            'justify-content': 'space-between',
            'font-size': '1.6rem',
            'font-weight': '600',
          },
          c: 'w-full pxy',
          h: [
            {
              y: {
                // 'background': '#eee',
                'padding': '0.75rem 1.25rem',
                'border-radius': '5px',
                'border-left': '3px solid',
                'color': 'steelblue',
              },
              h: [
                {
                  t: 'span',
                  y: {
                    'margin-right': '1.5rem',
                  },
                  h: 'C',
                },
                {
                  t: 'span',
                  y: {
                    color: 'steelblue',
                  },
                  i: 's-calc-result' + '__' + 'T_BAL_C',
                  h: '0.00',
                },
              ],
            },
            {
              y: {
                // 'background': '#eee',
                'padding': '0.75rem 1.25rem',
                'border-radius': '5px',
                'border-left': '3px solid',
                'color': 'teal',
              },
              h: [
                {
                  t: 'span',
                  y: {
                    'margin-right': '1.5rem',
                  },
                  h: 'N',
                },
                {
                  t: 'span',
                  y: {
                    color: 'teal',
                  },
                  i: 's-calc-result' + '__' + 'T_BAL_N',
                  h: '0.00',
                },
              ],
            },
          ],
        },
        {
          y: {
            'display': 'flex',
            'justify-content': 'end',
            'padding': '0.2rem 1rem 0.5rem',
            'font-style': 'italic',
            'color': '#aaa',
          },
          h: [
            // {
            //   t: 'span',
            //   y: {
            //     'font-size': '1.1rem',
            //   },
            //   h: 'x̄',
            // },
            {
              t: 'p',
              y: {
                'font-size': '0.75rem',
              },
              i: 's-calc-result' + '__' + 'T_UNIT',
              h: '',
            },
          ],
        },
      ],
    };
  }

  function cropSequence( data = {} ) {

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
              h: tabNum,
            },
          } ) ),
        },
        {
          t: 'label',
          // c: 'tab' + 'AA' + '__label',
          // for: 'tab' + 'AA',
          k: handleNavScroll.bind( 'right' ),
          h: V.getIcon( 'arrow_right', '30px' ),
        },
        {
          t: 'label',
          c: 'tab' + 'AA' + '__label',
          for: 'tab' + 'AA',
          h: V.getIcon( 'summarize' ),
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
          CN: 10,
          FCAP: 40,
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

  function form( formNumber, data, exclude ) {

    if ( !data ) {
      data = SoilCalculator.getSchema( 'request' );
    }

    data = V.castClone( data );

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
              h: SoilCalculator.getFieldString( fieldTitle, locale ),
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

      const menuJson = fieldTitle == 'CROP_ID'
        ? SoilCalculator.getCrops()
        : SoilCalculator.getFertilizers();

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
        SOWN: inputDate,
        HVST: inputDate,
      },
      PCIPAPI: {
        hide: true,
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
        CN: inputNum,
        FCAP: inputNum,
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
      c: `s-calc-form__field-group ${section}_${field}`,
      h: [
        {
          c: 's-calc-form__field-group-title font-bold hidden',
          h: SoilCalculator.getFieldString( section + '_' + field, locale ),
        },
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
          {
            c: 's-calc-form__section-title font-bold',
            h: SoilCalculator.getFieldString( section, locale ),
          },
          {
            c: 's-calc-form__section-fields',
            h: Object.keys( data[section] )
              .map( field => {
                const elem = typeof data[section][field] == 'object'
                  ? fieldGroup( section, field )
                  : fieldSingle( section, field );

                if ( section === 'FTLZ' && field !== 'F1' ) {
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
                  + ' & '
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

  function content( display, data ) {
    return [
      CanvasComponents.card(
        totalBalance(),
        V.getString( ui.soilBalanceTitle ),
      ),
      CanvasComponents.card(
        cropSequence( data ),
        V.getString( ui.cropSequenceTitle ),
        undefined,
        display,
      ),
      CanvasComponents.card(
        siteData( data ),
        V.getString( ui.siteDataTitle ),
        undefined,
        display,
      ),
    ];
  }

  /* ================== public methods ================= */

  function drawTotalBalance() {
    return totalBalance();
  }

  function drawWidgetContent( display, data ) {
    V.setNode( '.s-calc-widget', '' );
    V.setNode( '.s-calc-widget', content( display, data ) );
    handleDatapointChange();
  }

  function widget( display ) {
    return V.cN( {
      c: 's-calc-widget w-full',
      h: content( display ),
    } );
  }

  return {
    widget: widget,
    drawWidgetContent: drawWidgetContent,
    drawTotalBalance: drawTotalBalance,
    getNumFertilizerGroups: settings.numFertilizerGroups,
  };

} )();
