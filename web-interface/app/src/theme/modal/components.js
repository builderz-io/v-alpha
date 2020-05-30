const ModalComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module for modal components
   *
   */

  'use strict';

  V.setStyle( {
    'modal': {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      background: 'rgba(0,0,0,0.8)'
    },
    'modal__content': {
      'background': 'white',
      'width': '75vw',
      'max-width': '500px',
      'height': '60vh',
      'margin': '18vh auto',
      'padding': '0.5rem',
    },
    'modal__close': {
      'position': 'absolute',
      'right': '1rem',
      'top': '1rem',
      'text-decoration': 'none',
      'color': 'white'
    },
    'modal__uphrase': {
      color: 'red'
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

  const buttonClasses = 'relative bkg-button font-medium cursor-pointer txt-center pxy-1';
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
      h: V.i18n( 'Join with key', 'modal' )
    } );

    V.sN( '.modal__content', '' );
    V.setNode( '.modal__content', [$input, $new] );
  }

  function handleGetEntity() {
    V.getEntity( V.getNode( '#loginform__uphrase' ).value ).then( res => {
      setActiveEntityState( res );
    } );
  }

  function handleSetEntityForm() {
    const $input = InteractionComponents.formField( 'title' );
    const $new = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleSetEntity,
      h: V.i18n( 'Name account', 'modal' )
    } );

    V.sN( '.modal__content', '' );
    V.setNode( '.modal__content', [$input, $new] );
  }

  function handleSetEntity( e ) {
    e.stopPropagation();

    const entityData = {
      title: V.getNode( '#plusform__title' ).value,
    };

    V.setState( 'activeEntity', 'clear' );

    V.setEntity( entityData ).then( res => {
      setActiveEntityState( res );
    } );
  }

  function handleWeb3Join( e ) {
    e.stopPropagation();
    Join.draw( 'authenticate' );
  }

  function handleTransaction( e ) {
    e.stopPropagation();
    V.setTransaction( this )
      .then( () => {
        // console.log( res );
        Modal.draw( 'transaction successful' );
        Account.drawHeaderBalance();
      } )
      .catch( err => {
        console.error( err );
        Modal.draw();
      } );
  }

  function handleAddressMapping() {
    const aE = V.getState( 'activeEntity' );
    const aA = V.getState( 'activeAddress' );
    if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) {
      V.setEntity( aE.fullId, {
        field: 'evmCredentials.address',
        data: aA,
        auth: V.getCookie( 'last-active-uphrase' ).replace( /"/g, '' )
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
    V.setCookie( 'last-active-address', 'clear' );
    V.setCookie( 'last-active-uphrase', 'clear' );
    window.location.href = '/';
  }

  /* ================== private methods ================= */

  function setActiveEntityState( res ) {
    if ( res.success ) {
      V.setState( 'activeEntity', res.data[0] );
      Join.draw( 'new entity was set up' );
    }
    else {
      const $formField = V.getNode( '#loginform__uPhrase' ) || V.getNode( '#plusform__title' );
      $formField.value = '';
      $formField.setAttribute( 'placeholder', V.i18n( res.status, 'placeholder' ) );
    }
  }

  /* ================== public methods ================== */

  function modal() {
    return V.cN( {
      t: 'modal',
      c: 'modal fixed',
      h: V.cN( {
        t: 'div',
        c: 'modal__close',
        h: V.i18n( 'Close', 'modal' ),
        k: handleModalClose
      } ),
      k: handleModalClose
    } );
  }

  function modalContent() {
    return V.cN( {
      t: 'div',
      c: 'modal__content relative',
      k: handleStopPropagation
    } );
  }

  function simpleMessage( text ) {
    const $content = modalContent();
    const $msg = V.cN( {
      t: 'p',
      h: V.i18n( text, 'modal' )
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
      h: V.i18n( 'Enable a crypto wallet in your browser, for example', 'modal' ) + ' ' + metaMaskLink
    } );
    const $fox = V.cN( {
      t: 'div',
      c: 'mt-r mb-r ml-auto mr-auto',
      y: {
        width: '108px'
      },
      h: V.cN( {
        t: 'img',
        a: {
          src: '/assets/img/metamask-fox.png'
        }
      } )
    } );
    const $metaMask = V.cN( {
      t: 'div',
      c: buttonClasses,
      k: handleGetMetaMask,
      h: V.i18n( 'Get MetaMask', 'modal' )
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
      h: `<p>Amount: ${tx.amount}</p>
      <p>Fee: ${tx.feeAmount}</p>
      <p>Contribution: ${tx.contribution}</p>
      <p>Total: ${tx.txTotal}</p>`
    } );
    const $confirm = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleTransaction.bind( txData ),
      h: V.i18n( 'Sign Transaction', 'modal' )
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
      h: V.i18n( 'Connect wallet', 'modal' )
    } );
    const $newName = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleSetEntityForm,
      h: V.i18n( 'Name account only', 'modal' )
    } );
    const $key = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-3',
      k: handleGetEntityForm,
      h: V.i18n( 'Login with key', 'modal' )
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
      h: V.i18n( 'Create new account', 'modal' )
    } );
    const $key = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleGetEntityForm,
      h: V.i18n( 'Join with key', 'modal' )
    } );
    V.setNode( $content, [$new, $key] );
    return $content;
  }

  function disconnect() {
    const $content = modalContent();
    const $disc = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleDisconnect,
      h: V.i18n( 'Confirm Disconnect', 'modal' )
    } );
    V.setNode( $content, $disc );
    return $content;
  }

  function mapAddress() {
    const $content = modalContent();
    const $current = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleAddressMapping,
      h: V.i18n( 'Use current name', 'modal' )
    } );
    const $new = V.cN( {
      t: 'p',
      c: altButtonClasses + ' modal-pos-2',
      k: handleSetEntityForm,
      h: V.i18n( 'Create new name', 'modal' )
    } );
    V.setNode( $content, [$current, $new] );
    return $content;
  }

  function entityFound( activeEntity, coinTicker, tokenTicker ) {
    const $content = modalContent();

    const $welcome = V.cN( {
      t: 'div',
      c: 'txt-center pxy',
      h: [
        V.cN( { t: 'p', h: V.i18n( 'Welcome', 'modal' ) } ),
        V.cN( {
          t: 'p',
          c: 'font-medium fs-l pxy',
          h: activeEntity.fullId
        } )
      ]
    } );

    const $uPhrase = V.cN( {
      t: 'div',
      c: 'txt-center',
      h: `<p class="pxy">${ V.i18n( 'Take note of the key', 'modal' ) }</p><p class="modal__uphrase font-medium fs-l pxy">${ activeEntity.private.uPhrase }</p>
      <p class="pxy"> ${ V.i18n( 'You\'ll need this key to manage this entity', 'modal' ) }</p>`
    } );

    let $balance;

    const x = activeEntity.balance;
    if ( x ) {
      $balance = V.cN( {
        t: 'p',
        c: 'modal__details',
        h: `
        ${tokenTicker} ${ V.i18n( 'Live Balance', 'modal' ) }: ${ x.liveBalance }<br>
        ${coinTicker}: ${ x.coinBalance }<br>
        `
      } );
    }
    else {
      $balance = V.cN( {
        t: 'p',
        h: V.i18n( 'Sorry, account details could not be retrieved', 'modal' )
      } );
    }
    V.setNode( $content, [$welcome, $uPhrase, $balance] );
    return $content;
  }

  function entityNotFound() {
    const $content = modalContent();
    const $new = V.cN( {
      t: 'div',
      c: buttonClasses + ' modal-pos-1',
      k: handleSetEntityForm,
      h: V.i18n( 'Name your account', 'modal' )
    } );
    const $descr = V.cN( {
      t: 'p',
      c: 'modal-pos-2 relative txt-center',
      h: V.i18n( 'Naming your account creates a new entity for your address. An entity can be anything you want to make visible in the network.', 'modal' )
    } );

    V.setNode( $content, [$new, $descr] );
    return $content;
  }

  /* ====================== export ====================== */

  return {
    modal: modal,
    modalContent: modalContent,
    simpleMessage: simpleMessage,
    getMetaMask: getMetaMask,
    confirmTransaction: confirmTransaction,
    web3Join: web3Join,
    web2Join: web2Join,
    disconnect: disconnect,
    mapAddress: mapAddress,
    entityFound: entityFound,
    entityNotFound: entityNotFound,
  };

} )();
