const FarmComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Farm Plugin
   *
   */

  'use strict';

  const calcState = {
    set: {},
  };

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {

    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ===================== handlers ==================== */

  function handleCalcUpdate() {
    setCalcData();
    setResults();
  }

  function setCalcData( data ) {
    if ( data ) {
      calcState.set = data;
    }
    else {
      calcState.set.one = Number( V.getNode( '#calc-one' ).innerText );
      calcState.set.two = Number( V.getNode( '#calc-two' ).innerText );
    }

    calculate();

  }

  function calculate() {
    calcState.resultA = calcState.set.one + calcState.set.two;
    calcState.resultM = calcState.set.one * calcState.set.two;
  }

  function setResults() {
    V.setNode( '#calc-addition', '' );
    V.setNode( '#calc-addition', calcState.resultA );
    V.setNode( '#calc-multiplication', '' );
    V.setNode( '#calc-multiplication', calcState.resultM );
  }

  /* ================== private methods ================= */

  /* ================== public methods ================= */

  function soilCalculatorContent( data ) {

    if ( data ) {
      setCalcData( data );
    }

    const $table = V.cN( {
      t: 'table',
      c: 'w-full pxy',
      h: [
        {
          t: 'tr',
          c: 'fs-l',
          h: [
            {
              t: 'td',
              h: 'Addition',
            },
            {
              t: 'td',
              i: 'calc-addition',
              c: 'td-right txt-right break-words',
              h: calcState.resultA || '',
            },
          ],
        },
        {
          t: 'tr',
          c: 'fs-l',
          h: [
            {
              t: 'td',
              h: 'Multiplication',
            },
            {
              t: 'td',
              i: 'calc-multiplication',
              c: 'td-right txt-right break-words',
              h: calcState.resultM || '',
            },
          ],
        },
        {
          t: 'tr',
          h: [
            {
              t: 'td',
              h: 'a',
            },
            {
              t: 'td',
              i: 'calc-one',
              c: 'td-right txt-right break-words',
              a: {
                contenteditable: 'true',
              },
              e: {
                input: handleCalcUpdate,
              },
              h: data ? data.one : '',
            },
          ],
        },
        {
          t: 'tr',
          h: [
            {
              t: 'td',
              h: 'b',
            },
            {
              t: 'td',
              i: 'calc-two',
              c: 'td-right txt-right break-words',
              a: {
                contenteditable: 'true',
              },
              e: {
                input: handleCalcUpdate,
              },
              h: data ? data.two : '',
            },
          ],
        },
      ],
    } );

    return $table;

  }

  function soilCalculatorWrapper( $table ) {
    return V.cN( {
      c: 'soil-calculator-wrapper w-full',
      h: $table,
    } );
  }

  return {
    soilCalculatorWrapper: soilCalculatorWrapper,
    soilCalculatorContent: soilCalculatorContent,
  };

} )();
