const credentials = require( '../credentials/credentials' );
const rpc = credentials.float.rpc;
const contractAddress = credentials.float.contractAddress;
const privKey = credentials.float.privKey;

const amount = 0.05;

const Web3 = require( 'web3' );
const web3 = new Web3( rpc );

const abi = require( '../resources/viabi.json' ); // using require here
const contract = new web3.eth.Contract( abi, contractAddress ); // using abi without JSON.parse here

const account = web3.eth.accounts.privateKeyToAccount( privKey );
web3.eth.accounts.wallet.add( account );
web3.eth.defaultAccount = account.address;

const execCounts = {};

module.exports.autoFloat = which => {
  console.log( 'Address to float: ', which );

  /*
   * auto float some Ether, then verify account
   *
   */

  if ( !execCounts[which] ) {
    execCounts[which] = {};
    execCounts[which].float = 0;
    execCounts[which].verify = 0;
  }

  const txObject = {
    from: web3.eth.defaultAccount,
    to: which,
    value: web3.utils.toWei( amount.toString(), 'ether' ),
    gas: 6001000,
  };

  return web3.eth.sendTransaction( txObject )
    .once( 'transactionHash', function( hash ) {
      console.log( 'Float ETH Transaction Hash: ' + hash );
    } )
    .on( 'error', function( error ) {
      console.log( 'Float ETH Transaction Error: ' + error );
      execCounts[which].float += 1;
      if ( execCounts[which].float <= 3 ) {
        exports.autoFloat( which );
      }
    } )
    .then( function( receipt ) {
      console.log( 'Float ETH Transaction Success' /* + JSON.stringify( receipt ) */ );

      /* auto verify */
      verify( which );

    } );

};

function verify( which ) {
  contract.methods.verifyAccount( which ).send( { from: web3.eth.defaultAccount, gas: 6001000 } )
    .on( 'transactionHash', ( hash ) => {
      console.log( 'Verification Hash: ', hash );
      // contract.methods.accountApproved( ethAddress ).call( ( err, result ) => {
      //   console.log( 'accountApproved result (confirm):', result, ' error: ', err );
      // } );
    } )
    .on( 'error', function( error ) {
      console.log( 'Verification Error: ' + error );
      execCounts[which].verify += 1;
      if ( execCounts[which].verify <= 3 ) {
        verify( which );
      }
    } )
    .then( function( receipt ) {
      console.log( 'Verification Success' /* + JSON.stringify( receipt ) */ );

    } );
}
