const VDescription = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to create an "intelligent description"
   *
   */

  'use strict';

  /* ================== public methods ================== */

  function castDescription( which ) {
    return which + ' bitchy stuff';
  }

  /* ====================== export ====================== */

  V.castDescription = castDescription;

  return {
    castDescription: castDescription,
  };

} )();
