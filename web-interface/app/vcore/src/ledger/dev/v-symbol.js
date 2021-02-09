const VSymbol = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to access Symbol (by NEM) ledgers
   *
   */

  'use strict';

  const Symbol = require( '/node_modules/symbol-sdk' ); // eslint-disable-line global-require
  const network = V.getNetwork();
  const repositoryFactory = new Symbol.RepositoryFactoryHttp( network.rpc );
  const accountHttp = repositoryFactory.createAccountRepository();
  const transactionHttp = repositoryFactory.createTransactionRepository();

  const divisibility = V.getSetting( 'tokenDivisibility' );

  /* ================== private methods ================= */

  /* ================== public methods  ================= */

  function setActiveAddress() {

    const account = Symbol.Account.generateNewAccount( Symbol.NetworkType[network.type] );

    V.setCookie( 'last-active-address', account.address.address );

    return {
      success: true,
      status: 'Symbol credentials created',
      data: [ {
        rawAddress: account.address.pretty(),
        address: account.address.address,
        privateKey: account.privateKey,
      } ],
    };
  }

  async function getAddressState(
    which = V.aA()
  ) {

    const address = Symbol.Address.createFromRawAddress( which );

    const state = await accountHttp.getAccountInfo( address ).toPromise();

    const bal = state.mosaics.map( m => {
      const uInt = new Symbol.UInt64( [m.amount.lower, m.amount.higher] );
      const convert = uInt.compact() / 10**( divisibility );
      return convert;
    } );

    if ( state.address ) {
      return {
        success: true,
        status: 'address state retrieved',
        ledger: 'Symbol',
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
        ledger: 'Symbol',
      };
    }

  }

  async function getAddressHistory(
    which = V.aA()
  ) {

    const address = Symbol.Address.createFromRawAddress( which );

    // Page size between 10 and 100
    const pageSize = 10;
    const queryParams = new Symbol.QueryParams( { pageSize } );

    const transfers = await accountHttp.getAccountTransactions( address, queryParams ).toPromise();
    console.log( transfers );
    const filteredTransfers = transfers.reverse().map( ( tx ) => {
      const txData = {};

      txData.amount = tx.mosaics.map( m => {
        const uInt = new Symbol.UInt64( [m.amount.lower, m.amount.higher] );
        const convert = uInt.compact() / Math.pow( 10, divisibility );
        return convert;
      } );

      txData.fromAddress = tx.signer.address.address;
      txData.toAddress = tx.recipientAddress.address;

      tx.recipientAddress.address == address.address ? txData.txType = 'in' : txData.txType = 'out';

      txData.block = ( function( tx ) {
        const blk = tx.transactionInfo.height;
        const uInt = new Symbol.UInt64( [blk.lower, blk.higher] );
        const convert = uInt.compact();
        return convert;
      } )( tx );

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
        ledger: 'Symbol',
        data: [ filteredTransfers ],
      };
    }
    else {
      return {
        success: false,
        status: 'no transfers',
        ledger: 'Symbol',
      };
    }

  }

  function setMosaicTransaction( data ) {

    // 1. Define the TransferTransaction

    const recipientAddress = Symbol.Address.createFromRawAddress( data.recipientAddress );
    const networkType = Symbol.NetworkType[network.type];
    const networkCurrencyMosaicId = new Symbol.MosaicId( network.mosaicId );

    const transferTransaction = Symbol.TransferTransaction.create(
      Symbol.Deadline.create(),
      recipientAddress,
      [ new Symbol.Mosaic( networkCurrencyMosaicId, Symbol.UInt64.fromUint( data.txTotal * 10**( divisibility ) ) ) ],
      Symbol.PlainMessage.create( data.reference ),
      networkType,
      Symbol.UInt64.fromUint( 2000000 )
    );

    // 2. Sign the transaction

    const account = Symbol.Account.createFromPrivateKey( data.signature, networkType );
    const signedTransaction = account.sign( transferTransaction, network.generationHash );

    // 3. Announce the transaction to the network

    transactionHttp
      .announce( signedTransaction )
      .subscribe( ( x ) => {
        Modal.draw( 'transaction sent' );
        return console.log( x );
      }, ( err ) => console.error( err ) );

  }

  /* ====================== export  ===================== */

  V.setActiveAddress = setActiveAddress;
  V.getAddressState = getAddressState;
  V.setMosaicTransaction = setMosaicTransaction;
  V.getAddressHistory = getAddressHistory;

  return {
    setActiveAddress: setActiveAddress,
    getAddressState: getAddressState,
    setMosaicTransaction: setMosaicTransaction,
    getAddressHistory: getAddressHistory,
  };

} )();
