/* eslint-disable no-unused-vars, require-await */

const SoilCalculator = ( () => {

  /**
   * An API to calculate the soil organic matter loss and supply,
   * according to crop planted, fertilizer used, biomass harvested, etc.
   *
   * @returns { Object } - Dataset including all inputs, parameters and results
   * @author of calculator model - Christopher Brock
   * @author of code - Philipe Achille Villiers @ Value Instrument
   * @version 0.2.0
   */

  /* setup module state */

  const STATE = {};

  /* fetch crop and fertilizer parameters */

  let crops, fertilizers;

  // provide two parameter sets each for local dev w/o using express server
  /*
    crops = [
    {
      ID: 1004,
      NAME: 'Winter rye',
      LS: 0,
      N: {
        BFN: 0,
        NYR: 0,
      },
      MP: {
        DM: 0.86,
        C: 0.445,
        N: 0.0198,
      },
      SP: {
        DM: 0.86,
        C: 0.46,
        N: 0.00495,
      },
      LIT: {
        DM: 0,
        C: 0,
        N: 0,
      },
      STB: {
        DM: 0.86,
        C: 0.46,
        N: 0.00495,
      },
      RTS: {
        DM: 1,
        C: 0.4,
        N: 0.0088,
      },
      RATIO: {
        SPMP: 1.3,
        LITMP: 0,
        STBMP: 0.261904761904762,
        RTSMP: 0.733333333333334,
      },
    },
    {
      ID: 1034,
      NAME: 'Potato',
      LS: 0,
      N: {
        BFN: 0,
        NYR: -40,
      },
      MP: {
        DM: 0.22,
        C: 0.42,
        N: 0.0154,
      },
      SP: {
        DM: 0.4,
        C: 0.4,
        N: 0.0099,
      },
      LIT: {
        DM: 0,
        C: 0,
        N: 0,
      },
      STB: {
        DM: 0.4,
        C: 0.4,
        N: 0.0099,
      },
      RTS: {
        DM: 1,
        C: 0.4,
        N: 0.0253,
      },
      RATIO: {
        SPMP: 0,
        LITMP: 0,
        STBMP: 0.3,
        RTSMP: 0.101010101010101,
      },
    },
  ];
    fertilizers = [
    {
      ID: 1041,
      NAME: 'Rotten cattle stable manure',
      DM: 0.25,
      C: 0.4,
      N: 0.025,
      NAV: 0.1982785117,
    },
    {
      ID: 1061,
      NAME: 'High N straw (grain legumes, rape, maize)',
      DM: 0.86,
      C: 0.46,
      N: 0.012,
      NAV: 0.1013568207,
    },
  ];
  */

  const sourceCrop = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/farm/soil-calculator/parameter/crops.json`;
  const sourceFtlz = `${ V.getSetting( 'sourceEndpoint' ) }/plugins/src/farm/soil-calculator/parameter/fertilizers.json`;

  // we may not need to await the JSON file loading

  Promise.all( [
    V.getData( '', sourceCrop, 'api' ),
    V.getData( '', sourceFtlz, 'api' ),
  ] ).then( all => {
    crops = all[0].data[0];
    fertilizers = all[1].data[0];
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

  function castInputs( req ) {

    /**
     * @arg { Object } req - Request, as in data provided by user, e.g. plot data
     * @returns { Object } inputs - valid parameter set to run calculations, plus placeholders (-1) for mixins
     */

    // WIP: overwrites req with a parameter set for local dev
    // TODO: run validations on req object and enforce a full set (e.g adding BMASS.LIT.QTY equals -1)

    /*
    req = {
      SITE: {
        CN: 10,
        FCAP: 40,
        PCIP: 650,
        PCIP_MP: 0.5,
        N: {
          DEP: 20,
        },
      },
      CROP: {
        ID: 1004,
        NAME: 'Winter rye',
      },
      FTLZ: {
        ORG: {
          ID: 1041,
          QTY: 30,
          T: 2,
        },
      },
      BMASS: {
        MP: {
          QTY: 4,
          EXEC: true,
        },
        SP: {
          QTY: -1,
          EXEC: true,
        },
      },
    };
    */

    /* mixin the full set of crop and fertilizer parameters */
    Object.assign( req.CROP, getCrop( req.CROP.ID || req.CROP.NAME ) );
    Object.assign( req.FTLZ.ORG, getFertilizer( req.FTLZ.ORG.ID || req.FTLZ.ORG.NAME ) );

    /* return all as "inputs" */

    const inputs = {
      inputs: req,
    };

    return inputs;
  }

  function runCalculations( _ ) {

    /**
     * @arg { Object } _ - all inputs needed for running the calculations ( sourced from STATE )
     * @returns { Object } results - set of all results
     */

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

    const nPb = toKilo( nPlantBiomass( _ ) );
    const nFtlzOrg = toKilo( nFertilizerOrganic( _ ) );
    const nFix = nFixation( _, nPb, nFtlzOrg );
    const nDep = nDeposition( _ );
    const nNyr = nNotYieldRelated( _ );
    const nCr = toKilo( nCropResidues( _ ) );
    const nFtlzRem = toKilo( nFertilizerRemaining( _ ) );

    /* C calculations */

    const cCr = toKilo( cCropResidues( _ ) );
    const cFtlzRem = toKilo( cFertilizerRemaining( _ ) );

    /* soil organic matter calculations */

    const somLoss = soilOrganicMatterLoss( _, nFtlzOrg, nPb, nFix, nDep, nNyr );
    const somSupp = soilOrganicMatterSupp( _, nCr, nFtlzRem, cCr, cFtlzRem );

    const somBalC = soilOrganicMatterBalanceC( somLoss, somSupp );
    const somBalN = soilOrganicMatterBalanceN( _, somLoss, somSupp );

    /* cast and return results object */

    const results = {
      results: {
        SOM: {
          LOSS: somLoss,
          SUPP: somSupp,
          BAL: {
            C: somBalC,
            N: somBalN,
          },
        },
        N: {
          PB: nPb,
          FIX: nFix,
          DEP: nDep,
          NYR: nNyr,
          CR: nCr,
          FTLZ: {
            ORG: nFtlzOrg,
            REM: nFtlzRem,
          },
        },
        C: {
          CR: cCr,
          FTLZ: {
            REM: cFtlzRem,
          },
        },
      },
    };

    return results;
  }

  /* ==============  Private Methods Calculations ================= */

  function mixins( _ ) {

    /**
     * nLoss:
     * - divided by 10 in order to account for mm vs. cm in PCIP
     * - 90 is cm below ground
     */

    return {
      spQty: _.BMASS.MP.QTY * _.CROP.RATIO.SPMP,
      litQty: _.BMASS.MP.QTY * _.CROP.RATIO.LITMP,
      stbQty: _.BMASS.MP.QTY * _.CROP.RATIO.STBMP,
      rtsQty: _.BMASS.MP.QTY * _.CROP.RATIO.RTSMP,
      nLoss: ( _.SITE.PCIP / ( _.SITE.PCIP + _.SITE.FCAP / 10 ) )**90,
    };
  }

  function cnQuantities( _, which, total ) {
    return ( total || !_.BMASS.MP.EXEC ? _.BMASS.MP.QTY  * _.CROP.MP.DM  * _.CROP.MP[which] : 0 )
         + ( total || !_.BMASS.SP.EXEC ? _.BMASS.SP.QTY  * _.CROP.SP.DM  * _.CROP.SP[which] : 0 )
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

  function nFixation( _, nPb, nFtlzOrg ) {

    const a = nPb * _.CROP.N.BFN - nFtlzOrg;
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
    return _.FTLZ.ORG.QTY * _.FTLZ.ORG.DM * _.FTLZ.ORG.N * ( 1-_.FTLZ.ORG.NAV );
  }

  function cFertilizerRemaining( _ ) {
    return _.FTLZ.ORG.QTY * _.FTLZ.ORG.DM * _.FTLZ.ORG.C;
  }

  function soilOrganicMatterLoss( _, nFtlzOrg, nPb, nFix, nDep, nNyr ) {
    return ( nPb - nFix - nFtlzOrg - nDep + nNyr ) * _.SITE.CN;
  }

  function soilOrganicMatterSupp( _, nCr, nFtlzRem, cCr, cFtlzRem ) {

    const a = ( nCr + nFtlzRem ) * _.SITE.CN;
    const b = cCr + cFtlzRem;

    return Math.min( a, b );
  }

  function soilOrganicMatterBalanceC( somLoss, somSupp ) {
    return somSupp - somLoss;
  }

  function soilOrganicMatterBalanceN( _, somLoss, somSupp ) {
    return ( somSupp - somLoss ) / _.SITE.CN;
  }

  /* =================  Private Methods Helpers =================== */

  function getParameters( array, which ) {
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

  function getCrops() {
    return crops;
  }

  function getFertilizers() {
    return fertilizers;
  }

  async function getResults( req ) {

    /* add timestamps to state */
    Object.assign( STATE, castTime() );

    /* add input data to state */
    Object.assign( STATE, castInputs( req ) );

    /* run all calculations and add results to state */
    Object.assign( STATE, runCalculations( STATE.inputs ) );

    /* return state */
    return STATE;
  }

  return {
    getCrop: getCrop,
    getFertilizer: getFertilizer,
    getCrops: getCrops,
    getFertilizers: getFertilizers,
    getResults: getResults,
  };

} )();
