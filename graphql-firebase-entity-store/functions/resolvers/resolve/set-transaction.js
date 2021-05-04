const settings = {
  floatEthAmount: 10000,
  autoVerify: true,
};

const findEntity = require( './find-by-evmaddress' );
const findAuth = require( './find-by-auth-doc' );

// setup web3 stuff
const credentials = require( '../../credentials/credentials' );
const rpc = credentials.float.rpc;
const contractAddress = credentials.float.contractAddress;

const Web3 = require( 'web3' );
const Tx = require( 'ethereumjs-tx' ).Transaction;
const web3 = new Web3( rpc );
const abi = require( '../../resources/viabi.json' ); // using require here
const contract = new web3.eth.Contract( abi, contractAddress ); // using abi without JSON.parse here

const account = web3.eth.accounts.privateKeyToAccount( credentials.float.privKey );
web3.eth.accounts.wallet.add( account );
web3.eth.defaultAccount = account.address;

const execCounts = {};

module.exports = async ( context, tx, type ) => {
  // console.log( 'got:', context, tx, type );

  execCounts[tx.recipientAddress] ? null : execCounts[tx.recipientAddress] = {
    managed: 0,
    float: 0,
    verify: 0,
  };

  if ( 'managed' == type ) {
    return managedTransaction( tx );
  }
  else if ( 'float' == type ) {
    return floatEth( tx.recipientAddress );
  }
  else if ( 'verify' == type ) {
    return verify( tx.recipientAddress );
  }
};

async function managedTransaction( txData ) {

  const getSenderAuth = await new Promise( resolve => {
    findEntity( {}, txData.initiatorAddress )
      .then( entity => findAuth( entity[0].e ) )
      .then( authDoc => resolve( authDoc[0] ) );
  } );

  const txCount = await web3.eth.getTransactionCount( getSenderAuth.i );

  const amount = toBaseUnit( String( txData.txTotal ), 18, web3.utils.BN );

  const rawTransaction = {
    from: getSenderAuth.i,
    nonce: web3.utils.toHex( txCount ),
    gasPrice: web3.utils.toHex( 20 * 1e9 ),
    gasLimit: web3.utils.toHex( 210000 ),
    to: contractAddress,
    value: '0x0',
    data: contract.methods.transfer( txData.recipientAddress, amount ).encodeABI(),
  };

  const transaction = new Tx( rawTransaction, { chain: credentials.float.chain } );

  transaction.sign( Buffer.from( getSenderAuth.j.slice( 2 ), 'hex' ) );

  return web3.eth.sendSignedTransaction( '0x' + transaction.serialize().toString( 'hex' ) )
    .once( 'transactionHash', function( hash ) {
      console.log( 'Managed transaction triggered. Hash: ' + hash );
    } )
    .on( 'error', function( error ) {
      console.log( 'Managed Transaction Error: ' + JSON.stringify( error ) );
    } )
    .then( function( receipt ) {
      console.log( 'Managed Transaction Success' /* + JSON.stringify( receipt ) */ );
      return {
        success: true,
        message: receipt,
      };
    } )
    .catch( error => {
      execCounts[txData.recipientAddress].managed += 1;
      if ( execCounts[txData.recipientAddress].managed < 3 ) {
        return managedTransaction( txData );
      }
      else {
        return {
          success: false,
          error: error,
        };
      }
    } );

}

async function floatEth( which ) {
  console.log( 'Address to float: ', which );

  const txObject = {
    from: web3.eth.defaultAccount,
    to: which,
    value: web3.utils.toWei( settings.floatEthAmount.toString(), 'ether' ),
    gas: 6001000,
  };

  return web3.eth.sendTransaction( txObject )
    .once( 'transactionHash', function( hash ) {
      console.log( 'Float ETH Transaction Hash: ' + hash );
    } )
    .on( 'error', function( error ) {
      console.log( 'Float ETH Transaction Error: ' + error );
    } )
    .then( function( receipt ) {
      console.log( 'Float ETH Transaction Success' /* + JSON.stringify( receipt ) */ );

      /* auto verify */
      if ( settings.autoVerify ) {
        return verify( which );
      }
      else {
        return {
          success: true,
          message: receipt,
        };
      }
    } )
    .catch( error => {
      execCounts[which].float += 1;
      if ( execCounts[which].float < 3 ) {
        return floatEth( which );
      }
      else {
        return {
          success: false,
          error: error,
        };
      }
    } );

}

function verify( which ) {
  console.log( 'Address to verify: ', which );
  return contract.methods.verifyAccount( which ).send( { from: web3.eth.defaultAccount, gas: 6001000 } )
    .once( 'transactionHash', ( hash ) => {
      console.log( 'Verification Hash: ', hash );
      // contract.methods.accountApproved( ethAddress ).call( ( err, result ) => {
      //   console.log( 'accountApproved result (confirm):', result, ' error: ', err );
      // } );
    } )
    .on( 'error', function( error ) {
      console.log( 'Verification Error: ' + error );
    } )
    .then( function( receipt ) {
      console.log( 'Verification Success' /* + JSON.stringify( receipt ) */ );
      return {
        success: true,
        data: receipt,
      };
    } )
    .catch( error => {
      execCounts[which].verify += 1;
      if ( execCounts[which].verify < 3 ) {
        return verify( which );
      }
      else {
        return {
          success: false,
          error: error,
        };
      }
    } );
}

function isString( s ) {
  return ( typeof s === 'string' || s instanceof String );
}

function toBaseUnit( value, decimals, BN ) {
  // https://ethereum.stackexchange.com/questions/41506/web3-dealing-with-decimals-in-erc20
  if ( !isString( value ) ) {
    throw new Error( 'Pass strings to prevent floating point precision issues.' );
  }
  const ten = new BN( 10 );
  const base = ten.pow( new BN( decimals ) );

  // Is it negative?
  const negative = ( value.substring( 0, 1 ) === '-' );
  if ( negative ) {
    value = value.substring( 1 );
  }

  if ( value === '.' ) {
    throw new Error(
      `Invalid value ${value} cannot be converted to`
    + ` base unit with ${decimals} decimals.` );
  }

  // Split it into a whole and fractional part
  const comps = value.split( '.' );
  if ( comps.length > 2 ) { throw new Error( 'Too many decimal points' ) }

  let whole = comps[0], fraction = comps[1];

  if ( !whole ) { whole = '0' }
  if ( !fraction ) { fraction = '0' }
  if ( fraction.length > decimals ) {
    throw new Error( 'Too many decimal places' );
  }

  while ( fraction.length < decimals ) {
    fraction += '0';
  }

  whole = new BN( whole );
  fraction = new BN( fraction );
  let wei = ( whole.mul( base ) ).add( fraction );

  if ( negative ) {
    wei = wei.neg();
  }

  return new BN( wei.toString( 10 ), 10 );
}
