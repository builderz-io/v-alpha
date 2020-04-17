const VSymbol = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Symbol
   *
   */

  'use strict';

  let Nem;
  let network;
  let tD;

  // launch()

  /* ================== private methods ================= */

  function launch() {
    // TODO
  }

  /* ============ public methods and exports ============ */

  function setActiveAddress() {
    const Nem = require( '/node_modules/symbol-sdk' ); // eslint-disable-line global-require
    const network = V.getNetwork( V.getNetwork( 'choice' ) );

    const account = Nem.Account.generateNewAccount( Nem.NetworkType[network.type] );
    // console.log( 'Your new account address is:', account.address.pretty(), 'and its private key is:', account.privateKey );
    return {
      success: true,
      status: 'Symbol credentials created',
      data: [ {
        address: account.address.pretty(),
        privateKey: account.privateKey
      } ]
    };
  }

  async function getAddressState( which ) {
    const Nem = require( '/node_modules/symbol-sdk' ); // eslint-disable-line global-require
    const network = V.getNetwork( V.getNetwork( 'choice' ) );
    const tD = V.getSetting( 'tokenDivisibility' );

    const address = Nem.Address.createFromRawAddress( which );

    const repositoryFactory = new Nem.RepositoryFactoryHttp( network.rpc );
    const accountHttp = repositoryFactory.createAccountRepository();

    const state = await accountHttp.getAccountInfo( address ).toPromise();
    console.log( state );

    const bal = state.mosaics.map( m => {
      const uInt = new Nem.UInt64( [m.amount.lower, m.amount.higher] );
      const convert = uInt.compact() / Math.pow( 10, tD );
      return convert;
    } );

    if ( state.address ) {
      return {
        success: true,
        status: 'address state retrieved',
        ledger: 'Symbol',
        data: [{
          tokenBalance: bal,
          liveBalance: bal,
        }]
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
    which = V.getState( 'activeAddress' )
  ) {
    const Nem = require( '/node_modules/symbol-sdk' ); // eslint-disable-line global-require
    const network = V.getNetwork( V.getNetwork( 'choice' ) );
    const tD = V.getSetting( 'tokenDivisibility' );

    const address = Nem.Address.createFromRawAddress( which );

    const repositoryFactory = new Nem.RepositoryFactoryHttp( network.rpc );
    const accountHttp = repositoryFactory.createAccountRepository();
    // Page size between 10 and 100
    const pageSize = 10;
    const queryParams = new Nem.QueryParams( { pageSize } );

    const transfers = await accountHttp.getAccountTransactions( address, queryParams ).toPromise();
    console.log( transfers );

    const filteredTransfers = transfers.map( ( tx ) => {
      const txData = {};

      txData.amount = tx.mosaics.map( m => {
        const uInt = new Nem.UInt64( [m.amount.lower, m.amount.higher] );
        const convert = uInt.compact() / Math.pow( 10, tD );
        return convert;
      } );

      txData.fromAddress = '';
      txData.toAddress = tx.recipientAddress.address;

      txData.txType = '';

      txData.block = ( function( tx ) {
        const blk = tx.transactionInfo.height;
        const uInt = new Nem.UInt64( [blk.lower, blk.higher] );
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
        data: [ filteredTransfers ]
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

    const Nem = require( '/node_modules/symbol-sdk' ); // eslint-disable-line global-require
    const tD = V.getSetting( 'tokenDivisibility' );
    const network = V.getNetwork( V.getNetwork( 'choice' ) );

    // 1. Define the TransferTransaction

    const recipientAddress = Nem.Address.createFromRawAddress( data.recipientAddress );
    const networkType = Nem.NetworkType[network.type];
    const networkCurrencyMosaicId = new Nem.MosaicId( network.mosaicId );

    const transferTransaction = Nem.TransferTransaction.create(
      Nem.Deadline.create(),
      recipientAddress,
      [ new Nem.Mosaic( networkCurrencyMosaicId, Nem.UInt64.fromUint( 10 * Math.pow( 10, tD ) ) ) ],
      Nem.PlainMessage.create( data.reference ),
      networkType,
      Nem.UInt64.fromUint( data.amount * tD )
    );
    console.log( transferTransaction );

    // 2. Sign the transaction

    const account = Nem.Account.createFromPrivateKey( data.signature, networkType );
    const signedTransaction = account.sign( transferTransaction, network.generationHash );

    console.log( signedTransaction );

    // 3. Announce the transaction to the network

    const repositoryFactory = new Nem.RepositoryFactoryHttp( network.rpc );
    const transactionHttp = repositoryFactory.createTransactionRepository();

    console.log( transactionHttp );

    transactionHttp
      .announce( signedTransaction )
      .subscribe( ( x ) => {
        Modal.draw( 'transaction sent' );
        return console.log( x );
      }, ( err ) => {
        return console.error( err );
      } );

  }

  return {
    setActiveAddress: setActiveAddress,
    getAddressState: getAddressState,
    setMosaicTransaction: setMosaicTransaction,
    getAddressHistory: getAddressHistory
  };

} )();
