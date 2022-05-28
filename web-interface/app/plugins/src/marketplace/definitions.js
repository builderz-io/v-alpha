const MarketplaceDefinitions = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Navigation Items for V Marketplace Plugin
   *
   */

  'use strict';

  return {
    tagEnergyTransportation: {
      title: 'Energy & Transportation',
      path: '/tag/energy-transportation',
      use: {
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
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
        // button: 'search',
        role: 'all',
      },
      draw: function( path ) {
        Marketplace.draw( path, {
          query: '#SystemicApproaches',
        } );
      },
    },
    localEconomy: {
      title: 'Local Economy',
      path: '/network/all',
      use: {
        // button: 'search',
        role: 'all', // 'all' is used here to enable search within all entities
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    people: {
      title: 'People',
      path: '/network/people',
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'PersonMapped',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    businesses: {
      title: 'Businesses',
      path: '/network/businesses',
      divertFundsToOwner: true,
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'Business',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    ngos: {
      title: 'NGO',
      path: '/network/non-profits',
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'NGO',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    publicSector: {
      title: 'Public Sector',
      path: '/network/public-sector',
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'GOV',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    anchors: {
      title: 'Anchor Institutions',
      path: '/network/institutions',
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'Institution',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    networks: {
      title: 'Networks',
      path: '/network/networks',
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'Network',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    skills: {
      title: 'Skills',
      path: '/network/skills',
      divertFundsToOwner: true,
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'Skill',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    tasks: {
      title: 'Tasks',
      path: '/network/tasks',
      divertFundsToOwner: true,
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'Task',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    pools: {
      title: 'Crowdfunding',
      path: '/network/pools',
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'Pool',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    places: {
      title: 'Places',
      path: '/network/places',
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'Place',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
    events: {
      title: 'Events',
      path: '/network/events',
      use: {
        // button: 'search',
        form: 'new entity',
        role: 'Event',
      },
      draw: function( path ) {
        Marketplace.draw( path );
      },
    },
  };
} )();
