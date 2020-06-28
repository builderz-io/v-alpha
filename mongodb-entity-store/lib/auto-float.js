// kovan2
const rpc = 'https://kovan.infura.io/v3/199ad2592bb243e2b00118d4c6de0641';
const contractAddress = '0xA4788b5EB689fd886AD4Ee27119D89DC587c084E';
const privKey = '0xEE755BDE43408CAC383752931F4D6C41AAE12CEBDAAE69FF4855560548E86D75';

// // trufflePAV2
// const rpc = 'http://127.0.0.1:9545/';
// const contractAddress = '0x7F4c6BA99864fCF201f6cb07B0DF8dA0ffD0b818';
// const privKey = '0xae458e1123dede0b9efb6880f55bc63174b4ea8d76d2e8e59e841083d04aebe3';

const amount = 0.01;

const Web3 = require( 'web3' );
const fs = require( 'fs' );
const abi = fs.readFileSync( 'lib/viabi.json' );
const web3 = new Web3( rpc );
const contract = new web3.eth.Contract( JSON.parse( abi ), contractAddress );
const account = web3.eth.accounts.privateKeyToAccount( privKey );

web3.eth.accounts.wallet.add( account );
web3.eth.defaultAccount = account.address;

exports.autoFloat = async which => {
  console.log( 'Address to float: ' );
  console.log( which );

  /*
   * auto float some Ether, then verify account
   *
   */

  const txObject = {
    from: web3.eth.defaultAccount,
    to: which,
    value: web3.utils.toWei( amount.toString(), 'ether' ),
    gas: 6001000,
  };

  return web3.eth.sendTransaction( txObject )
    .once( 'transactionHash', function( hash ) {
      console.log( 'Transaction Hash: ' + hash );
    } )
    .on( 'error', function( error ) { console.log( 'Transaction Error: ' + error ) } )
    .then( function( receipt ) {
      console.log( 'Transaction Success' /* + JSON.stringify( receipt ) */ );

      /* auto verify */

      contract.methods.verifyAccount( which ).send( { from: web3.eth.defaultAccount, gas: 6001000 } )
        .on( 'transactionHash', ( hash ) => {
          console.log( 'Verification Hash: ', hash );
          // contract.methods.accountApproved( ethAddress ).call( ( err, result ) => {
          //   console.log( 'accountApproved result (confirm):', result, ' error: ', err );
          // } );
        } )
        .on( 'error', function( error ) { console.log( 'Verification Error: ' + error ) } )
        .then( function( receipt ) {
          console.log( 'Verification Success' /* + JSON.stringify( receipt ) */ );

        } );

    } );

};
