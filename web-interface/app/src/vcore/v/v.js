let V = ( async function() { // eslint-disable-line prefer-const, no-unused-vars

  /**
  * Module to make V's core methods accessible
  * through e.g. "V.methodNameHere()"
  *
  */

  'use strict';

  function setScript( src ) {
    return new Promise( function( resolve, reject ) {
      const s = document.createElement( 'script' );
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild( s );
    } );
  }

  window.setScript = setScript;

  await initialScripts();
  console.log( '*** vcore and canvas scripts loaded ***' );

  async function initialScripts() {
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
  }

  if ( [ VInit.getSetting( 'entityLedger' ), VInit.getSetting( 'chatLedger' ) ].includes( 'MongoDB' ) ) {
    await Promise.all( [
      setScript( 'dist/socket.io.min.js' ),
    ] );
    console.log( '*** socket scripts loaded ***' );
    await VLedger.setSocket().then( res => {
      console.log( res );
    } );
  }

  const VMethods = {
    kicksAss: function kicksAss() {
      Canvas.launch();
      // console.log( 'we are kickin' );
    },

    /* Action */
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

    /* Ledger */
    getData: VLedger.getData,
    setData: VLedger.setData,

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

    /* 3Box added */

    /* EVM added */

  };

  if ( VInit.getSetting( 'transactionLedger' ) == 'EVM' ) {
    await Promise.all( [
      setScript( 'dist/web3.min.js' ),
      setScript( 'src/vcore/ledger/v-evm.js' )
    ] );
    console.log( '*** web3 and evm scripts loaded ***' );
    VMethods.setActiveAddress = VEvm.setActiveAddress;
    VMethods.getContractState = VEvm.getContractState;
    VMethods.getAddressState = VEvm.getAddressState;
    VMethods.getAddressHistory = VEvm.getAddressHistory;
    VMethods.setAddressVerification = VEvm.setAddressVerification;
    VMethods.setCoinTransaction = VEvm.setCoinTransaction;
    VMethods.setTokenTransaction = VEvm.setTokenTransaction;
  }

  if ( VInit.getSetting( 'entityLedger' ) == '3Box' ) {
    await Promise.all( [
      setScript( 'dist/3box.min.js' ),
      setScript( 'src/vcore/ledger/v-3box.js' )
    ] );
    console.log( '*** 3Box scripts loaded ***' );
    VMethods.set3BoxSpace = V3Box.set3BoxSpace;
    VMethods.get3BoxSpace = V3Box.get3BoxSpace;
  }

  return VMethods;

} )();
