const Account = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the transaction history / account display
   *
   */

  'use strict';

  const session = {
    balance: -1,
  };

  /* ================== private methods ================= */

  async function transactionLogger() {

    let all = [];

    const loggedTx = await V.getTransactionLog();

    if ( loggedTx.success ) {
      all = loggedTx.data;
    }

    const currentBlock = await V.getContractState()
      .then( data => data.data[0].currentBlock );

    const lastBlock = V.getState( 'lastBlock' )
      ? V.getState( 'lastBlock' )
      : V.aE().transactions
        ? V.aE().transactions.lastBlock || 0
        : 0;

    const newTx = await V.getTransactions( {
      address: V.cA() || V.aE().evmCredentials.address,
      fromBlock: lastBlock + 1,
      toBlock: currentBlock,
    } );

    if( newTx.success ) {
      all = all.concat( newTx.data );
    }

    const setTxLog = await V.setTransactionLog( {
      success: true,
      lastBlock: currentBlock,
      data: all,
    } );

    if ( !setTxLog.success ) {
      return {
        success: false,
        message: setTxLog.message,
      };
    }

    return {
      success: true,
      data: all,
      currentBlock: currentBlock,
    };
  }

  async function presenter() {

    if ( !V.aE() ) {
      return {
        success: false,
        status: '',
      };
    }

    const txList = await transactionLogger();

    if( !txList.success ) {
      return {
        success: false,
        message: txList.message,
        aE: V.aE(),
        entityBalance: null,
      };
    }

    V.setState( 'lastBlock', txList.currentBlock );

    const bal = await V.getEntityBalance();

    if ( !V.cA() ) {

      /**
       * enhance MongoDB transfers
       *
       */

      for ( const txData of txList.data ) {
        if ( txData.txType == 'fee' ) {
          txData.title = 'Transaction Fee';
        }
        else if ( txData.txType == 'generated' ) {
          txData.title = 'Community Payout';
        }
      }
    }

    return {
      success: true,
      aE: V.aE(),
      entityBalance: bal,
      data: txList.data,
    };

  }

  function view( viewData ) {

    if ( viewData.message && viewData.message.includes( '-200' ) ) {
      Modal.draw( 'confirm uPhrase' );
    }

    const $list = CanvasComponents.list();
    if ( viewData.success && viewData.data.length ) {

      const $topcontent = AccountComponents.topcontent( viewData.aE.fullId, viewData.entityBalance );

      // if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) {
      //   V.setNode( $list, [ InteractionComponents.onboardingCard() ] ); // TODO: should not have to be an Array here
      // }

      for ( const tx of viewData.data.reverse() ) {
        const $cardContent = AccountComponents.accountCard( tx );
        const $card = CanvasComponents.card( $cardContent );
        V.setNode( $list, $card );
      }

      Page.draw( {
        topcontent: $topcontent,
        listings: $list,
      } );
    }
    else {
      V.setNode( $list, CanvasComponents.notFound( 'transaction' ) );
      Page.draw( {
        listings: $list,
      } );
    }
  }

  function preview( path ) {

    const $list = CanvasComponents.list();

    for ( let i = 0; i < 8; i++ ) {
      const $ph = AccountComponents.accountPlaceholderCard();
      const $card = CanvasComponents.card( $ph );

      V.setNode( $list, $card );
    }

    // Button.draw( 'all', { fade: 'out' } );
    MagicButton.draw( 'search' );
    Navigation.draw( path );

    Chat.drawMessageForm( 'no-prefill' );
    Page.draw( {
      topcontent: V.aE() ? AccountComponents.topcontent( V.aE().fullId ) : '',
      listings: $list,
      position: 'top',
    } );
  }

  function drawBalance( balance ) {
    balance = Number( balance );
    if ( session.balance != balance ) {
      session.balance = balance;
      const $navBal = AccountComponents.headerBalance( session.balance );
      V.setNode( 'balance', '' );
      V.setNode( 'balance', $navBal );
    }
    return true;
  }

  /* ================== public methods ================== */

  function drawHeaderBalance( balance, which ) {
    balance && drawBalance( balance )
     || V.getEntityBalance( V.aE() ).then( accState => {

       if ( !accState.success ) {
         return;
       }

       /**
         * Check whether the account has enough coins to transact.
         * If not, send a request to the float-api to send some.
         */
       const float = V.getTokenContract().float;

       if (
         float.coin
          && Number( accState.data[0].tokenBalance ) > 0.1
          && Number( accState.data[0].coinBalance ) < float.threshold
       ) {
         console.warn( 'FLOAT: Address', accState.data[0].address, 'Current Coin Balance', accState.data[0].coinBalance );
         V.setData(
           {
             address: accState.data[0].address,
             coin: float.coin,
             amount: float.amount,
           },
           float.api,
           'api' )
           .then( res => console.warn( res ) )
           .catch( err => console.error( err ) );
       }

       /* draw balance */
       const balance = accState.data[0] ? accState.data[0][ which || 'liveBalance' ] : 'n/a';
       drawBalance( balance );
     } );
  }

  function draw( path ) {
    preview( path );
    presenter().then( viewData => { view( viewData ) } );
  }

  /* ====================== export ====================== */

  return {
    draw: draw,
    drawHeaderBalance: drawHeaderBalance,
  };

} )();
