/* eslint-disable no-unused-vars, require-await */

const SoilCalculator = ( () => {

  /**
   * API to calculate the soil organic matter loss and supply for one data point,
   * according to crop planted, fertilizer used, biomass harvested, etc.
   *
   * @returns { Object } - Dataset including all inputs, parameters and results
   * @author of calculator model - Christopher Brock
   * @author of code - Philipe Achille Villiers @ Value Instrument
   * @version 0.3.0
   *
   * Dependencies: V Core module is currently used to fetch the JSON files, but could easily be omitted
   */

  /* setup module state */

  let STATE;

  /* fetch crop and fertilizer parameters, fetch legend-file (includes translations) */

  let crops, fertilizers, soilTypes, legends;

  const sourceCrop = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/farm/soil-calculator/parameter/crops.json`;
  const sourceFtlz = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/farm/soil-calculator/parameter/fertilizers.json`;
  const sourceStyp = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/farm/soil-calculator/parameter/soil-types.json`;
  const sourceLegend = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/farm/soil-calculator/parameter/schemas-and-legends.json`;

  // we may not need to await the JSON file-loading

  Promise.all( [
    V.getData( '', sourceCrop, 'api' ),
    V.getData( '', sourceFtlz, 'api' ),
    V.getData( '', sourceStyp, 'api' ),
    V.getData( '', sourceLegend, 'api' ),
  ] ).then( all => {
    crops = all[0].data[0];
    fertilizers = all[1].data[0];
    soilTypes = all[2].data[0];
    legends = all[3].data[0];
  } );

  /* ======================  Private Methods  ===================== */

  function castTime() {

    /**
     * @returns { Object } time - timestamps for use in returned state
     */

    const time = {
      time: {
        timestamp: new Date(),
        unix: Date.now(),
      },
    };

    return time;
  }

  async function castPcip( cropData ) {

    /**
     * @returns { Object } precipitation - amount of precip on a crop in the given time frame
     */

    const currentStartDate = cropData.datapoint.DATE.SOWN;
    const currentEndDate = cropData.datapoint.DATE.HVST;

    if ( !currentStartDate || !currentEndDate ) {
      return;
    }

    const previousStartDate = cropData.datapoint.PCIPAPI.DATE.FIRST;
    const previousEndDate = cropData.datapoint.PCIPAPI.DATE.LAST;

    /* return the existing pcip api data ... */

    if (
      previousStartDate == currentStartDate
      && previousEndDate == currentEndDate
    ) {
      return {
        PCIPAPI: cropData.datapoint.PCIPAPI,
      };
    }

    /* ... or fetch and return new pcip api data */

    const requestParams = {
      lat: V.getState( 'active' ).lastLngLat[1],
      lng: V.getState( 'active' ).lastLngLat[0],
      startDate: currentStartDate,
      endDate: currentEndDate,
      maxDist: 50000, // in meter
    };

    try {
      const pcipData = await PcipCalculator.getPcip( requestParams );
      console.log( 'Calculated Precipitation:', pcipData );
      return pcipData;
    }
    catch ( error ) {
      console.error( 'Error calculating precipitation:', error );

    }
  }

  function castInputs( datapoint, prevDatapoint ) {

    /**
     * @arg { Object } datapoint - Request, as in data provided by user, e.g. CROP.ID
     * @returns { Object } inputs - valid parameter set to run calculations, plus placeholders (-1) for mixins
     */

    /* clone request */
    const clone = JSON.parse( JSON.stringify( datapoint ) );

    /* mixin the full set of crop, fertilizer and soil type parameters into clone */
    Object.assign( clone.SITE.STYP, getSoilType( clone.SITE.STYP.ID || clone.SITE.STYP.NAME ) );
    Object.assign( clone.CROP, getCrop( clone.CROP.ID || clone.CROP.NAME ) );

    for ( let i = 1; i <= SoilCalculatorComponents.getNumFertilizerGroups; ++i ) {
      if ( !clone.FTLZ[`F${i}`] ) {
        clone.FTLZ[`F${i}`] = {};
        Object.assign( clone.FTLZ[`F${i}`], getFertilizer( 5000 ) );
        continue;
      }
      Object.assign( clone.FTLZ[`F${i}`], getFertilizer( clone.FTLZ[`F${i}`].ID || clone.FTLZ[`F${i}`].NAME ) );
    }

    /* do the same for the previous datapoint */
    let clonePrev = null;

    if ( prevDatapoint ) {
      clonePrev = JSON.parse( JSON.stringify( prevDatapoint ) );
      Object.assign( clonePrev.SITE.STYP, getSoilType( clonePrev.SITE.STYP.ID || clonePrev.SITE.STYP.NAME ) );
      Object.assign( clonePrev.CROP, getCrop( clonePrev.CROP.ID || clonePrev.CROP.NAME ) );

      for ( let i = 1; i <= SoilCalculatorComponents.getNumFertilizerGroups; ++i ) {
        if ( !clonePrev.FTLZ[`F${i}`] ) {
          clonePrev.FTLZ[`F${i}`] = {};
          Object.assign( clonePrev.FTLZ[`F${i}`], getFertilizer( 5000 ) );
          continue;
        }
        Object.assign( clonePrev.FTLZ[`F${i}`], getFertilizer( clonePrev.FTLZ[`F${i}`].ID || clonePrev.FTLZ[`F${i}`].NAME ) );
      }

    }

    // TODO: run validations on clone and enforce a full set (e.g adding BMASS.LIT.QTY equals -1)

    /* return all as "inputs" */

    return {
      inputs: clone,
      prev: clonePrev,
    };
  }

  function castResults( _, _prev ) {

    /**
     * @arg { Object } _ - all inputs needed for running the calculations ( sourced from STATE )
     * @returns { Object } results - set of all results
     */

    /* clone schema */
    const __ = JSON.parse( JSON.stringify( getSchema( 'results' ) ) );

    /**
     * mixins:
     * - Quantity of Harvest Side Product, if not provided
     * - Quantity of Litterfall, Stubble and Roots
     * - N loss on site
     */

    const m = mixins( _ );

    if ( !_.BMASS.SP.QTY ) {
      _.BMASS.SP.QTY = m.spQty;
    }

    _.BMASS.LIT = { QTY: m.litQty };
    _.BMASS.STB = { QTY: m.stbQty };
    _.BMASS.RTS = { QTY: m.rtsQty };
    _.SITE.N.LOSS = m.nLoss;

    /* N calculations */

    __.N.PB = toKilo( nPlantBiomass( _ ) );

    __.N.FTLZ.SUM = toKilo( nFertilizers( _ ) );
    __.N.FTLZ.GRS = toKilo( nFertilizerFromPrev( _, _prev ) );
    __.N.FTLZ.REM = toKilo( nFertilizerRemaining( _ ) );
    __.N.FIX = nFixation( _, __.N );
    __.N.DEP = nDeposition( _ );
    __.N.NYR = nNotYieldRelated( _ );
    __.N.CR = toKilo( nCropResidues( _ ) );

    /* C calculations */

    __.C.CR = toKilo( cCropResidues( _ ) );
    __.C.FTLZ.REM = toKilo( cFertilizerRemaining( _ ) );

    /* soil organic matter calculations */

    __.SOM.LOSS = soilOrganicMatterLoss( _, __.N );
    __.SOM.SUPP = soilOrganicMatterSupp( _, __.N, __.C );

    __.SOM.BAL.C = soilOrganicMatterBalanceC( __.SOM );
    __.SOM.BAL.N = soilOrganicMatterBalanceN( _, __.SOM );

    /* cast and return results object */

    const results = {
      results: __,
    };

    return results;
  }

  /* ==============  Private Methods Calculations ================= */

  function mixins( _ ) {

    /**
     * nLoss:
     * is actually not "loss", but available N after "loss" (due to "1 - ..." )
     * - divided by 10 in order to account for cm in FCAP vs. mm in PCIP.QTY or PCIPAPI.MM
     * - 90 is cm below ground
     */

    return {
      spQty: _.BMASS.MP.QTY * _.CROP.RATIO.SPMP,
      litQty: _.BMASS.MP.QTY * _.CROP.RATIO.LITMP,
      stbQty: _.BMASS.MP.QTY * _.CROP.RATIO.STBMP,
      rtsQty: _.BMASS.MP.QTY * _.CROP.MP.DM * _.CROP.RATIO.RTSMP,
      nLoss: _.PCIPAPI.MM != -1 ? pcipFromAPI( _ ) : pcipFallbackFromSITE( _ ),
    };
  }

  function pcipFallbackFromSITE( _ ) {
    return 1 - ( ( _.SITE.PCIP.QTY * _.SITE.PCIP.MUL )
           / ( ( _.SITE.PCIP.QTY * _.SITE.PCIP.MUL ) + _.SITE.STYP.FCAP / 10 ) )**90;
  }

  function pcipFromAPI( _ ) {
    return 1 - ( _.PCIPAPI.MM / (  _.PCIPAPI.MM + _.SITE.STYP.FCAP / 10 ) )**90;
  }

  function cnQuantities( _, which, total ) {
    return ( total || !_.BMASS.MP.HVST ? _.BMASS.MP.QTY  * _.CROP.MP.DM  * _.CROP.MP[which] : 0 )
         + ( total || !_.BMASS.SP.HVST ? _.BMASS.SP.QTY  * _.CROP.SP.DM  * _.CROP.SP[which] : 0 )
         + _.BMASS.LIT.QTY * _.CROP.LIT.DM * _.CROP.LIT[which]
         + _.BMASS.STB.QTY * _.CROP.STB.DM * _.CROP.STB[which]
         + _.BMASS.RTS.QTY * _.CROP.RTS.DM * _.CROP.RTS[which];
  }

  function nPlantBiomass( _ ) {
    return cnQuantities( _, 'N', 'total' );
  }

  function nCropResidues( _ ) {
    return cnQuantities( _, 'N' );
  }

  function cCropResidues( _ ) {
    return cnQuantities( _, 'C' );
  }

  function nFertilizers( _ ) {
    let sum = 0;

    for ( let i = 1; i <= SoilCalculatorComponents.getNumFertilizerGroups; ++i ) {
      if ( !_.FTLZ[`F${i}`] ) {continue}
      sum += _.FTLZ[`F${i}`].QTY
      * _.FTLZ[`F${i}`].DM
      * _.FTLZ[`F${i}`].N
      * _.FTLZ[`F${i}`].NAV
      * _.SITE.N.LOSS;
    }

    return sum;
  }

  function nFertilizerFromPrev( _, _prev ) {

    if ( !_prev ) { return 0 }

    let sum = 0;

    sum += !_prev.BMASS.MP.HVST
      ? _prev.BMASS.MP.QTY
        * _prev.CROP.MP.DM
        * _prev.CROP.MP.N
        * ( 1.6674 * ( _prev.CROP.MP.C / _prev.CROP.MP.N )**-0.768 )
        * _.SITE.N.LOSS
      : 0;

    sum += !_prev.BMASS.SP.HVST
           && _prev.CROP.SP.N
      ? _prev.BMASS.SP.QTY
        * _prev.CROP.SP.DM
        * _prev.CROP.SP.N
        * ( 1.6674 * ( _prev.CROP.SP.C / _prev.CROP.SP.N )**-0.768 )
        * _.SITE.N.LOSS
      : 0;

    return sum;
  }

  function nFixation( _, N ) {

    const a = N.PB * _.CROP.LS * _.CROP.N.BNF - N.FTLZ.SUM - N.FTLZ.GRS;
    const b = 0;

    return Math.max( a, b );
  }

  function nDeposition( _ ) {
    return _.SITE.N.DEP;
  }

  function nNotYieldRelated( _ ) {
    return _.CROP.N.NYR;
  }

  function nFertilizerRemaining( _ ) {
    // @TODO(fertilizers): handle the multiple fertilizers?
    return _.FTLZ.F1.QTY
         * _.FTLZ.F1.DM
         * _.FTLZ.F1.N
         * ( 1-_.FTLZ.F1.NAV );
  }

  function cFertilizerRemaining( _ ) {
    // @TODO(fertilizers): handle the multiple fertilizers?
    return _.FTLZ.F1.QTY * _.FTLZ.F1.DM * _.FTLZ.F1.C;
  }

  function soilOrganicMatterLoss( _, N ) {
    return ( N.PB - N.FIX - N.FTLZ.SUM - N.FTLZ.GRS - N.DEP + N.NYR ) * _.SITE.CN;
  }

  function soilOrganicMatterSupp( _, N, C ) {

    const a = ( N.CR + N.FTLZ.REM ) * _.SITE.CN;
    const b = C.CR + C.FTLZ.REM;

    return Math.min( a, b );
  }

  function soilOrganicMatterBalanceC( SOM ) {
    return SOM.SUPP - SOM.LOSS;
  }

  function soilOrganicMatterBalanceN( _, SOM ) {
    return ( SOM.SUPP - SOM.LOSS ) / _.SITE.CN;
  }

  function sequenceTotalCandN( sequence, locale ) {
    let divisor = 0, cTotal = 0, nTotal = 0;

    for ( const key in sequence ) {
      if (
        ['undefined', 'number'].includes( typeof sequence[key].datapoint )
      ) {
        continue;
      }
      divisor += 1;
      cTotal += sequence[key].results.SOM.BAL.C;
      nTotal += sequence[key].results.SOM.BAL.N;
    }

    if ( !divisor ) { return }

    const schema = JSON.parse( JSON.stringify( getSchema( 'results' ) ) );

    schema.T.BAL.C = cTotal / divisor;
    schema.T.BAL.N = nTotal / divisor;
    schema.T.UNIT = getFieldString( 'T', locale );

    return schema;
  }

  function yearlyTotalCandN( years, locale ) {
    let divisor = 0, cTotal = 0, nTotal = 0;

    for ( const year in years ) {
      if ( years[year].T && years[year].T.BAL ) {
        const { C, N } = years[year].T.BAL;
        if ( typeof C === 'number' && typeof N === 'number' ) {
          cTotal += C;
          nTotal += N;
          divisor++;
        }
      }
    }

    if ( !divisor ) { return }

    const schema = JSON.parse( JSON.stringify( getSchema( 'results' ) ) );

    schema.T.BAL.C = cTotal / divisor;
    schema.T.BAL.N = nTotal / divisor;
    schema.T.UNIT = getFieldString( 'TY', locale );

    return schema;
  }

  /* =================  Private Methods Helpers =================== */

  function getParameters( array, which ) {

    /**
     * @arg { Array } array - crop or fertilizer parameters array
     * @arg { string|number } which - id or name of crop or fertilizer parameters to find
     * @returns { Object } - set of crop or fertilizer parameter according to "which"
     */

    return array.find( function finder( doc ) {
      return isNaN( Number( this ) )
        ? doc.NAME === String( this )
        : doc.ID === Number( this );
    }, which );
  }

  function toKilo( input ) {
    return input * 1000;
  }

  /* ======================  Public Methods  ====================== */

  function getCrop( which ) {
    return getParameters( crops, which );
  }

  function getFertilizer( which ) {
    return getParameters( fertilizers, which );
  }

  function getSoilType( which ) {
    return getParameters( soilTypes, which );
  }

  function getCropName( which, locale ) {
    return getCrop( which )[ 'NAME' + ( locale.includes( 'de' ) ? '_DE' : '' ) ];
  }

  function getFertilizerName( which, locale ) {
    return getFertilizer( which )[ 'NAME' + ( locale.includes( 'de' ) ? '_DE' : '' ) ];
  }

  function getCrops() {

    /**
     * @returns { Array } crops - full array of crop parameters
     */

    return crops;
  }

  function getFertilizers() {

    /**
     * @returns { Array } fertilizers - full array of fertilizer parameters
     */

    return fertilizers;
  }

  function getSoilTypes() {

    /**
     * @returns { Array } soilTypes - full array of soil type parameters
     */

    return soilTypes;
  }

  function getSchema( which ) {

    /**
     * @arg { string } which - which schema is requested
     * @returns { Object } - schema
     */

    return legends[which].schema;
  }

  function getFieldString( fieldTitle, locale, what ) {

    /**
     * @arg { string } fieldTitle - the field to query from the legends file in flattened format, e.g. "BMASS_MP_QTY"
     * @arg { string } locale - the current app locale
     * @returns { string } fieldTitle - the human readable title of a field in app locale
     */

    /*
      from: https://www.30secondsofcode.org/js/s/get
      example: const obj = {
        selector: { to: { val: 'val to select' } },
        target: [1, 2, { a: 'test' }],
      };
      run: get(obj, '.', 'selector.to.val', 'target[0]', 'target[2].a');
      res: ['val to select', 1, 'test']
    */

    const get = ( obj, separator, ...selectors ) =>
      [ ...selectors ].map( s =>
        s
          .replace( /\[([^[\]]*)\]/g, '.$1.' )
          .split( separator )
          .filter( t => t !== '' )
          .reduce( ( prev, cur ) => prev && prev[cur], obj ),
      );

    const requestDisplayName = get( legends.request.legend[locale.substr( 0, 5 )], '_', fieldTitle )[0];

    if ( requestDisplayName ) {
      return what ? requestDisplayName[what] : requestDisplayName.displayName;
    }

    const resultsDisplayName = get( legends.results.legend[locale.substr( 0, 5 )], '_', fieldTitle )[0];

    if ( resultsDisplayName ) {
      return what ? resultsDisplayName[what] : resultsDisplayName.displayName;
    }

    return fieldTitle;

  }

  async function getDatapointResults( cropData, prevDatapoint ) {
    console.log( cropData );

    /**
       * @arg { Object } cropData - Request, as in data provided by user, e.g. CROP.ID, plus previous inputs and results
       * @arg { Object } prevDatapoint - The previous datapoint needed to calc ftlz from green/straw
       * @returns { Object } STATE - API response including all inputs and results
       */

    STATE = {};

    /* add timestamps to state */
    Object.assign( STATE, castTime() );

    /* add input data to state */
    Object.assign( STATE, castInputs( cropData.datapoint, prevDatapoint ) );

    /*add precip*/
    const pcipData = await castPcip( cropData );
    Object.assign( STATE.inputs, pcipData );

    /* run all calculations and add results to state */
    Object.assign( STATE, castResults( STATE.inputs, STATE.prev ) );
    Object.assign( STATE.results, pcipData );

    /* return state */
    return STATE;
  }

  async function getSequenceResults( req, locale ) {
    return sequenceTotalCandN( req, locale );
  }

  async function getYearsAverageResults( req, locale ) {
    return yearlyTotalCandN( req, locale );
  }

  function getAccumulatedSequenceResults( sequences ) {
    const accumulatedValue =  sequences.reduce( ( acc, curr ) => {
      if ( !curr || !curr.BAL || !curr.BAL.C || !curr.BAL.N ) {return acc}
      acc.C += curr.BAL.C;
      acc.N += curr.BAL.N;
      return acc;
    }, { C: 0, N: 0 } );

    return {
      C: accumulatedValue.C / sequences.length,
      N: accumulatedValue.N / sequences.length,
    };
  }

  return {
    getCrop,
    getFertilizer,
    getSoilType,
    getCropName,
    getFertilizerName,
    getCrops,
    getFertilizers,
    getSoilTypes,
    getSchema,
    getFieldString,
    getDatapointResults,
    getSequenceResults,
    getYearsAverageResults,
    getAccumulatedSequenceResults,
  };

} )();
