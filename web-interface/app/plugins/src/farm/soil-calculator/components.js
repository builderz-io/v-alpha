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
    's-calc-form': {
      // 'border-radius': '20px',
      // 'border': '1px solid lightgray',
      background: 'honeydew',

    },
    's-calc-results': {
      'border-radius': '5px',
      'background': 'azure',
      'margin': '1.5rem',
    },
    's-calc-total-balance': {
      background: 'azure',
    },
    's-calc-form__section': {
      padding: '1rem',
    },
    's-calc-input-wrapper': {
      'display': 'flex',
      'justify-content': 'space-between',
      'margin-bottom': '0.5rem',
    },
    // 's-calc-input-label': {
    //   width: '170px',
    // },
    's-calc-input-number': {
      width: '60px',
      height: '1.74rem',
      // 'border-bottom': '1px solid gray',
    },
    's-calc-form__field-group-title': {
      height: '2rem',
    },
    's-calc-form__section-title': {
      height: '2rem',
    },
    's-calc-tab-nav': {
      // background: 'azure',
    },
    's-calc-tab-content': {
      // background: 'azure',
      background: 'honeydew',
      // padding: '0.5rem',
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
      'justify-content': 'space-around',
      'width': '35%',
    },
    's-calc-input-select': {
      width: '210px',
      border: 'none',
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
      notSelected: '',
      safeDataset: 'Save this set',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ===================== handlers ==================== */

  function handleDatapointChange( e ) {

    setStateDatapoint();

    setStateResults();

    // timeout looks good in ui, but is also needed to ensure results are set (should be changed to promise)
    setTimeout( function delayedDrawResults() {
      drawResetResults();
      drawDatapointResults();
      drawSequenceResults(); // the total
    }, 170 );

    if ( !e ) { return } // when loading data from db

    setDatapoint( e ); // save to db

  }

  /* ================== private methods ================= */

  function setStateDatapoint() {
    V.setState( 'cropSequence', { s10: getFormData( 'SITE' ) } );
    for ( let i = 1; i <= 8; i++ ) {
      const obj = {};
      obj[ 's' + i ] = { datapoint: getFormData( 'CROP-' + i ) };
      V.setState( 'cropSequence', obj );
    }
  }

  function setStateResults() {
    const siteData = V.getState( 'cropSequence' )[ 's10' ];
    for ( let i = 1; i <= 8; i++ ) {
      const cropData = V.getState( 'cropSequence' )[ 's' + i ].datapoint;
      if ( !cropData ) { continue }
      Object.assign( cropData, siteData ); // merge
      if ( cropData && siteData ) {
        SoilCalculator
          .getResults( cropData )
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
      if (
        !sequence[key].datapoint
      ) {
        continue;
      }
      drawResults( sequence[key].results, key.replace( 's', '' ) );
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

  function setDatapoint( e ) {

    const formName = e.target.closest( 'form' ).getAttribute( 'name' );

    const newDatapoint = getFormData( formName );

    if ( !newDatapoint ) { return }

    const jsonStr = V.castJson( newDatapoint );

    const subFieldNum = formName === 'SITE'
      ? '10'
      : formName.replace( 'CROP-', '' );

    V.setEntity( V.getState( 'active' ).lastViewed, {
      field: 'servicefields.s' + subFieldNum,
      data: jsonStr === '' ? null : jsonStr,
    } );

  }

  function getFormData( formName ) {
    // const s = document.forms.SITE.elements;
    const _ = document.forms[formName].elements;

    if ( !validateFormData( _, formName ) ) { return }

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
    if ( formName === 'SITE' ) { return true } // TODO
    if(
      _.CROP_ID.value === 'none'
      || _.FTLZ_ORG_ID.value === 'none'
      || !_.BMASS_MP_QTY.value
      || !_.FTLZ_ORG_QTY.value
    ) {
      return false;
    }

    return true;

  }

  function drawResults( res, tabNum ) {

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

  /* ================== components ================= */

  function rowObj( row, tabNum ) {
    return {
      t: 'tr',
      // c: 'fs-l',
      h: [
        {
          t: 'td',
          h: SoilCalculator.getFieldDisplayName( row, locale ),
        },
        {
          t: 'td',
          i: 's-calc-result' + ( tabNum ? '__tab-' + tabNum : '' ) + '__' + row,
          c: 's-calc-result td-right txt-right break-words',
          h: InteractionComponents.confirmClickSpinner( { color: 'black' } ),
        },
      ],
    };
  }

  function resultsSOM( tabNum ) {
    return {
      c: 's-calc-results s-calc-results__som',
      h: {
        t: 'table',
        c: 's-calc-results-table w-full',
        h: mapFields( ['SOM_LOSS', 'SOM_SUPP', 'SOM_BAL_N', 'SOM_BAL_C'], tabNum ),
      },
    };
  }

  function resultsN( tabNum ) {
    return {
      c: 's-calc-results s-calc-results__n',
      h: {
        t: 'table',
        c: 's-calc-results-table w-full',
        h: mapFields( ['N_PB', 'N_FIX', 'N_DEP', 'N_NYR', 'N_CR', 'N_FTLZ_ORG', 'N_FTLZ_REM'], tabNum ),
      },
    };
  }

  function resultsC( tabNum ) {
    return {
      c: 's-calc-results s-calc-results__c',
      h: {
        t: 'table',
        c: 's-calc-results-table w-full',
        h: mapFields( ['C_CR', 'C_FTLZ_REM'], tabNum ),
      },
    };
  }

  function totalBalance() {
    return {
      c: 's-calc-total-balance w-full',
      h: {
        t: 'table',
        c: 'w-full pxy',
        h: mapFields( ['T_BAL_N', 'T_BAL_C'], null ),
      },
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

    const tabs = V.cN( {
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

    tabs.append( V.cN( {
      t: 'nav',
      h: [
        {
          c: 's-calc-form__section-title pxy font-bold',
          h: V.getString( ui.year ),
        },
        {
          t: 'ul',
          c: 's-calc-tab-nav',
          h: sequence.map( tabNum => ( {
            t: 'li',
            h: {
              t: 'label',
              c: 'tab' + tabNum + '__label',
              for: 'tab' + tabNum,
              h: tabNum,
            },
          } ) ),
        },
      ],
    } ) );

    tabs.append( V.cN( {
      t: 'content',
      h: sequence.map( function placeForm( tabNum ) {
        const dataset = V.castJson( this.data[ 's' + tabNum] );
        return {
          c: 's-calc-tab-content tab-content tab' + tabNum + '__content',
          h: [
            form( tabNum, dataset, /* exclude: */ ['SITE'] ),
            resultsSOM( tabNum ),
            resultsN( tabNum ),
            resultsC( tabNum ),
          ],
        };
      }, { data: data } ),

    } ) );

    const tabsWrapper = V.cN( {
      c: 'tabs-wrapper w-full',
      h: tabs,
    } );

    return tabsWrapper;
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
            FCAP: 0.4,
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

    formNumber ? formNumber = '-' + formNumber : formNumber = '';

    const input = ( $inputElem, fieldTitle ) => ( {
      c: 's-calc-input-wrapper',
      h: [
        {
          t: 'label',
          c: 's-calc-input-label',
          for: 's-calc-input__' + fieldTitle,
          h: SoilCalculator.getFieldDisplayName( fieldTitle, locale ),
        },
        $inputElem,
      ],
    } );

    const inputNum = ( val, fieldTitle ) => {
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
          input: handleDatapointChange,
        },
        v: val === -1 ? 0 : val,
      } );
      return input( $inputNumObj, fieldTitle );
    };

    const inputDropID = ( val, fieldTitle ) => {

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

      $inputDropElem.prepend( new Option(
        V.getString( ui.notSelected ),
        'none',
        false,
        val == -1 ? true : false,
      ) );

      return input( $inputDropElem, fieldTitle );
    };

    const inputRadio = ( val, fieldTitle ) => {
      const $inputRadioElem = V.cN( {
        c: 's-calc-input-radio-wrapper',
        h: [
          {
            t: 'input',
            c: 's-calc-input-radio',
            i: 's-calc-input-' + fieldTitle + '_1',
            a: {
              type: 'radio',
              name: fieldTitle,
              checked: val ? true : undefined,
            },
            e: {
              change: handleDatapointChange,
            },
            v: 'true',
          },
          {
            t: 'label',
            c: 's-calc-input-radio-label',
            for: 's-calc-input-' + fieldTitle + '_1',
            h: V.getString( ui.yes ),
          },
          {
            t: 'input',
            c: 's-calc-input-radio',
            i: 's-calc-input-' + fieldTitle + '_2',
            a: {
              type: 'radio',
              name: fieldTitle,
              checked: val ? undefined : true,
            },
            e: {
              change: handleDatapointChange,
            },
            v: 'false',
          },
          {
            t: 'label',
            c: 's-calc-input-radio-label',
            for: 's-calc-input-' + fieldTitle + '_1',
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
          h: SoilCalculator.getFieldDisplayName( section + '_' + field, locale ),
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
        name: Object.keys( data )[0] + formNumber,
      },
      c: 's-calc-form w-full',
      h: Object.keys( data ).map( section => ( {
        c: 's-calc-form__section',
        h: [
          {
            c: 's-calc-form__section-title font-bold',
            h: SoilCalculator.getFieldDisplayName( section, locale ), // + formNumber.replace( '-', ' ' ),
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

  /*
  function saveBtn() {
    return V.cN( {
      c: 's-calc-safe',
      h: V.getString( ui.safeDataset ),
      k: handleSaveDataset,
    } );
  }
  */

  function content( data ) {
    return [
      CanvasComponents.card( totalBalance(), V.getString( ui.soilBalanceTitle ) ),
      CanvasComponents.card( cropSequence( data ), V.getString( ui.cropSequenceTitle ) ),
      CanvasComponents.card( siteData( data ), '' ),
      // resultsSOM(),
      // resultsN(),
      // resultsC(),
      // saveBtn(),
    ];
  }

  /* ================== public methods ================= */

  function drawWidgetContent( data ) {
    V.setNode( '.s-calc-widget', '' );
    V.setNode( '.s-calc-widget', content( data ) );
    handleDatapointChange();
  }

  function widget() {
    return V.cN( {
      c: 's-calc-widget w-full',
      h: content(),
    } );
  }

  return {
    widget: widget,
    drawWidgetContent: drawWidgetContent,
  };

} )();
