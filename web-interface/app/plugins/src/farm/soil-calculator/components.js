const SoilCalculatorComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for the soil calculator in context of the VI app
   *
   */

  'use strict';

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
    },
    's-calc-summary__item-number': {
      'margin-right': '0.7rem',
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
      // height: '2rem',
    },
    's-calc-tab-nav': {
      // background: 'azure',
    },
    's-calc-input-unit': {
      'font-size': '0.75rem',
      'font-style': 'italic',
      'margin-left': '1rem',
    },
    's-calc-tab-content': {
      // background: 'azure',
      'background': '#eee',
      'padding': '0.5rem',
      'border-radius': '0 0 5px 5px',

    },
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
  } );

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      cropSequenceTitle: 'Crop Sequence',
      soilBalanceTitle: 'Soil Balance',
      siteDataTitle: 'Site Data',
      year: 'Jahr',

      yes: 'yes',
      no: 'no',
      noCropSelected: 'None selected',
      noFertilizerSelected: 'No fertilizer',
      safeDataset: 'Save this set',
      showDetails: 'Show details',
      summary: 'Summary',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ===================== handlers ==================== */

  function handleDatapointChange( e ) {

    if ( e ) {

      /* is not the case when loading data from db */
      setDatapoint( e ); /* save to db */
    }

    setStateDatapoint();

    setStateDatapointResults();

    /**
     * Though timeout looks good in ui, it is also needed
     * to ensure results are set (should be changed to promise)
     */

    setTimeout( function delayedDrawResults() {
      drawResetResults();
      drawDatapointResults();
      drawSequenceResults(); /* the total */
      drawSummary();
    }, 170 );

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
    V.setState( 'cropSequence', { s10: getFormData( 'SITE' ) } );
    for ( let i = 1; i <= 8; i++ ) {
      const obj = {};
      obj[ 's' + i ] = { datapoint: getFormData( 'CROP-' + i ) };
      V.setState( 'cropSequence', obj );
    }
  }

  function setStateDatapointResults() {
    const siteData = V.getState( 'cropSequence' )[ 's10' ];
    for ( let i = 1; i <= 8; i++ ) {
      const cropData = V.getState( 'cropSequence' )[ 's' + i ].datapoint;
      if ( typeof cropData === 'number' ) { continue }
      const prevCropData = i == 1 ? null : V.getState( 'cropSequence' )[ 's' + ( i - 1 ) ].datapoint;
      Object.assign( cropData, siteData ); // merge
      if ( cropData && siteData ) {
        SoilCalculator
          .getDatapointResults( cropData, prevCropData )
          .then( res => {
            // console.log( 'Calculation Results: ', res );
            Object.assign( V.getState( 'cropSequence' )[ 's' + i ], { results: res.results } );
          } );
      }
    }
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
        if ( tabNum <= 8 ) {
          V.getNode( 'label[for="tab' + tabNum + '"]' ).classList.remove( 'font-bold' );
        }

        continue;
      }

      /* add highlight to tab number */
      V.getNode( 'label[for="tab' + tabNum + '"]' ).classList.add( 'font-bold' );

      drawResults( sequence[key].results, tabNum );
    }
  }

  function drawSequenceResults() {
    // console.log( 'drawSequenceResults' );

    SoilCalculator
      .getSequenceResults( V.getState( 'cropSequence' ) )
      .then( res => {
        drawResults( res );
      } );
  }

  function drawSummary() {
    const sequence = V.castClone( V.getState( 'cropSequence' ) );
    delete sequence.s9;
    delete sequence.s10;
    V.setNode( '.s-calc-summary__data', 'clear' );
    V.getNode( '.s-calc-summary' ).append( summaryTable( sequence ) );
  }

  function setDatapoint( e ) {

    const formName = e.target.closest( 'form' ).getAttribute( 'name' );

    const subFieldNum = formName === 'SITE'
      ? '10'
      : formName.replace( 'CROP-', '' );

    const newDatapoint = getFormData( formName );

    if (
      newDatapoint === -20
    ) {
      return;
    }

    if (
      newDatapoint === -10
      // && ... // todo: check if we have a state entry
    ) {

      /* resets entry */
      V.setEntity( V.getState( 'active' ).lastViewed, {
        field: 'servicefields.s' + subFieldNum,
        data: null,
      } );
      return;
    }

    const jsonStr = V.castJson( newDatapoint );

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
      __.SITE.CN = Number( _.SITE_CN.value );
      __.SITE.FCAP = Number( _.SITE_FCAP.value );
      __.SITE.PCIP.QTY = Number( _.SITE_PCIP_QTY.value );
      __.SITE.PCIP.MUL = Number( _.SITE_PCIP_MUL.value );
      __.SITE.N.DEP = Number( _.SITE_N_DEP.value );
    }
    else {
      delete __.SITE;

      __.CROP.ID = Number( _.CROP_ID.value );

      __.FTLZ.ORG.ID = Number( _.FTLZ_ORG_ID.value );
      __.FTLZ.ORG.QTY = Number( _.FTLZ_ORG_QTY.value );

      __.BMASS.MP.QTY = Number( _.BMASS_MP_QTY.value );
      __.BMASS.MP.HVST = ( _.BMASS_MP_HVST.value === 'true' );

      __.BMASS.SP.QTY = Number( _.BMASS_SP_QTY.value );
      __.BMASS.SP.HVST = ( _.BMASS_SP_HVST.value === 'true' );
    }

    // console.log( 'New Dataset: ', __ );

    /* return the new dataset */

    return __;

  }

  function validateFormData( _, formName ) {

    if ( formName === 'SITE' ) { return 1 } // TODO

    if(
      _.CROP_ID.value == 1000
      && !_.BMASS_MP_QTY.value
    ) {
      return -10;
    }

    if(
      _.CROP_ID.value == 1000
      // || ( _.FTLZ_ORG_ID.value != 5000 && !_.FTLZ_ORG_QTY.value )
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
            const value = res[section][field][subField].toFixed( 1 );
            V.setNode( prefix + fieldString, value );
          }
        }
        else {
          const fieldString = section + '_' + field;
          const value = res[section][field].toFixed( 1 );
          V.setNode( prefix + fieldString, value );
        }
      }
    }
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
      h: {
        t: 'table',
        c: 's-calc-results-table w-full',
        h: mapFields( ['SOM_LOSS', 'SOM_SUPP', 'SOM_BAL_C', 'SOM_BAL_N'], tabNum ),
      },
    };
  }

  function resultsDemand( tabNum ) {
    return {
      c: 's-calc-results',
      h: {
        t: 'table',
        c: 's-calc-results-table w-full',
        h: mapFields( ['N_PB', 'N_FIX', 'N_FTLZ_ORG', 'N_FTLZ_GRS', 'N_DEP', 'N_NYR'], tabNum ),
      },
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
          h: 'in kg/ha',
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
            'text-align': 'right',
            'padding': '0 0.7rem',
            'font-style': 'italic',
            'color': '#aaa',
          },
          h: [
            {
              t: 'span',
              y: {
                'font-size': '1.1rem',
              },
              h: 'x̄',
            },
            {
              t: 'span',
              y: {
                'font-size': '0.75rem',
              },
              h: ' in kg/ha',
            },
          ],
        },
      ],
    };
  }

  function cropSequence( data = {} ) {

    data = V.castClone( data );

    for ( let i = 1; i <= 8; i++ ) {
      if ( !data['s' + i] ) {
        data['s' + i] = JSON.stringify( SoilCalculator.getSchema( 'request' ) );
      }
    }

    delete data.s9;
    delete data.s10;

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
      h: [
        // {
        //   c: 's-calc-form__section-title pxy font-bold',
        //   h: V.getString( ui.year ),
        // },
        {
          t: 'ul',
          c: 's-calc-tab-nav',
          h: sequence.map( tabNum => ( {
            t: 'li',
            h: {
              t: 'label',
              c: 'tab' + tabNum + '__label',
              for: 'tab' + tabNum,
              h: tabNum == 'AA' ? V.getIcon( 'summarize' ) : tabNum,
            },
          } ) ),
        },
      ],
    } ) );

    $tabs.append( V.cN( {
      t: 'content',
      h: sequence.map( function placeForm( tabNum ) {
        const dataset = V.castJson( this.data[ 's' + tabNum] );
        return {
          c: 's-calc-tab-content tab-content tab' + tabNum + '__content',
          h: [
            tabNum != 'AA'
              ? form( tabNum, dataset, /* exclude: */ ['SITE'] )
              : summary( this.data ),
            {
              c: 's-calc-results-show-btn',
              h: V.getIcon( 'expand_more', '24px' ), // V.getString( 'Show details' ),
              k: handleShowDetails,
            },
            V.cN( {
              c: 's-calc-results-wrapper hidden',
              h: [
                resultsSOM( tabNum ),
                resultsDemand( tabNum ),
                resultsSupply( tabNum ),
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
      || ( data && !data.s10 )
    ) {
      data = {
        s10: JSON.stringify( {
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
        } ),
      };
    }

    const dataset = V.castJson( data.s10 );
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

    const formName = Object.keys( data )[0] + ( formNumber ? '-' + formNumber : '' );

    const input = ( $inputElem, fieldTitle, unit ) => ( {
      c: 's-calc-input-wrapper',
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
              h: unit,
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

    const inputNum = ( val, fieldTitle ) => {
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
      return input( $inputNumObj, fieldTitle, unit );
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

    const templates = {
      CROP: {
        ID: inputDropID,
      },
      FTLZ: {
        ORG: {
          ID: inputDropID,
          QTY: inputNum,
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
      SITE: {
        CN: inputNum,
        FCAP: inputNum,
        PCIP: {
          QTY: inputNum,
          MUL: inputNum,
        },
        N: {
          DEP: inputNum,
        },
      },
    };

    const fieldSingle = ( section, field ) => V.cN( {
      c: 's-calc-form__field-single',
      h: templates[section][field]( data[section][field], castFlatFieldTitle( section, field, false ) ),
    } );

    const fieldGroup = ( section, field ) => V.cN( {
      c: 's-calc-form__field-group',
      h: [
        {
          c: 's-calc-form__field-group-title font-bold',
          h: SoilCalculator.getFieldString( section + '_' + field, locale ),
        },
        {
          c: 's-calc-form__field-group-fields',
          h: Object.keys( data[section][field] )
            .map( subField => templates[section][field][subField]( data[section][field][subField], castFlatFieldTitle( section, field, subField ) ) ),
        },
      ],
    } );

    const $form = V.cN( {
      t: 'form',
      a: {
        name: formName,
      },
      c: 's-calc-form w-full',
      h: Object.keys( data ).map( section => ( {
        c: 's-calc-form__section',
        h: [
          {
            c: 's-calc-form__section-title font-bold',
            h: SoilCalculator.getFieldString( section, locale ),
          },
          {
            c: 's-calc-form__section-fields',
            h: Object.keys( data[section] )
              .map( field => typeof data[section][field] == 'object'
                ? fieldGroup( section, field )
                : fieldSingle( section, field ),
              ),
          },
        ],
      } ) ),
    } );

    return $form;
  }

  function summary( data ) {
    return V.cN( {
      c: 's-calc-summary',
      h: [
        V.cN( { c: 's-calc-summary__title font-bold', h: V.getString( ui.summary ) } ),
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
          t: 'p',
          c: 's-calc-summary__item flex',
          h: [
            {
              t: 'span',
              c: 's-calc-summary__item-number',
              h: i + 1,
            },
            {
              t: 'span',
              h: !item.CROP || item.CROP.ID == -1
                ? '' // V.getString( ui.noCropSelected )
                : (
                  SoilCalculator.getCropName( item.CROP.ID, locale )
                  + ' / '
                  + SoilCalculator.getFertilizerName( item.FTLZ.ORG.ID, locale )
                ),
            },
          ],
        } );
      } ),
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
        '',
        undefined,
        display,
      ),
    ];
  }

  /* ================== public methods ================= */

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
  };

} )();
