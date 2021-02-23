const ModalComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module for modal components
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = {
    close: 'close',
    connectingWallet: 'Connecting wallet',
    connectWallet: 'Connect wallet',
    useKey: 'Use key',
    nameProfile: 'Name profile',
    joining: 'Joining ... ',
    welcome: 'Welcome',
    connectedAddress: 'Address connected',
    confInWallet: 'Confirm in wallet ... ',
    submitted: 'submitted ...',
    enableWallet: 'Enable a crypto wallet in your browser, for example',
    getMetaMask: 'Get MetaMask',
    signTx: 'Sign Transaction',
    newNameOnly: 'Name new profile only',
    newName: 'Name new profile',
    newNameExplain: 'Naming your profile creates a new entity for your address. An entity can be anything you want to make visible in the network.',
    manageProfile: 'Manage profile with key',
    disconnect: 'Confirm Disconnect',
    useProfile: 'Use current profile',
    copyKey: 'Click to copy the key and store it safely elsewhere',
    copyKeyExplain: 'You\'ll need this key to manage this profile',
    liveBalance: 'Live Balance',
    notRetrieved: 'Sorry, account details could not be retrieved',
    fourOfour: '404 - Page not found',

    loggedOut: 'You are logged out',
    entityExists: 'This combination of title and tag already exists or is invalid',
    txSent: '✅ Sent to network',
    txSuccess: '✅ Transaction successful',
    error: 'An error occured. Maybe the wallet is locked?',
    wait: 'Please wait... requesting data',
    walletLocked: 'Could not unlock wallet. Maybe the site\'s connectivity to the wallet was denied? Check the browser or wallet settings.',
    noBalance: 'Could not get account balance. Is the network set correctly in your wallet? <br><br>Please set to RINKEBY.',
  };

  function getString( string, scope ) {
    return V.i18n( string, 'modal', scope || 'modal content' ) + ' ';
  }

  /* ====================== styles ====================== */

  V.setStyle( {
    'modal': {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      background: 'rgba(0,0,0,0.8)',
    },
    'modal__content': {
      'background': 'white',
      'width': '75vw',
      'max-width': '500px',
      'height': '46vh',
      'margin': '14vh auto',
      'padding': '0.5rem',
    },
    'modal__close': {
      'position': 'absolute',
      'right': '1rem',
      'top': '1rem',
      'text-decoration': 'none',
      'color': 'white',
    },
    'modal__uphrase': {
      color: 'red',
    },
    'modal-pos-1': {
      top: '5vh',
    },
    'modal-pos-2': {
      top: '10vh',
    },
    'modal-pos-3': {
      top: '15vh',
    },
  } );

  const buttonClasses = 'relative bkg-button txt-button font-medium cursor-pointer txt-center pxy-1';
  const altButtonClasses = 'relative cursor-pointer txt-center';

  /* ================== event handlers ================== */

  function handleModalClose() {
    V.setNode( '.modal', 'clear' );
  }

  function handleStopPropagation( e ) {
    e.stopPropagation();
  }

  function handleGetEntityForm() {
    const $input = InteractionComponents.formField( 'uPhrase' );
    const $new = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleGetEntity,
      h: getString( ui.useKey ),
    } );

    V.sN( '.modal__content', '' );
    V.setNode( '.modal__content', [$input, $new] );
  }

  function handleGetEntity() {

    V.setAuth( V.getNode( '#loginform__uphrase' ).value )
      .then( data => {
        if ( data.success ) {
          console.log( 'auth success' );
          return data.data[0].uuidE;
        }
        else {
          throw new Error( 'could not set auth' );
        }
      } )
      .then( uuidE => V.getEntity( uuidE ) )
      .then( entity => {
        if ( entity.success ) {
          V.setActiveEntity( entity.data[0] );
          Join.draw( 'new entity was set up' );
        }
        else {
          throw new Error( 'could not get entity after set auth' );
        }
      } )
      .catch( () => {
        console.log( 'auth unsuccessful' );
        Join.launch();
      } );
  }

  function handleSetEntityForm() {
    const $input = InteractionComponents.formField( 'title' );
    const $new = V.cN( {
      t: 'div',
      i: 'name-new',
      c: buttonClasses, //+ ' modal-pos-1',
      k: handleSetEntity,
      h: getString( ui.nameProfile ),
    } );

    const $response = V.sN( {
      t: 'div',
      c: 'joinform__response pxy txt-red',
    } );

    V.sN( '.modal__content', '' );
    V.setNode( '.modal__content', [$input, $response, $new] );
  }

  function handleSetEntity( e ) {
    e.stopPropagation();

    e.target.removeEventListener( 'click', handleSetEntity, false );
    e.target.textContent = getString( ui.joining );
    V.getNode( '.joinform__response' ).textContent = '';

    const entityData = {
      title: V.getNode( '#plusform__title' ).value,
      role: 'Person',
      evmAddress: V.aA(), // TODO: allow for other chains
    };

    console.log( 'about to set entity: ', entityData );
    V.setEntity( entityData ).then( res => {
      if ( res.success ) {
        console.log( 'successfully set entity: ', res );

        /** automatically join */
        V.setAuth( res.data[0].auth.uPhrase )
          .then( data => {
            if ( data.success ) {
              console.log( 'auth success' );
            }
            else {
              console.log( 'could not set auth after setting new entity' );
            }
          } );

        /** set state and cache */
        Modal.setTempAuth( res.data[0].auth ); // make auth available temporarily on joining
        V.setActiveEntity( res.data[0] );
        Join.draw( 'new entity was set up' );

        V.setCache( 'entire cache', 'clear' );
        // V.setCache( 'viewed', res.data[0] );

        Navigation.drawEntityNavPill( res.data[0] );
      }
      else {
        console.log( 'could not set entity: ', res );
        e.target.addEventListener( 'click', handleSetEntity );
        e.target.textContent = getString( ui.nameProfile );
        V.getNode( '.joinform__response' ).textContent = res.message;
      }
    } );
  }

  function handleWeb3Join( e ) {
    e.stopPropagation();
    Join.draw( 'authenticate' );
  }

  function handleTransaction( e ) {
    e.stopPropagation();

    e.target.removeEventListener( 'click', handleTransaction, false );

    const $btn = V.getNode( '#sign-transaction' );
    $btn.style.background = 'white';
    $btn.style.color = 'rgba(' + V.getState( 'screen' ).brandSecondary + ', 1)';
    if ( V.aA() ) {
      $btn.textContent = getString( ui.confInWallet );
    }
    else {
      // $btn.textContent = getString( ui.submitted );
      Modal.draw( 'transaction sent' );
      V.drawHashConfirmation( String( V.getState( 'active' ).transaction.data[0].timeSecondsUNIX ) );
    }

    const aTx = V.getState( 'active' ).transaction;

    const adminNotify = status => {
      V.setData( status, 'transaction admin notification', V.getSetting( 'transactionLedgerWeb2' ) );
    };

    V.setTransaction( aTx )
      .then( ( res ) => {
        if ( res.success ) {
          V.drawTxConfirmation( res.data[0] );
          Account.drawHeaderBalance();
          adminNotify( 'successfully' );
        }
        else {
          Modal.draw( 'error' );
          console.log( res );
          adminNotify( 'unsuccessfully' );
        }
      } )
      .catch( err => {
        console.error( err );
        Modal.draw();
        adminNotify( 'unsuccessfully' );
      } );
  }

  function handleAddressMapping() {
    if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) {
      V.setEntity( V.aE().fullId, {
        field: 'evmCredentials.address',
        data: V.aA(),
        role: V.aE().role,
      } ).then( () => {
        Join.draw( 'authenticate' );
      } );
    }
  }

  function handleGetMetaMask( e ) {
    e.stopPropagation();
    window.open( 'https://metamask.io/download.html', '_blank' );
  }

  function handleDisconnect() {
    V.setDisconnect().then( res => {
      if ( res.data.setDisconnect.success ) {
        V.setCookie( 'last-active-address', 'clear' );
        V.setCookie( 'welcome-modal', 1 );
        // V.setState( 'activeEntity', 'clear' );
        window.location.href = '/';
      }
    } );
  }

  /* ================== private methods ================= */

  /* ================== public methods ================== */

  function modal() {
    return V.cN( {
      t: 'modal',
      c: 'modal fixed',
      h: {
        t: 'div',
        i: 'modal-close',
        c: 'modal__close',
        h: getString( ui.close ),
        k: handleModalClose,
      },
      k: handleModalClose,
    } );
  }

  function modalContent() {
    return V.cN( {
      t: 'div',
      c: 'modal__content relative',
      k: handleStopPropagation,
    } );
  }

  function simpleMessage( text ) {
    const $content = modalContent();
    const $msg = V.cN( {
      t: 'p',
      h: getString( ui[text] ),
    } );
    V.setNode( $content, $msg );
    return $content;
  }

  function validationError( text ) {
    const $content = modalContent();
    const $msg = V.cN( {
      t: 'p',
      h: text,
    } );
    V.setNode( $content, $msg );
    return $content;
  }

  function getMetaMask() {
    const $content = modalContent();
    const metaMaskLink = '<a href="https://metamask.io/download.html" target="_blank">MetaMask</a>';
    const $msg = V.cN( {
      t: 'p',
      c: 'txt-center',
      h: getString( ui.enableWallet ) + ' ' + metaMaskLink,
    } );
    const $fox = V.cN( {
      t: 'div',
      c: 'mt-r mb-r ml-auto mr-auto',
      y: {
        width: '108px',
      },
      h: {
        t: 'img',
        src: '/assets/img/metamask-fox.png',
      },
    } );
    const $metaMask = V.cN( {
      t: 'div',
      c: buttonClasses,
      k: handleGetMetaMask,
      h: getString( ui.getMetaMask ),
    } );
    V.setNode( $content, [$msg, $fox, $metaMask] );
    return $content;
  }

  function confirmTransaction( txData ) {

    const tx = txData.data[0];

    const $content = modalContent();
    const $txDetails = V.cN( {
      t: 'p',
      c: 'modal__p',
      h: [
        {
          t: 'p',
          h: `Amount: ${tx.amount}`,
        },
        {
          t: 'p',
          h: `Fee: ${tx.feeAmount}`,
        },
        {
          t: 'p',
          h: `Contribution: ${tx.contribution}`,
        },
        {
          t: 'p',
          h: `Total: ${tx.txTotal}`,
        },
      ],
    } );
    const $confirm = V.cN( {
      t: 'div',
      i: 'sign-transaction',
      c: buttonClasses + ' modal-pos-1',
      k: handleTransaction,
      h: getString( ui.signTx ),
    } );
    V.setNode( $content, [$txDetails, $confirm]  );
    return $content;
  }

  function web3Join() {
    const $content = modalContent();
    const $new = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleWeb3Join,
      h: getString( ui.connectWallet ),
    } );
    const $newName = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleSetEntityForm,
      h: getString( ui.newNameOnly ),
    } );
    const $key = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-3',
      k: handleGetEntityForm,
      h: getString( ui.manageProfile ),
    } );
    V.setNode( $content, [$new, $newName, $key] );
    return $content;
  }

  function web2Join() {
    const $content = modalContent();
    const $new = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleSetEntityForm,
      h: getString( ui.newName ),
    } );
    const $key = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleGetEntityForm,
      h: getString( ui.manageProfile ),
    } );
    V.setNode( $content, [$new, $key] );
    return $content;
  }

  function confirmUPhrase() {
    const $content = modalContent();
    const $key = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleGetEntityForm,
      h: getString( ui.manageProfile ),
    } );
    V.setNode( $content, $key );
    return $content;
  }

  function disconnect() {
    const $content = modalContent();
    const $disc = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleDisconnect,
      h: getString( ui.disconnect ),
    } );
    V.setNode( $content, $disc );
    return $content;
  }

  function connectWallet() {
    const $content = modalContent();
    const $connect = V.cN( {
      t: 'div',
      c: 'preloader',
      h: [
        {
          t: 'div',
          c: 'preloader__ring',
        },
        {
          t: 'loader',
          c: 'preloader__text',
          h: getString( ui.connectingWallet ),
        },
      ],
    } );
    V.setNode( $content, $connect );
    return $content;
  }

  function mapAddress() {
    const $content = modalContent();
    const $current = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleAddressMapping,
      h: getString( ui.useProfile ),
    } );
    const $new = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleSetEntityForm,
      h: getString( ui.newName ),
    } );
    V.setNode( $content, [$current, $new] );
    return $content;
  }

  function entityFound( activeEntity, activeAddress, uPhrase, coinTicker, tokenTicker ) {
    const $content = modalContent();

    const $welcome = V.cN( {
      t: 'div',
      c: 'txt-center pxy',
      h: [
        { t: 'p', h: getString( ui.welcome ) },
        {
          t: 'p',
          c: 'font-medium fs-l pxy',
          h: activeEntity.fullId,
        },
        { t: 'p', h: activeAddress ? getString( ui.connectedAddress ) : '' },
        {
          t: 'p',
          c: 'fs-s pxy',
          h: activeAddress,
        },
      ],
    } );

    if ( uPhrase ) {

      const $uPhrase = V.cN( {
        t: 'div',
        c: 'txt-center',
        y: {
          'background': 'aquamarine',
          'border-radius': '3px',
        },
        h: [
          { t: 'p', c: 'pxy', h: getString( ui.copyKey ) },
          UserComponents.castAccessKeyNode( uPhrase ? uPhrase : '', 'txt-red fs-l' ),
          { t: 'p', c: 'pxy', h: getString( ui.copyKeyExplain ) },
        ],
      } );

      // let $balance;
      //
      // const x = activeEntity.balance;
      // if ( x ) {
      //   $balance = V.cN( {
      //     t: 'p',
      //     c: 'modal__details',
      //     h: `
      //     ${tokenTicker} ${ getString( ui.liveBalance ) }: ${ x.liveBalance }<br>
      //     ${coinTicker}: ${ x.coinBalance }<br>
      //     `
      //   } );
      // }
      // else {
      //   $balance = V.cN( {
      //     t: 'p',
      //     h: getString( ui.notRetrieved )
      //   } );
      // }
      // if ( activeAddress ) {
      //   V.setNode( $content, $welcome );
      // }
      // else {
      V.setNode( $content, [$welcome, $uPhrase /*, $balance */] );
    // }
    }
    else {
      V.setNode( $content, $welcome );
    }

    return $content;
  }

  function entityNotFound() {
    const $content = modalContent();
    const $new = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleSetEntityForm,
      h: getString( ui.newName ),
    } );
    const $current = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleAddressMapping,
      h: getString( ui.useProfile ),
    } );
    const $descr = V.cN( {
      t: 'p',
      c: 'modal-pos-3 relative txt-center',
      h: getString( ui.newNameExplain ),
    } );
    if ( V.aE() ) {
      V.setNode( $content, [$new, $current, $descr] );
    }
    else {
      V.setNode( $content, [$new, $descr] );
    }
    return $content;
  }

  /* ====================== export ====================== */

  return {
    modal: modal,
    modalContent: modalContent,
    simpleMessage: simpleMessage,
    validationError: validationError,
    getMetaMask: getMetaMask,
    confirmTransaction: confirmTransaction,
    web3Join: web3Join,
    web2Join: web2Join,
    confirmUPhrase: confirmUPhrase,
    disconnect: disconnect,
    connectWallet: connectWallet,
    mapAddress: mapAddress,
    entityFound: entityFound,
    entityNotFound: entityNotFound,
  };

} )();
