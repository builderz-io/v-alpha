const SoilCalculatorComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for the soil calculator
   *
   */

  'use strict';

  V.setStyle( {
    's-calc-wrapper': {
      height: '80vh',
    },
    // 's-calc-input-wrapper__CROP_ID': {
    //   display: 'none !important',
    // },
    // 's-calc-input-wrapper__ORG_ID': {
    //   display: 'none !important',
    // },
    's-calc-form': {
      'height': '40vh',
      'overflow': 'scroll',
      'border-radius': '5px',
      'background': 'lightgreen',
    },
    's-calc-results': {
      'border-radius': '5px',
      'background': 'lightblue',
      'margin-bottom': '1rem',
    },
    's-calc-form__section': {
      padding: '1.5rem',
    },
    's-calc-input-wrapper': {
      'display': 'flex',
      'justify-content': 'space-around',
      'padding': '5px',
    },
    's-calc-input-label': {
      width: '50px',
    },
    's-calc-form__section-field-single': {
      padding: '0 20px',
    },
    's-calc-form__section-field-group': {
      padding: '10px 20px',
    },
    's-calc-input-radio-wrapper': {
      'display': 'flex',
      'justify-content': 'space-around',
      'width': '60%',
    },
    's-calc-input-select': {
      width: '60%',
      border: 'none',
    },
  } );

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      yes: 'yes',
      no: 'no',
      notSelected: 'none selected',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ===================== handlers ==================== */

  function handleCalcUpdate() {

    const newDataset = getNewDataset();

    if ( !newDataset ) { return }

    SoilCalculator
      .getResults( newDataset )
      .then( res => {
        console.log( 'Calculation Results: ', res );
        setResults( res );
      } );
  }

  function getNewDataset() {
    const _ = document.forms.calcvalues.elements;

    if ( !validateNewDataset( _ ) ) { return }

    const __ = SoilCalculator.getSchema( 'request' );

    __.SITE.CN = Number( _.SITE_CN.value );
    __.SITE.FCAP = Number( _.SITE_FCAP.value );
    __.SITE.PCIP = Number( _.SITE_PCIP.value );
    __.SITE.PCIP_MP = Number( _.SITE_PCIP_MP.value );
    __.SITE.N.DEP = Number( _.N_DEP.value );

    __.CROP.ID = Number( _.CROP_ID.value );

    __.FTLZ.ORG.ID = Number( _.ORG_ID.value );
    __.FTLZ.ORG.QTY = Number( _.ORG_QTY.value );

    __.BMASS.MP.QTY = Number( _.MP_QTY.value );
    __.BMASS.MP.HVST = ( _.MP_HVST.value === 'true' );

    __.BMASS.SP.QTY = Number( _.SP_QTY.value );
    __.BMASS.SP.HVST = ( _.SP_HVST.value === 'true' );

    console.log( 'New Dataset: ', __ );

    /* return the new dataset */

    return __;

  }

  function setResults( res ) {
    V.getNodes( '.s-calc-result' ).forEach( $elem => {
      $elem.innerText = '';
    } );

    const prefix = '#s-calc-result__';

    for ( const section in res.results ) {
      for ( const field in res.results[section] ) {
        if ( typeof res.results[section][field] == 'object' ) {
          for ( const subField in res.results[section][field] ) {
            const fieldString = section + '_' + field + '_' + subField;
            const value = res.results[section][field][subField].toFixed( 1 );
            V.setNode( prefix + fieldString, value );
          }
        }
        else {
          const fieldString = section + '_' + field;
          const value = res.results[section][field].toFixed( 1 );
          V.setNode( prefix + fieldString, value );
        }
      }
    }
  }

  function validateNewDataset( _ ) {
    if(
      _.CROP_ID.value === 'none'
      || _.ORG_ID.value === 'none'
      || !_.MP_QTY.value
      || ! _.ORG_QTY.value
    ) {
      return false;
    }

    return true;

  }

  /* ================== private methods ================= */

  function rowObj( row ) {
    return {
      t: 'tr',
      c: 'fs-l',
      h: [
        {
          t: 'td',
          h: row,
        },
        {
          t: 'td',
          i: 's-calc-result__' + row,
          c: 's-calc-result td-right txt-right break-words',
          h: '',
        },
      ],
    };
  }

  function resultsSOM() {
    return {
      c: 's-calc-results s-calc-results__som',
      h: {
        t: 'table',
        c: 'w-full pxy',
        h: ['SOM_LOSS', 'SOM_SUPP', 'SOM_BAL_N', 'SOM_BAL_C'].map( row => rowObj( row ) ),
      },
    };
  }

  function resultsN() {
    return {
      c: 's-calc-results s-calc-results__n',
      h: {
        t: 'table',
        c: 'w-full pxy',
        h: ['N_PB', 'N_FIX', 'N_DEP', 'N_NYR', 'N_CR', 'N_FTLZ_ORG', 'N_FTLZ_REM'].map( row => rowObj( row ) ),
      },
    };
  }

  function resultsC() {
    return {
      c: 's-calc-results s-calc-results__c',
      h: {
        t: 'table',
        c: 'w-full pxy',
        h: ['C_CR', 'C_FTLZ_REM'].map( row => rowObj( row ) ),
      },
    };
  }

  function form( data ) {

    if ( !data ) {
      data = SoilCalculator.getSchema( 'request' );
    }

    const input = ( section, key, $inputElem ) => ( {
      c: 's-calc-input-wrapper s-calc-input-wrapper__' + section + '_' + key,
      h: [
        {
          t: 'label',
          c: 's-calc-input-label',
          for: 's-calc-input-' + section + '_' + key,
          h: V.getString( key ),
        },
        $inputElem,
      ],
    } );

    const inputNum = ( section, key, val ) => {
      const $inputNumObj = V.cN( {
        t: 'input',
        c: 's-calc-input-number',
        i: 's-calc-input-' + section + '_' + key,
        a: {
          type: 'number',
          step: 'any',
          min: '0',
          name: section + '_' + key,
        },
        e: {
          input: handleCalcUpdate,
        },
        v: val === -1 ? 0 : val,
      } );
      return input( section, key, $inputNumObj );
    };

    const inputDropID = ( section, key, val ) => {

      const menuJson = section == 'CROP'
        ? SoilCalculator.getCrops()
        : SoilCalculator.getFertilizers();

      const $inputDropElem = V.cN( {
        t: 'select',
        c: 's-calc-input-select',
        i: 's-calc-input-' + section + '_' + key,
        a: {
          name: section + '_' + key,
        },
        e: {
          change: handleCalcUpdate,
        },
        h: menuJson.map( option => ( {
          t: 'option',
          v: option.ID,
          a: {
            selected: option.ID == val ? true : undefined,
          },
          h: option.NAME,
        } ) ),
      } );

      $inputDropElem.prepend( new Option(
        V.getString( ui.notSelected ),
        'none',
        false,
        val == -1 ? true : false,
      ) );

      return input( section, key, $inputDropElem );
    };

    const inputRadio = ( section, key, val ) => {
      const $inputRadioElem = V.cN( {
        c: 's-calc-input-radio-wrapper',
        h: [
          {
            t: 'input',
            c: 's-calc-input-radio',
            i: 's-calc-input-' + section + '-' + key + '_1',
            a: {
              type: 'radio',
              name: section + '_' + key,
              checked: val ? true : undefined,
            },
            e: {
              change: handleCalcUpdate,
            },
            v: 'true',
          },
          {
            t: 'label',
            c: 's-calc-input-radio-label',
            for: 's-calc-input-' + section + '-' + key + '_1',
            h: V.getString( ui.yes ),
          },
          {
            t: 'input',
            c: 's-calc-input-radio',
            i: 's-calc-input-' + section + '-' + key + '_2',
            a: {
              type: 'radio',
              name: section + '_' + key,
              checked: val ? undefined : true,
            },
            e: {
              change: handleCalcUpdate,
            },
            v: 'false',
          },
          {
            t: 'label',
            c: 's-calc-input-radio-label',
            for: 's-calc-input-' + section + '-' + key + '_1',
            h: V.getString( ui.no ),
          },
        ],
      } );
      return input( section, key, $inputRadioElem );
    };

    const templates = SoilCalculator.getSchema( 'templates' )( inputNum, inputRadio, inputDropID );

    const fieldSingle = ( section, field ) => V.cN( {
      c: 's-calc-form__section-field-single',
      h: templates[section][field]( section, field, data[section][field] ),
    } );

    const fieldGroup = ( section, field ) => V.cN( {
      c: 's-calc-form__section-field-group',
      h: [
        {
          c: 's-calc-form__section-field-group-title',
          h: field,
        },
        {
          c: 's-calc-form__section-field-group-fields',
          h: Object.keys( data[section][field] )
            .map( subField => templates[section][field][subField]( field, subField, data[section][field][subField] ) ),
        },
      ],
    } );

    const $form = V.cN( {
      t: 'form',
      a: {
        name: 'calcvalues',
      },
      c: 's-calc-form',
      h: Object.keys( data ).map( section => ( {
        c: 's-calc-form__section',
        h: [
          {
            c: 's-calc-form__section-title',
            h: section,
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

  function content( data ) {
    return [
      resultsSOM(),
      resultsN(),
      resultsC(),
      form( data ),
    ];
  }

  /* ================== public methods ================= */

  function drawContent( data ) {
    V.setNode( '.s-calc-wrapper', '' );
    V.setNode( '.s-calc-wrapper', content( data ) );
    handleCalcUpdate();
  }

  function wrapper( data ) {
    return V.cN( {
      c: 's-calc-wrapper w-full',
      h: content( data ),
    } );
  }

  return {
    wrapper: wrapper,
    drawContent: drawContent,
  };

} )();
