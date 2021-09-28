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
    connectWallet: 'Join with wallet',
    useKey: 'Use key',
    nameProfile: 'Name profile',
    joining: 'Joining',
    welcome: 'Welcome',
    connectedAddress: 'Address connected',
    confInWallet: 'Confirm in wallet ... ',
    submitted: 'submitted ...',
    enableWallet: 'Enable a crypto wallet in your browser, for example',
    getMetaMask: 'Get MetaMask',
    signTx: 'Sign Transaction',
    newNameOnly: 'Name personal profile only',
    newName: 'Name personal profile',
    newNameExplain: 'Name yourself, your personal profile here for your address. Later you can add anything you want to make visible in the network, like a business or your skills.',
    emailExplainA: 'The admins of', // fills in window.location.hostname
    emailExplainB: 'kindly ask you to provide a real email address. This address will not be publicly visible.',
    confirmExplain: 'Check your inbox (and spam) and enter the 4 digits emailed to you.',
    email: 'Set email',
    confirmEmail: 'Confirm',
    isConfirmCode: 'is your confirmation code', // email subjedt // fills in number
    confirmNumberIncorrect: 'This 4-digit number is not correct',
    manageProfile: 'Join with existing key',
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
    'confirm-click-spinner': {
      'margin-left': '14px',
    },
  } );

  const buttonClasses = 'relative flex justify-center items-center bkg-button txt-button font-medium cursor-pointer txt-center pxy-1';
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
      i: 'use-key-btn',
      c: buttonClasses + ' modal-pos-1',
      k: handleGetEntity,
      h: getString( ui.useKey ),
    } );

    const $response = V.sN( {
      t: 'div',
      c: 'form__response pxy txt-red',
    } );

    V.sN( '.modal__content', '' );
    V.setNode( '.modal__content', [$input, $response, $new] );
  }

  function handleGetEntity() {
    V.setNode( '#use-key-btn', InteractionComponents.clickConfirmSpinner() );
    V.setAuth( V.getNode( '#loginform__uphrase' ).value )
      .then( data => {
        if ( data.success ) {
          console.log( 'auth success' );
          return data.data[0].uuidE;
        }
        else {
          throw new Error( data.message );
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
      .catch( err => {
        console.log( 'auth unsuccessful -', err );
        V.getNode( '.form__response' ).textContent = err;
        V.setNode( '.confirm-click-spinner', 'clear' );
        Join.launch();
      } );
  }

  function handleWeb3Join( e ) {
    e.stopPropagation();
    V.setNode( '#connectwallet-btn', InteractionComponents.clickConfirmSpinner() );
    Join.draw( 'authenticate' );
  }

  function handleTransaction( e ) {
    e.stopPropagation();

    e.target.removeEventListener( 'click', handleTransaction, false );

    const $btn = V.getNode( '#sign-transaction' );
    $btn.style.background = 'white';
    $btn.style.color = 'rgba(' + V.getState( 'screen' ).brandSecondary + ', 1)';
    if ( V.cA() ) {
      $btn.textContent = getString( ui.confInWallet );
    }
    else {
      // $btn.textContent = getString( ui.submitted );
      Modal.draw( 'transaction sent' );
      V.drawHashConfirmation( String( V.getState( 'active' ).transaction.data[0].timeSecondsUNIX ) );
    }

    const aTx = V.getState( 'active' ).transaction;

    const adminNotify = status => {
      console.log( status );
      // V.setData( status, 'transaction admin notification', V.getSetting( 'notificationServer' ) );
    };

    V.setTransaction( aTx )
      .then( ( res ) => {
        console.log( res );
        if ( res.success || res.data.setTransaction.success ) { // res.success for connected wallet
          V.drawTxConfirmation( res.data.setTransaction ? res.data.setTransaction.data : res.data[0] );
          Account.drawHeaderBalance();
          adminNotify( 'successfully' );
        }
        else {
          Modal.draw( 'error' );
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
        data: V.cA(),
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
    V.setNode( '#disconnect-btn', InteractionComponents.clickConfirmSpinner() );
    V.setDisconnect();
  }

  /* ==================== join process ================== */

  function handleDrawTitleForm() {
    drawModalContent(
      'title',
      handleSetTitle,
      getString( ui.nameProfile )
    );
  }

  function handleSetTitle( e ) {

    const title = V.getNode( '#plusform__title' ).value;

    /* if title does not validate, stop the process */
    const titleValidation = V.castEntityTitle( title, 'Person' );
    if ( !titleValidation.success ) {
      V.getNode( '.joinform__response' ).textContent = titleValidation.message;
      return;
    }

    /* set title in state on click */
    V.setState( 'newRegistration', {
      title: title,
    } );

    /* if email is not asked for, skip and set entity */
    if ( V.getSetting( 'askforEmail' ) ) {
      drawEmailForm();
    }
    else {
      setEntity( e );
    }
  }

  function drawEmailForm() {
    drawModalContent(
      'email',
      handleConfirmEmail,
      getString( ui.email ),
      getString( ui.emailExplainA + ' ' + window.location.hostname + ' ' + ui.emailExplainB )
    );
  }

  function handleConfirmEmail( e ) {

    const randomNumber = V.castTag().replace( '#', '' );
    const email = V.getNode( '#plusform__email' ).value;

    // const knownFakes = new RegExp( /FAKEMAILGENERATOR|fakemailgenerator.com|armyspy.com|teleworm.us|cuvox.de|dayrep.com|einrot.com|fleckens.hu|gustr.com|jourrapide.com|rhyta.com|superrito.com|EMAILFAKE|emailfake.com|j9ysy.com|rehtdita.com|77q8m.com|piftir.com|kentol.buzz|freeallapp.com|luddo.me|hcfmgsrp.com|filerd.site|beefnomination.info|sirkelmail.com|white-sptaikz.com|zetgets.com|devoc.site/, 'gi' );
    //
    // if ( email.match( knownFakes ) ) {
    //   V.getNode( '.joinform__response' ).textContent = 'Hmmmm... This email provider is known as fake...';
    //   return;
    // }

    V.getNode( '.joinform__response' ).textContent = '';
    e.target.append( InteractionComponents.clickConfirmSpinner() );

    V.setState( 'newRegistration', {
      emailPrivate: V.getNode( '#plusform__email' ).value,
    } );

    /* Email by https://www.smtpjs.com */
    Email.send( {
      SecureToken: V.getSetting( 'emailKey' ),
      To: email,
      From: 'network.mailer@valueinstrument.org',
      Subject: window.location.hostname + ': '  + randomNumber + ' ' + getString( ui.isConfirmCode ),
      Body: window.location.hostname + ': '  + randomNumber + ' ' + getString( ui.isConfirmCode ),
      // Body: 'Please enter ' + randomNumber + ' at ' + window.location.hostname + ' to confirm this email address.',
    } ).then( msg => {
      if ( 'OK' == msg ) {
        drawModalContent(
          'emailConfirm',
          handleConfirmNumber.bind( randomNumber ),
          getString( ui.confirmEmail ),
          getString( ui.confirmExplain )
        );
      }
      else {
        e.target.textContent = getString( ui.newEmail );

        V.getNode( '.joinform__response' ).textContent = msg;
      }
    } );
  }

  function handleConfirmNumber( e ) {
    const number = V.getNode( '#plusform__emailConfirm' ).value;
    if ( number == this ) { // both are strings
      setEntity( e );
    }
    else {
      V.getNode( '.joinform__response' ).textContent = getString( ui.confirmNumberIncorrect );
    }
  }

  function setEntity( e ) {

    e.stopPropagation();
    e.target.removeEventListener( 'click', handleSetTitle, false );
    e.target.removeEventListener( 'click', handleConfirmNumber, false );

    V.sN( '.explain', 'clear' );
    e.target.textContent = getString( ui.joining );
    e.target.append( InteractionComponents.clickConfirmSpinner() );
    e.target.parentNode.append( V.cN( {
      t: 'div',
      c: 'progress-bar',
      h: {
        t: 'span',
        c: 'bar',
        h: {
          t: 'span',
          c: 'progress',
        },
      },
    } ) );

    V.getNode( '.joinform__response' ).textContent = '';

    const entityData = {
      title: V.getState( 'newRegistration' ).title,
      emailPrivate: V.getState( 'newRegistration' ).emailPrivate || null,
      role: 'Person',
      evmAddress: V.cA() || null, // TODO: allow for other chains
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

        // Modal.setTempAuth( res.data[0].auth ); // make auth available temporarily on joining
        Join.onboard( res.data[0].auth.uPhrase );

        /** set state and cache */
        V.setActiveEntity( res.data[0] );
        Join.draw( 'new entity was set up' );

        // V.setCache( 'entire cache', 'clear' );
        // V.setCache( 'viewed', res.data[0] );

        // Navigation.drawEntityNavPill( res.data[0] );
      }
      else {
        console.log( 'could not set entity: ', res );
        // e.target.addEventListener( 'click', setEntity );
        // e.target.textContent = getString( ui.nameProfile );
        V.getNode( '.joinform__response' ).textContent = res.message;
      }
    } );
  }

  /* ================== private methods ================= */

  function drawModalContent( field, handler, label, explain ) {

    const $btn = V.cN( {
      t: 'div',
      c: buttonClasses,
      k: handler,
      h: label,
    } );

    const $input = InteractionComponents.formField( field );

    const $response = V.sN( {
      t: 'div',
      c: 'joinform__response pxy txt-red',
    } );

    const $descr = V.cN( {
      t: 'p',
      c: 'explain modal-pos-1 relative txt-center',
      h: explain || '',
    } );

    V.sN( '.modal__content', '' );
    V.setNode( '.modal__content', [$input, $response, $btn, $descr] );
  }

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
      i: 'connectwallet-btn',
      c: buttonClasses + ' modal-pos-1',
      k: handleWeb3Join,
      h: getString( ui.connectWallet ),
    } );
    const $key = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleGetEntityForm,
      h: getString( ui.manageProfile ),
    } );
    const $newName = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-3',
      k: handleDrawTitleForm,
      h: getString( ui.newNameOnly ),
    } );
    V.setNode( $content, [$new, $key, $newName] );
    return $content;
  }

  function web2Join() {
    const $content = modalContent();
    const $new = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleDrawTitleForm,
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
      i: 'disconnect-btn',
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
      k: handleDrawTitleForm,
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
      k: handleDrawTitleForm,
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
