const ModalComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module for modal components
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      close: 'close',
      connectingWallet: 'Connecting wallet',
      connectWallet: 'Join with wallet',
      useKey: 'Use key',
      uploadKey: 'Use key file',
      noKeyFile: 'No file selected',
      noKey: 'No key found in file',
      enterKey: 'Enter key manually',
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

      joinFirst: 'Please join first, creating a personal profile.',
      loggedOut: 'You are logged out',
      entityExists: 'This combination of title and tag already exists or is invalid',
      txSent: '✅ Sent to network',
      txSuccess: '✅ Transaction successful',
      error: 'Transaction not processed. Maybe you did not confirm it or the wallet is locked.',
      unknownTxError: 'Unknown transaction error',
      txErrorDelay: 'One of your previous transactions may take unusually long to process. Please wait and try another transaction in 4 hours. Check your history or a blockexplorer to determine which transactions have processed. Inform the admins, if the problem persists.',
      txErrorNoFunds: 'You currently can not settle the transaction cost. Either the cost is very high righ now, in which case try again later. Or your allowance has depleted, in which case contact the admins to increase it.',
      wait: 'Please wait... requesting data',
      walletLocked: 'Could not unlock wallet. Maybe the site\'s connectivity to the wallet was denied? Check the browser or wallet settings.',
      noBalance: 'Could not get account balance. Is the network set correctly in your wallet? <br><br>Please set to RINKEBY.',

      txTo: 'Recipient',
      txAmount: 'Amount',
      txContribution: 'Contribution',
      txFee: 'Fee',
      txTotal: 'Total',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

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
      'padding': '1.5rem',
      'border-radius': '32px',
    },
    'modal__close': {
      'position': 'absolute',
      'right': '1rem',
      'top': '1rem',
      'text-decoration': 'none',
      'color': 'white',
    },
    'modal__btn': {
      'border-radius': '32px',
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

  const buttonClasses = 'modal__btn relative flex justify-center items-center bkg-button txt-button font-medium cursor-pointer txt-center pxy-1';
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
      i: 'use-key-btn',
      c: buttonClasses + ' modal-pos-1 place-spinner',
      k: handleGetEntity,
      h: V.getString( ui.useKey ),
    } );

    const $response = V.cN( {
      c: 'form__response pxy txt-red',
    } );

    V.sN( '.modal__content', '' );
    V.setNode( '.modal__content', [$input, $response, $new] );
  }

  function handleUploadKeyForm() {

    const $upload = V.cN(
      {
        c: 'upload-key-form',
        h: {
          c: 'upload-key-form__inner',
          h: [
            {
              t: 'label',
              i: 'key-upload__label',
              c: buttonClasses + ' modal-pos-1',
              a: {
                for: 'key-upload__file',
              },
              h: V.getString( ui.uploadKey ),
            },
            {
              t: 'input',
              i: 'key-upload__file',
              c: 'hidden place-spinner',
              a: {
                type: 'file',
                accept: 'text/plain',
              },
              e: {
                change: handleUploadKey,
              },
            },
          ],
        },
      },

    );

    const $enter = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleGetEntityForm,
      h: V.getString( ui.enterKey ),
    } );

    const $response = V.cN( {
      c: 'form__response relative pxy txt-red modal-pos-3',
    } );

    V.sN( '.modal__content', '' );
    V.setNode( '.modal__content', [$upload, $response, $enter] );
  }

  function handleUploadKey() {
    if ( this.files.length === 0 ) {
      V.getNode( '.form__response' ).textContent = V.getString( ui.noKeyFile );
      return;
    }

    const reader = new FileReader();

    reader.onload = function( event ) {
      const key = event.target.result.match( /vx.{16}/ );
      if ( !key || !key[0] ) {
        V.getNode( '.form__response' ).textContent = V.getString( ui.noKey );
        return;
      }
      handleGetEntity( undefined, key[0] );
    };

    reader.readAsText( this.files[0] );
  }

  function handleGetEntity( e, uPhrase ) {
    V.setNode( '.place-spinner', InteractionComponents.confirmClickSpinner() );

    V.setAuth( uPhrase || V.getNode( '#loginform__uphrase' ).value )
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

          const $userPill = V.getNode( '[uuide="' + entity.data[0].uuidE + '"]' );
          if ( $userPill ) {
            Navigation.drawJoinedUserPill();
          }
          else {
            Navigation.drawEntityNavPill( entity.data[0] );
          }

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
    V.setNode( '#connectwallet-btn', InteractionComponents.confirmClickSpinner() );
    Join.draw( 'authenticate' );
  }

  function handleTransaction( e ) {
    e.stopPropagation();

    e.target.removeEventListener( 'click', handleTransaction, false );

    const $btn = V.getNode( '#sign-transaction' );
    $btn.style.background = 'white';
    $btn.style.color = 'rgba(' + V.getState( 'screen' ).brandSecondary + ', 1)';
    if ( V.cA() ) {
      $btn.textContent = V.getString( ui.confInWallet );
    }
    else {
      // $btn.textContent = V.getString( ui.submitted );
      Modal.draw( 'transaction sent' );
      V.drawHashConfirmation( String( V.getState( 'active' ).transaction.data[0].timeSecondsUNIX ) );
    }

    const aTx = V.getState( 'active' ).transaction;

    const adminNotify = status => {
      const data = {
        act: 'New transaction',
        msg: status,
      };
      V.setEmailNotification( data );
      V.setTelegramNotification( data );

    };

    V.setTransaction( aTx )
      .then( ( res ) => {
        console.log( res );
        if (
          res.success // for connected wallet
          || /* res.data.setTransaction && */ res.data.setTransaction.success // for managed tx, the commented is a hack to trigger catch block on locked wallet
        ) {
          V.drawTxConfirmation( res.data.setTransaction ? res.data.setTransaction.data : res.data[0] );
          Account.drawHeaderBalance();
          adminNotify( 'successful' );
        }
        else {
          let error = '❌ ';
          if ( res.errors ) {
            if ( res.errors[0].message.includes( 'insufficient funds' ) ) {
              error += ' ' + V.getString( ui.txErrorNoFunds );
            }
            else {
              error += ' ' + V.getString( ui.txErrorDelay );
            }
            error += ' -- ' + res.errors[0].message;
          }
          else {
            error += ' -- ' + V.getString( ui.unknownTxError );
          }
          Modal.draw( 'transaction error', error );
          adminNotify( 'ERROR returned: ' + error );
        }
      } )
      .catch( err => {
        console.error( err );
        const error = err ? V.getString( ui.error ) + ' -- ' + err.message : '';
        Modal.draw( 'transaction error', error );
        adminNotify( 'ERROR caught: ' + error );
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
    V.setNode( '#disconnect-btn', InteractionComponents.confirmClickSpinner() );
    V.setDisconnect();
  }

  /* ==================== join process ================== */

  function handleDrawTitleForm() {
    if( V.getSetting( 'joinVersion' ) === 1 ) {
      drawModalContent(
        'title',
        handleSetTitle,
        V.getString( ui.nameProfile ),
      );
    }
    else {
      V.sN( 'modal', 'clear' );
      V.setNode( 'body', JoinRoutine.draw( { role: 'Person', join: 1 } ) );
    }
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
      V.getString( ui.email ),
      V.getString( ui.emailExplainA + ' ' + window.location.hostname + ' ' + ui.emailExplainB ),
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
    e.target.append( InteractionComponents.confirmClickSpinner() );

    V.setState( 'newRegistration', {
      emailPrivate: V.getNode( '#plusform__email' ).value,
    } );

    /* Email by https://www.smtpjs.com */
    Email.send( {
      SecureToken: V.getSetting( 'emailKey' ),
      To: email,
      From: 'network.mailer@valueinstrument.org',
      Subject: window.location.hostname + ': '  + randomNumber + ' ' + V.getString( ui.isConfirmCode ),
      Body: window.location.hostname + ': '  + randomNumber + ' ' + V.getString( ui.isConfirmCode ),
      // Body: 'Please enter ' + randomNumber + ' at ' + window.location.hostname + ' to confirm this email address.',
    } ).then( msg => {
      if ( 'OK' == msg ) {
        drawModalContent(
          'emailConfirm',
          handleConfirmNumber.bind( randomNumber ),
          V.getString( ui.confirmEmail ),
          V.getString( ui.confirmExplain ),
        );
      }
      else {
        e.target.textContent = V.getString( ui.newEmail );

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
      V.getNode( '.joinform__response' ).textContent = V.getString( ui.confirmNumberIncorrect );
    }
  }

  function setEntity( e ) {

    e.stopPropagation();
    e.target.removeEventListener( 'click', handleSetTitle, false );
    e.target.removeEventListener( 'click', handleConfirmNumber, false );

    V.sN( '.explain', 'clear' );
    e.target.textContent = V.getString( ui.joining );
    e.target.append( InteractionComponents.confirmClickSpinner() );
    e.target.parentNode.append( V.cN( {
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

        /** onboard routine  */
        if ( V.getState( 'active' ).navItem ) {
          Navigation.drawReset();
          setTimeout( delayedOnboardRoutine, 900, res.data[0].auth.uPhrase );
        }
        else {
          Join.onboard( res.data[0].auth.uPhrase );
        }

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
        // e.target.textContent = V.getString( ui.nameProfile );
        V.getNode( '.joinform__response' ).textContent = res.message;
      }
    } );
  }

  /* ================== private methods ================= */

  function delayedOnboardRoutine( uPhrase ) {
    Join.onboard( uPhrase );
  }

  function drawModalContent( field, handler, label, explain ) {

    const $btn = V.cN( {
      c: buttonClasses,
      k: handler,
      h: label,
    } );

    const $input = InteractionComponents.formField( field );

    const $response = V.cN( {
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
      // h: {
      //   i: 'modal-close',
      //   c: 'modal__close',
      //   h: V.getString( ui.close ),
      //   k: handleModalClose,
      // },
      k: handleModalClose,
    } );
  }

  function modalContent() {
    return V.cN( {
      c: 'modal__content relative',
      k: handleStopPropagation,
    } );
  }

  function preview() {
    const $content = modalContent();
    const $msg = V.cN( {
      t: 'p',
      // h: InteractionComponents.confirmClickSpinner(),
      h: [
        {
          c: 'preloader__ring',
        },
        {
          t: 'loader',
          c: 'preloader__text',
          h: V.getString( ui.wait ),
        },
      ],
    } );
    V.setNode( $content, $msg );
    return $content;
  }

  function simpleMessage( text ) {
    const $content = modalContent();
    const $msg = V.cN( {
      t: 'p',
      h: V.getString( ui[text] ? ui[text] : text ),
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
      h: V.getString( ui.enableWallet ) + ' ' + metaMaskLink,
    } );
    const $fox = V.cN( {
      c: 'mt-r mb-r ml-auto mr-auto',
      y: {
        width: '108px',
      },
      h: {
        t: 'img',
        r: '/assets/img/metamask-fox.png',
      },
    } );
    const $metaMask = V.cN( {
      c: buttonClasses,
      k: handleGetMetaMask,
      h: V.getString( ui.getMetaMask ),
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
          h: `${ V.getString( ui.txAmount ) }: ${ tx.amount }`,
        },
        {
          t: 'p',
          h: `${ V.getString( ui.txFee ) }: ${ tx.feeAmount }`,
        },
        {
          t: 'p',
          h: `${ V.getString( ui.txContribution ) }: ${ tx.contribution }`,
        },
        {
          t: 'p',
          h: `${ V.getString( ui.txTotal ) }: ${ tx.txTotal }`,
        },
        {
          t: 'p',
          h: `${ V.getString( ui.txTo ) }: ${ tx.recipient} `,
        },
      ],
    } );
    const $confirm = V.cN( {
      i: 'sign-transaction',
      c: buttonClasses + ' modal-pos-1',
      k: handleTransaction,
      h: V.getString( ui.signTx ),
    } );
    V.setNode( $content, [$txDetails, $confirm]  );
    return $content;
  }

  function web3Join() {
    const $content = modalContent();
    const $new = V.cN( {
      i: 'connectwallet-btn',
      c: buttonClasses + ' modal-pos-1',
      k: handleWeb3Join,
      h: V.getString( ui.connectWallet ),
    } );
    const $key = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleUploadKeyForm,
      h: V.getString( ui.manageProfile ),
    } );
    const $newName = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-3',
      k: handleDrawTitleForm,
      h: V.getString( ui.newNameOnly ),
    } );
    V.setNode( $content, [$new, $key, $newName] );
    return $content;
  }

  function web2Join() {
    const $content = modalContent();
    const $new = V.cN( {
      c: buttonClasses + ' modal-pos-1',
      k: handleDrawTitleForm,
      h: V.getString( ui.newName ),
    } );
    const $key = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleUploadKeyForm,
      h: V.getString( ui.manageProfile ),
    } );
    V.setNode( $content, [$new, $key] );
    return $content;
  }

  function confirmUPhrase() {
    const $content = modalContent();
    const $key = V.cN( {
      c: buttonClasses + ' modal-pos-1',
      k: handleGetEntityForm,
      h: V.getString( ui.manageProfile ),
    } );
    V.setNode( $content, $key );
    return $content;
  }

  function disconnect() {
    const $content = modalContent();
    const $disc = V.cN( {
      i: 'disconnect-btn',
      c: buttonClasses + ' modal-pos-1',
      k: handleDisconnect,
      h: V.getString( ui.disconnect ),
    } );
    V.setNode( $content, $disc );
    return $content;
  }

  function connectWallet() {
    const $content = modalContent();
    const $connect = V.cN( {
      c: 'preloader',
      h: [
        {
          c: 'preloader__ring',
        },
        {
          t: 'loader',
          c: 'preloader__text',
          h: V.getString( ui.connectingWallet ),
        },
      ],
    } );
    V.setNode( $content, $connect );
    return $content;
  }

  function mapAddress() {
    const $content = modalContent();
    const $current = V.cN( {
      c: buttonClasses + ' modal-pos-1',
      k: handleAddressMapping,
      h: V.getString( ui.useProfile ),
    } );
    const $new = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleDrawTitleForm,
      h: V.getString( ui.newName ),
    } );
    V.setNode( $content, [$current, $new] );
    return $content;
  }

  function entityFound( activeEntity, activeAddress, uPhrase, coinTicker, tokenTicker ) {
    const $content = modalContent();

    const $welcome = V.cN( {
      c: 'txt-center pxy',
      h: [
        { t: 'p', h: V.getString( ui.welcome ) },
        {
          t: 'p',
          c: 'font-medium fs-l pxy',
          h: activeEntity.fullId,
        },
        { t: 'p', h: activeAddress ? V.getString( ui.connectedAddress ) : '' },
        {
          t: 'p',
          c: 'fs-s pxy',
          h: activeAddress,
        },
      ],
    } );

    if ( uPhrase ) {

      const $uPhrase = V.cN( {
        c: 'txt-center',
        y: {
          'background': 'aquamarine',
          'border-radius': '3px',
        },
        h: [
          { t: 'p', c: 'pxy', h: V.getString( ui.copyKey ) },
          UserComponents.castAccessKeyNode( uPhrase ? uPhrase : '', 'txt-red fs-l' ),
          { t: 'p', c: 'pxy', h: V.getString( ui.copyKeyExplain ) },
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
      //     ${tokenTicker} ${ V.getString( ui.liveBalance ) }: ${ x.liveBalance }<br>
      //     ${coinTicker}: ${ x.coinBalance }<br>
      //     `
      //   } );
      // }
      // else {
      //   $balance = V.cN( {
      //     t: 'p',
      //     h: V.getString( ui.notRetrieved )
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
    if( V.getSetting( 'joinVersion' ) === 1 ) {
      const $content = modalContent();
      const $new = V.cN( {
        c: buttonClasses + ' modal-pos-1',
        k: handleDrawTitleForm,
        h: V.getString( ui.newName ),
      } );
      const $current = V.cN( {
        t: 'p',
        c: altButtonClasses + ' modal-pos-2',
        k: handleAddressMapping,
        h: V.getString( ui.useProfile ),
      } );
      const $descr = V.cN( {
        t: 'p',
        c: 'modal-pos-3 relative txt-center',
        h: V.getString( ui.newNameExplain ),
      } );
      if ( V.aE() ) {
        V.setNode( $content, [$new, $current, $descr] );
      }
      else {
        V.setNode( $content, [$new, $descr] );
      }
      return $content;
    }
    else {
      V.sN( 'modal', 'clear' );
      V.setNode( 'body', JoinRoutine.draw( { role: 'Person', join: 1 } ) );
    }
  }

  /* ====================== export ====================== */

  return {
    modal: modal,
    modalContent: modalContent,
    preview: preview,
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
