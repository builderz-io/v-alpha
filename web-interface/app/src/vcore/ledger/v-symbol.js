const VSymbol = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Symbol
   *
   */

  'use strict';

  /* ================== private methods ================= */

  /* ============ public methods and exports ============ */

  function setActiveAddress() {
    const Nem = require( '/node_modules/symbol-sdk' ); // eslint-disable-line global-require

    const account = Nem.Account.generateNewAccount( Nem.NetworkType.MIJIN_TEST );
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

  function setMosaicTransaction( data ) {

    const Nem = require( '/node_modules/symbol-sdk' ); // eslint-disable-line global-require
    const tD = V.getSetting( 'tokenDivisibility' );
    const network = V.getNetwork( V.getNetwork( 'choice' ) );

    // 1. Define the TransferTransaction

    const recipientAddress = Nem.Address.createFromRawAddress( data.recipientAddress );

    // replace with network type
    const networkType = Nem.NetworkType.TEST_NET;
    // replace with symbol.xym id
    const networkCurrencyMosaicId = new Nem.MosaicId( '51A99028058245A8' );

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

    /*
    transactionHttp
      .announce( signedTransaction )
      .subscribe( ( x ) => {return console.log( x )}, ( err ) => {return console.error( err )} );
    */
  }

  return {
    setActiveAddress: setActiveAddress,
    setMosaicTransaction: setMosaicTransaction
  };

} )();
