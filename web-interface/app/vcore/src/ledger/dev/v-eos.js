const VEOS = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to access EOS
   *
   */

  /**
   *        *** ! WORK IN PROGRESS ! ***
   *
   */

  'use strict';

  const network = V.getTokenContract();
  const rpc = new eosjs_jsonrpc.JsonRpc( network.rpc );
  const signatureProvider = new eosjs_jssig.JsSignatureProvider( [network.privKey] );
  const EOS = new eosjs_api.Api( { rpc, signatureProvider } );

  /* ================== private methods ================= */

  /* ================== public methods  ================= */

  function setActiveAddress() {

    const account = 'todo...';

    V.setLocal( 'last-connected-address', 'todo...' );

    return {
      success: true,
      status: 'EOS credentials created',
      data: [ {
        address: account.address,
        privateKey: account.privateKey,
      } ],
    };
  }

  async function getAddressState(
    which = V.cA()
  ) {

    const address = 'todo...';

    const state = await rpc.get_account( 'todo...' );

    if ( state.address ) {
      return {
        success: true,
        status: 'address state retrieved',
        ledger: 'EOS',
        data: [{
          tokenBalance: bal[0].toFixed( 0 ),
          liveBalance: bal[0].toFixed( 0 ),
        }],
      };
    }
    else {
      return {
        success: false,
        status: 'could not retrieve address state',
        ledger: 'EOS',
      };
    }

  }

  async function getAddressHistory(
    which = V.cA()
  ) {

    const address = 'todo...';

    const transfers = await EOS.getActions( 'todo...' );

    const filteredTransfers = transfers.reverse().map( ( tx ) => {
      const txData = {};

      txData.amount = 'todo...';

      txData.fromAddress = tx.signer.address.address;
      txData.toAddress = tx.recipientAddress.address;

      tx.recipientAddress.address == address.address ? txData.txType = 'in' : txData.txType = 'out';

      txData.block = 'todo...';

      txData.logIndex = tx.transactionInfo.index;
      txData.hash = tx.transactionInfo.hash;

      txData.message = ( function( tx ) {
        // TODO
        return '';
      } )( tx );

      console.log( txData );

      return txData;

    } );

    if ( transfers.length ) {
      return {
        success: true,
        status: 'transactions retrieved',
        ledger: 'EOS',
        data: [ filteredTransfers ],
      };
    }
    else {
      return {
        success: false,
        status: 'no transfers',
        ledger: 'EOS',
      };
    }

  }

  async function setEOSTransaction( data ) {

    try {
      const result = await EOS.transact( {
        actions: [{
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{
            actor: 'bob',
            permission: 'active',
          }],
          data: {
            from: 'bob',
            to: 'alice',
            quantity: '0.0001 SYS',
            memo: '',
          },
        }],
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      } );
      console.log( JSON.stringify( result, null, 2 ) );
    }
    catch ( e ) {
      console.error( '\nCaught exception: ' + e );
      if ( e instanceof eosjs_jsonrpc.RpcError ) {
        console.error( '\n\n' + JSON.stringify( e.json, null, 2 ) );
      }
    }

  }

  /* ====================== export  ===================== */

  V.setActiveAddress = setActiveAddress;
  V.getAddressState = getAddressState;
  V.getAddressHistory = getAddressHistory;
  V.setEOSTransaction = setEOSTransaction;

  return {
    setActiveAddress: setActiveAddress,
    getAddressState: getAddressState,
    getAddressHistory: getAddressHistory,
    setEOSTransaction: setEOSTransaction,
  };

} )();
