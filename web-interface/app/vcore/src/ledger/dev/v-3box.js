const V3Box = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to access 3Box
   *
   */

  'use strict';

  let box, space;

  /* ================== private methods ================= */

  // currently none

  /* ================== public methods  ================= */

  async function set3BoxSpace( which, data ) {

    await space.public.set( which, data );

    // for testing only
    const entityData = await space.public.get( 'entity' );
    console.log( 'saved:', entityData );
  }

  async function get3BoxSpace( which ) {
    if ( window.Web3Obj && window.Web3Obj._provider ) {
      box = await Box.openBox( which, window.Web3Obj._provider );
      await box.syncDone;
      space = await box.openSpace( 'v-alpha-2' );

      if ( space && V.getSetting( 'update3BoxEntityStore' ) ) {
        return {
          success: false,
          reset: true,
        };
      }

      const entityData = await space.public.get( 'entity' );

      // for testing only
      // box.public.remove( 'fullId' );
      // const profile = await box.public.all();
      // console.log( profile );
      // console.log( space );

      if ( entityData && entityData.fullId ) {
        console.log( 'retrieved 3Box V Alpha 2 entity: ', entityData );
        return {
          success: true,
          status: 'retrieved 3Box V Alpha 2 entity data',
          data: [ entityData ],
        };
      }
      else {
        return {
          success: false,
          status: 'could not retrieve 3Box V Alpha 2 entity data',
          data: [],
        };
      }

    }
    else {
      return {
        success: false,
        status: '3Box not retrieved/no provider',
        data: [],
      };
    }
  }

  /* ====================== export  ===================== */

  V.set3BoxSpace = set3BoxSpace;
  V.get3BoxSpace = get3BoxSpace;

  return {
    set3BoxSpace: set3BoxSpace,
    get3BoxSpace: get3BoxSpace,
  };

} )();
