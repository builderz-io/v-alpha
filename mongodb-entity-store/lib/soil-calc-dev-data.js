/**
 * Sample soil-calculator servicefields for local dev (s1–s24, s31).
 */

function makeSeason( cropId, sow, hvst, turn, mpQty, spQty ) {
  return {
    CROP: { ID: cropId },
    FTLZ: {
      F1: { ID: 5000, QTY: 0, DATE: '' },
      F2: { ID: 5000, QTY: 0, DATE: '' },
      F3: { ID: 5000, QTY: 0, DATE: '' },
      F4: { ID: 5000, QTY: 0, DATE: '' },
      F5: { ID: 5000, QTY: 0, DATE: '' },
    },
    BMASS: {
      // QTY in fresh-matter tonnes per hectare (FM t ha-1)
      MP: { QTY: mpQty != null ? mpQty : 8, HVST: true },
      SP: { QTY: spQty != null ? spQty : 5, HVST: false },
    },
    DATE: {
      SOWN: sow,
      HVST: hvst,
      TURN: turn,
      CUTS: 1,
    },
    PCIPAPI: {
      MM: 420,
      STATION: { ID: -1, NAME: 'Local dev', LAT: 52.52, LON: 13.405 },
      DATE: { FIRST: sow, LAST: hvst },
    },
  };
}

function buildSiteDatapoint() {
  return {
    SITE: {
      STYP: { ID: 2010 },
      CN: 10,
      PCIP: { QTY: 650, MUL: 0.5 },
      N: { DEP: 20 },
    },
  };
}

function buildPlotServicefields() {
  const s1 = makeSeason( 1010, '2022-03-20', '2022-08-25', '2022-08-15', 8, 5 );
  const s2 = makeSeason( 1020, '2023-03-18', '2023-08-22', '2023-08-12', 7, 4 );
  const site = buildSiteDatapoint();

  return {
    s1: JSON.stringify( s1 ),
    s2: JSON.stringify( s2 ),
    s31: JSON.stringify( site ),
  };
}

function buildSecondPlotServicefields() {
  const s1 = makeSeason( 1030, '2022-04-10', '2022-09-05', '2022-08-28', 9, 6 );
  const s2 = makeSeason( 1040, '2023-04-08', '2023-09-01', '2023-08-25', 6, 3 );
  const site = buildSiteDatapoint();

  return {
    s1: JSON.stringify( s1 ),
    s2: JSON.stringify( s2 ),
    s31: JSON.stringify( site ),
  };
}

module.exports = {
  buildPlotServicefields,
  buildSecondPlotServicefields,
  DEV_UPHRASE: 'dev-soil-tester-key',
  DEV_PERSON_FULL_ID: 'Dev Tester #1001',
  DEV_PLOT_FULL_ID: 'Demo Field #2121',
  DEV_PLOT_2_FULL_ID: 'North Field #2122',
};
