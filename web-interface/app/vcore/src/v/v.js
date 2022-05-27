const V = { // eslint-disable-line no-unused-vars

  /**
   * Global Object for all V Core Methods to become
   * accessible via V.someMethod( param )
   *
   */

};

const VCoreInit = ( async function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Initialization Module
   *
   * - load all V Core modules, relevant ledger modules and methods
   * - load V Theme Canvas
   * - draw the first app view
   *
   */

  'use strict';

  preloaderTimeout = setTimeout( preloader, 1500 ); // sets loading animation in UI

  const host = VNetworkInit.sourceEndpoint;

  if ( VNetworkInit.useBuilds ) {
    await Promise.all( [
      setInitScript( host + '/vcore/builds/vcore.min.js' ),
    ] )
      .then( () => console.log( 'Success loading vcore build' ) )
      .catch( () => console.error( 'Error loading vcore build' ) );
  }
  else {

    /** load dependencies */

    await Promise.all( [
      setInitScript( host + '/vcore/dependencies/primary/velocity.min.js' ),
      setInitScript( host + '/vcore/dependencies/primary/universal-router.js' ),
      setInitScript( host + '/vcore/dependencies/primary/smtp.js' ),
    ] )
      .then( () => console.log( 'Success loading vcore dependencies' ) )
      .catch( () => console.error( 'Error loading vcore dependencies' ) );

    /** load config */

    await Promise.all( [
      setInitScript( host + '/vcore/src/v/v-config.js' ),
    ] )
      .then( () => console.log( 'Success loading v-config.js' ) )
      .catch( () => console.error( 'Error loading v-config.js' ) );

    /** load all source files */

    await Promise.all( [
      setInitScript( host + '/vcore/src/v/v-key.js' ),
      setInitScript( host + '/vcore/src/v/v-translations.js' ),
      setInitScript( host + '/vcore/src/dom/v-dom.js' ),
      setInitScript( host + '/vcore/src/dom/v-route.js' ),
      setInitScript( host + '/vcore/src/endpoint/v-auth.js' ),
      setInitScript( host + '/vcore/src/endpoint/v-entity.js' ),
      setInitScript( host + '/vcore/src/endpoint/v-message.js' ),
      setInitScript( host + '/vcore/src/endpoint/v-transaction.js' ),
      setInitScript( host + '/vcore/src/helper/v-debugger.js' ),
      setInitScript( host + '/vcore/src/helper/v-description.js' ),
      setInitScript( host + '/vcore/src/helper/v-helper.js' ),
      setInitScript( host + '/vcore/src/ledger/primary/v-ledger.js' ),
      setInitScript( host + '/vcore/src/state/v-state.js' ),
    ] )
      .then( () => console.log( 'Success loading vcore source files' ) )
      .catch( () => console.error( 'Error loading vcore source files' ) );

    /** launch app */

    await Promise.all( [
      setInitScript( host + '/vcore/src/v/v-launch.js' ),
    ] )
      .then( () => console.log( 'Success loading v-launch.js' ) )
      .catch( () => console.error( 'Error loading v-launch.js' ) );

  }

  /** set header network info */
  setTitle( VNetworkInit.tagLine );
  setMeta( 'name', 'author', window.location.host );
  setMeta( 'name', 'description', VNetworkInit.networkDescription );
  setMeta( 'name', 'twitter:card', 'summary' );
  setMeta( 'property', 'og:title', VNetworkInit.tagLine );
  setMeta( 'property', 'og:site_name', window.location.host );
  setMeta( 'property', 'og:url', window.location.href );
  setMeta( 'property', 'og:description', VNetworkInit.networkDescription );
  setMeta( 'property', 'og:type', 'website' );
  setMeta( 'property', 'og:image', VNetworkInit.networkImageUrl );

  /* ================== private methods ================= */

  function preloader() {

    /** places the initital loading animation node*/
    document.querySelector( 'body' ).innerHTML = `<style>
    body {
      background: rgba(211,232,235,1);
    }
    .modal {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0,0,0,0.8)

    }
    .modal__content {
      background: white;
      width: 75vw;
      max-width: 500px;
      height: 46vh;
      margin: 14vh auto;
      padding: 1.5rem;
      border-radius: 32px;
    }
    .preloader {
      display:block;
      margin: 0 auto;
      padding: 30% 0;
      width: 80%
    }
    .preloader__ring {
      display: block;
      margin: 0 auto;
      width: 80px;
      height: 80px;
    }
    .preloader__ring:after {
      content: " ";
      display: block;
      width: 54px;
      height: 54px;
      margin: 8px;
      border-radius: 50%;
      border: 4px solid rgba(255,210,85, 1);
      border-color: rgba(255,210,85, 1) transparent rgba(255,210,85, 1) transparent;
      animation: preloader__ring 1.2s linear infinite;
    }
    .preloader__text {
      color: rgba(83, 96, 101, 0.6);
      display:block;
      margin:20px auto;
      width:100%;
      text-align:center;
      font-size: 18px;
    }
    @keyframes preloader__ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    </style>
    <modal class="modal">
      <div class="modal__content">
        <div class="preloader">
          <div class="preloader__ring"></div>
          <loader class="preloader__text">Loading VCore<loader>
        </div>
      </div>
    </modal>

    `;
  }

  function setTitle( whichTitle ) {
    const node = document.createElement( 'title' );
    var textnode = document.createTextNode( whichTitle );
    node.appendChild( textnode );
    document.querySelector( 'head' ).appendChild( node );
  }

  function setMeta( type, typeContent, content ) {
    const node = document.createElement( 'meta' );
    node.setAttribute( type, typeContent );
    node.setAttribute( 'content', content );
    document.querySelector( 'head' ).appendChild( node );
  }
} )();
