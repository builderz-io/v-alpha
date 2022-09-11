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

  let crops, fertilizers, legends;

  const sourceCrop = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/farm/soil-calculator/parameter/crops.json`;
  const sourceFtlz = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/farm/soil-calculator/parameter/fertilizers.json`;
  const sourceLegend = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/farm/soil-calculator/parameter/schemas-and-legends.json`;

  // we may not need to await the JSON file-loading

  Promise.all( [
    V.getData( '', sourceCrop, 'api' ),
    V.getData( '', sourceFtlz, 'api' ),
    V.getData( '', sourceLegend, 'api' ),
  ] ).then( all => {
    crops = all[0].data[0];
    fertilizers = all[1].data[0];
    legends = all[2].data[0];
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

  function castInputs( datapoint, prevDatapoint ) {

    /**
     * @arg { Object } datapoint - Request, as in data provided by user, e.g. CROP.ID
     * @returns { Object } inputs - valid parameter set to run calculations, plus placeholders (-1) for mixins
     */

    /* clone request */
    const clone = JSON.parse( JSON.stringify( datapoint ) );

    /* mixin the full set of crop and fertilizer parameters into clone */
    Object.assign( clone.CROP, getCrop( clone.CROP.ID || clone.CROP.NAME ) );
    Object.assign( clone.FTLZ.ORG, getFertilizer( clone.FTLZ.ORG.ID || clone.FTLZ.ORG.NAME ) );

    /* do the same for the previous datapoint */
    let clonePrev = null;
    if ( prevDatapoint ) {
      clonePrev = JSON.parse( JSON.stringify( prevDatapoint ) );
      Object.assign( clonePrev.CROP, getCrop( clonePrev.CROP.ID || clonePrev.CROP.NAME ) );
      Object.assign( clonePrev.FTLZ.ORG, getFertilizer( clonePrev.FTLZ.ORG.ID || clonePrev.FTLZ.ORG.NAME ) );
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

    __.N.FTLZ.ORG = toKilo( nFertilizerOrganic( _ ) );
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
     * - divided by 10 in order to account for mm vs. cm in PCIP.QTY
     * - 90 is cm below ground
     */

    return {
      spQty: _.BMASS.MP.QTY * _.CROP.RATIO.SPMP,
      litQty: _.BMASS.MP.QTY * _.CROP.RATIO.LITMP,
      stbQty: _.BMASS.MP.QTY * _.CROP.RATIO.STBMP,
      rtsQty: _.BMASS.MP.QTY * _.CROP.MP.DM * _.CROP.RATIO.RTSMP,
      nLoss: 1 - ( ( _.SITE.PCIP.QTY * _.SITE.PCIP.MUL )
             / ( ( _.SITE.PCIP.QTY * _.SITE.PCIP.MUL ) + _.SITE.FCAP / 10 ) )**90,
    };
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

  function nFertilizerOrganic( _ ) {
    return _.FTLZ.ORG.QTY
         * _.FTLZ.ORG.DM
         * _.FTLZ.ORG.N
         * _.FTLZ.ORG.NAV
         * _.SITE.N.LOSS;
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

    const a = N.PB * _.CROP.LS * _.CROP.N.BFN - N.FTLZ.ORG - N.FTLZ.GRS;
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
    return _.FTLZ.ORG.QTY
         * _.FTLZ.ORG.DM
         * _.FTLZ.ORG.N
         * ( 1-_.FTLZ.ORG.NAV );
  }

  function cFertilizerRemaining( _ ) {
    return _.FTLZ.ORG.QTY * _.FTLZ.ORG.DM * _.FTLZ.ORG.C;
  }

  function soilOrganicMatterLoss( _, N ) {
    return ( N.PB - N.FIX - N.FTLZ.ORG - N.FTLZ.GRS - N.DEP + N.NYR ) * _.SITE.CN;
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

  function sequenceTotalCandN( sequence ) {
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

    return {
      T: {
        BAL: {
          C: cTotal / divisor,
          N: nTotal / divisor,
        },
      },
    };
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

    /* see getParameters for comments */
    return getParameters( crops, which );
  }

  function getFertilizer( which ) {

    /* see getParameters for comments */
    return getParameters( fertilizers, which );
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

  function getSchema( which ) {

    /**
     * @arg { string } which - which schema is requested
     * @returns { Object } - schema
     */

    return legends[which].schema;
  }

  function getFieldString( fieldTitle, locale, unit ) {

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

    const requestDisplayName = get( legends.request.legend[locale], '_', fieldTitle )[0];

    if ( requestDisplayName ) {
      return unit ? requestDisplayName.unit : requestDisplayName.displayName;
    }

    const resultsDisplayName = get( legends.results.legend[locale], '_', fieldTitle )[0];

    if ( resultsDisplayName ) {
      return unit ? resultsDisplayName.unit : resultsDisplayName.displayName;
    }

    return fieldTitle;

  }

  async function getDatapointResults( datapoint, prevDatapoint ) {

    /**
       * @arg { Object } datapoint - Request, as in data provided by user, e.g. CROP.ID
       * @arg { Object } prevDatapoint - The previous datapoint needed to calc ftlz from green/straw
       * @returns { Object } STATE - API response including all inputs and results
       */

    STATE = {};

    /* add timestamps to state */
    Object.assign( STATE, castTime() );

    /* add input data to state */
    Object.assign( STATE, castInputs( datapoint, prevDatapoint ) );

    /* run all calculations and add results to state */
    Object.assign( STATE, castResults( STATE.inputs, STATE.prev ) );

    /* return state */
    return STATE;
  }

  async function getSequenceResults( req ) {
    return sequenceTotalCandN( req );
  }

  return {
    getCrop: getCrop,
    getFertilizer: getFertilizer,
    getCropName: getCropName,
    getFertilizerName: getFertilizerName,
    getCrops: getCrops,
    getFertilizers: getFertilizers,
    getSchema: getSchema,
    getFieldString: getFieldString,
    getDatapointResults: getDatapointResults,
    getSequenceResults: getSequenceResults,
  };

} )();
