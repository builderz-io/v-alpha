const MarketplaceDefinitions = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Navigation Items for V Marketplace Plugin
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      localEconomy: 'Local Economy',
      people: 'People',
      businesses: 'Businesses',
      ngos: 'NGO',
      publicSector: 'Public Sector',
      anchors: 'Anchor Institutions',
      networks: 'Networks',
      skills: 'Skills',
      tasks: 'Tasks',
      places: 'Places',
      events: 'Events',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ============== market definitions ============== */

  const market = {
    localEconomy: {
      title: ui.localEconomy,
      path: '/network/all',
      use: {
        role: 'all', // 'all' is used here to enable search within all entities
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    people: {
      title: ui.people,
      path: '/network/people',
      use: {
        form: 'new entity',
        role: 'PersonMapped',
        join: 1,
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    businesses: {
      title: ui.businesses,
      path: '/network/businesses',
      divertFundsToOwner: true,
      use: {
        form: 'new entity',
        role: 'Business',
        join: 5,
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    // farms: {
    //   title: 'Farms',
    //   path: '/network/farms',
    //   divertFundsToOwner: true,
    //   use: {
    //     form: 'new entity',
    //     role: 'Farm',
    //   },
    //   draw: function( path ) {
    //     Marketplace.draw( path );
    //   },
    // },
    // plots: {
    //   title: 'Plots',
    //   path: '/network/plots',
    //   divertFundsToOwner: true,
    //   use: {
    //     form: 'new entity',
    //     role: 'Plot',
    //   },
    //   draw: function( path ) {
    //     Marketplace.draw( path );
    //   },
    // },
    ngos: {
      title: ui.ngos,
      path: '/network/non-profits',
      use: {
        form: 'new entity',
        role: 'NGO',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    publicSector: {
      title: ui.publicSector,
      path: '/network/public-sector',
      use: {
        form: 'new entity',
        role: 'GOV',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    anchors: {
      title: ui.anchors,
      path: '/network/institutions',
      use: {
        form: 'new entity',
        role: 'Institution',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    networks: {
      title: ui.networks,
      path: '/network/networks',
      use: {
        form: 'new entity',
        role: 'Network',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    skills: {
      title: ui.skills,
      path: '/network/skills',
      divertFundsToOwner: true,
      use: {
        form: 'new entity',
        role: 'Skill',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    tasks: {
      title: ui.tasks,
      path: '/network/tasks',
      divertFundsToOwner: true,
      use: {
        form: 'new entity',
        role: 'Task',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    places: {
      title: ui.places,
      path: '/network/places',
      use: {
        form: 'new entity',
        role: 'Place',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    events: {
      title: ui.events,
      path: '/network/events',
      use: {
        form: 'new entity',
        role: 'Event',
        join: 3,
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
  };

  /* ============== tags definitions ============== */

  const tags = {
    tagEnergyTransportation: {
      title: 'Energy & Transportation',
      path: '/tag/energy-transportation',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#Energy',
        } );
      },
    },
    tagIndigenousValues: {
      title: 'Indigenous Values',
      path: '/tag/indigenous-values',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#IndigenousValues',
        } );
      },
    },
    tagCommonsCommunitiesGovernance: {
      title: 'Commons, Communities & Governance',
      path: '/tag/commons-communities-governance',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#Governance',
        } );
      },
    },
    tagEducationCollectiveIntelligence: {
      title: 'Education & Collective Intelligence',
      path: '/tag/education-collective-intelligence',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#Education',
        } );
      },
    },
    tagEconomicsCurrencies: {
      title: 'Economics & Currencies',
      path: '/tag/economics-currencies',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#Economics',
        } );
      },
    },
    tagCounteringAnthropogenicMindsets: {
      title: 'Countering Anthropogenic Mindsets',
      path: '/tag/countering-anthropogenic-mindsets',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#CounteringAnthropogenicMindsets',
        } );
      },
    },
    tagNewNarratives: {
      title: 'New Narratives',
      path: '/tag/new-narratives',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#NewNarratives',
        } );
      },
    },
    tagBiosphereRegeneration: {
      title: 'Biosphere Regeneration',
      path: '/tag/biosphere-regeneration',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#BiosphereRegeneration',
        } );
      },
    },
    tagCounteringIdentityPolitics: {
      title: 'Countering Identity Politics',
      path: '/tag/countering-identity-politics',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#CounteringIdentityPolitics',
        } );
      },
    },
    tagGlobalIntegralHealth: {
      title: 'Global Integral Health',
      path: '/tag/global-integral-health',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#GlobalIntegralHealth',
        } );
      },
    },
    tagFoodWater: {
      title: 'Food & Water',
      path: '/tag/food-water',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#Food',
        } );
      },
    },
    tagEmergentOther: {
      title: 'Emergent Other',
      path: '/tag/emergent-other',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#EmergentOther',
        } );
      },
    },
    tagSystemicApproaches: {
      title: 'Systemic Approaches',
      path: '/tag/systemic-approaches',
      use: {
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#SystemicApproaches',
        } );
      },
    },
  };

  /* ================= export ==================== */

  return Object.assign( market, tags );
} )();
