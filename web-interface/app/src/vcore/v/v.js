const V = {}; // eslint-disable-line no-unused-vars

( async function() { // eslint-disable-line no-unused-vars

  /**
  * Load VCore Modules and make methods accessible
  * through e.g. "V.methodNameHere()"
  *
  */

  'use strict';

  function setScript( src ) {
    // console.log( src );
    return new Promise( function( resolve, reject ) {
      const s = document.createElement( 'script' );
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild( s );
    } );
  }

  await Promise.all( [
    setScript( 'src/vcore/v/v-key.js' ),
    setScript( 'src/vcore/v/v-init.js' ),
    setScript( 'src/vcore/dom/v-dom.js' ),
    setScript( 'src/vcore/helper/v-helper-debug.js' ),
    setScript( 'src/vcore/helper/v-helper.js' ),
    setScript( 'src/vcore/endpoint/v-entity.js' ),
    setScript( 'src/vcore/endpoint/v-message.js' ),
    setScript( 'src/vcore/endpoint/v-transaction.js' ),
    setScript( 'src/vcore/state/v-state.js' ),
    setScript( 'src/vcore/ledger/v-ledger.js' ),
    setScript( 'src/theme/canvas/canvas.js' ),
  ] );
  console.log( '*** vcore scripts loaded ***' );

  const methods = {
    // kicksAss: function kicksAss() {
    //   Canvas.launch();
    //   // console.log( 'we are kickin' );
    // },

    /* Endpoints */
    getEntity: VEntity.getEntity,
    setEntity: VEntity.setEntity,
    getEntityBalance: VEntity.getEntityBalance,

    getMessage: VMessage.getMessage,
    setMessage: VMessage.setMessage,
    setMessageBot: VMessage.setMessageBot,

    getTransaction: VTransaction.getTransaction,
    setTransaction: VTransaction.setTransaction,

    /* DOM */
    setScript: setScript,
    castNode: VDom.castNode,
    cN: VDom.cN,
    setNode: VDom.setNode,
    sN: VDom.sN,
    getNode: VDom.getNode,
    gN: VDom.gN,
    setAnimation: VDom.setAnimation,
    sA: VDom.sA,
    setStyle: VDom.setStyle,
    setClick: VDom.setClick,
    getCss: VDom.getCss,
    castRemToPixel: VDom.castRemToPixel,

    /* Helper */
    castEntityTitle: VEntity.castEntityTitle,
    castInitials: VHelper.castInitials,
    castCamelCase: VHelper.castCamelCase,
    castLinks: VHelper.castLinks,
    castTime: VHelper.castTime,
    castShortAddress: VHelper.castShortAddress,
    setPipe: VHelper.setPipe,
    getTranslation: VHelper.getTranslation,
    i18n: VHelper.i18n,
    getIcon: VHelper.getIcon,
    debug: VDebugHelper.debug,

    /* State */
    getState: VState.getState,
    setState: VState.setState,
    getNavItem: VState.getNavItem,
    setNavItem: VState.setNavItem,
    getCookie: VState.getCookie,
    setCookie: VState.setCookie,

    /* Settings */
    getSetting: VInit.getSetting,
    getNetwork: VInit.getNetwork,
    getApiKey: VKey.getApiKey,

  };

  Object.assign( V, methods );

  /**
   * Launch ledger-specific VCore scripts and methods,
   * then launch the Canvas
   *
   */

  VLedger.launch().then( () => {
    Canvas.launch();
  } );

} )();
