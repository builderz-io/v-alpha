const V = {

  /**
   * Global Object for all V Core Methods to become
   * accessible via V.someMethod( param )
   *
   */

};

const VInit = ( async function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Initialization Module
   *
   * - load all V Core modules, relevant ledger modules and methods
   * - load V Theme Canvas
   * - draw the first app view
   *
   */

  'use strict';

  await Promise.all( [
    setScript( '/vcore/v-config.js' ),
  ] );
  console.log( '*** configuration loaded ***' );

  if ( V.getSetting( 'useBuilds' ) ) {
    await Promise.all( [
      setScript( '/vcore/builds/vcore.min.js' ),
    ] );
    console.log( '*** vcore builds loaded ***' );
  }
  else {
    await Promise.all( [
      setScript( '/vcore/dependencies/primary/velocity.min.js' ),
      setScript( '/vcore/dependencies/primary/js.cookie.min.js' ),
      setScript( '/vcore/dependencies/primary/universal-router.js' ),
    ] );
    console.log( '*** vcore source dependencies loaded ***' );

    await Promise.all( [
      setScript( '/vcore/src/dom/v-dom.js' ),
      setScript( '/vcore/src/dom/v-route.js' ),
      setScript( '/vcore/src/endpoint/v-auth.js' ),
      setScript( '/vcore/src/endpoint/v-entity.js' ),
      setScript( '/vcore/src/endpoint/v-message.js' ),
      setScript( '/vcore/src/endpoint/v-transaction.js' ),
      setScript( '/vcore/src/helper/v-debugger.js' ),
      setScript( '/vcore/src/helper/v-description.js' ),
      setScript( '/vcore/src/helper/v-helper.js' ),
      setScript( '/vcore/src/ledger/primary/v-ledger.js' ),
      setScript( '/vcore/src/state/v-state.js' ),
      setScript( '/vcore/src/v/v-key.js' ),
      setScript( '/vcore/src/v/v-translations.js' ),
    ] );
    console.log( '*** vcore source scripts loaded ***' );

    /**
     * launch app
     *
     */

    await Promise.all( [
      setScript( '/vcore/src/v/v-launch.js' ),
    ] );
    console.log( '*** vcore source launch loaded ***' );
  }

  /* ================== private methods ================= */

  function setScript( src, id ) { // copy from VDom
    return new Promise( function( resolve, reject ) {
      const s = document.createElement( 'script' );
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      id ? s.id = id : null;
      document.head.appendChild( s );
    } );
  }

} )();
