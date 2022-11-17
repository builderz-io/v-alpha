const settings = {
  floatEthAmount: 0.05,
  autoVerify: true,
  txGasPriceMplr: 1.1, // used in managed tx
  txIncGasPriceMplr: 1.3, // used in managed tx
  verifyGasPriceMplr: 1.5, // used in verification
  gasLimit: 200000, // used in all tx
  // gasPrice: 80, // in Gwei // x * 1e9 = Gwei
};

const collP = global.db.collP;

const findAuth = require( './find-by-auth' );

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

async function managedTransaction( txData, increase ) {

  const getSenderAuth = await findAuth( txData.initiatorAddress );
  // getSenderAuth = getSenderAuth[0];
  const gasPriceOffer = await castGasPriceOffer( increase == 'gas' ? 'txInc' : 'tx' );

  let txCount = await web3.eth.getTransactionCount( getSenderAuth.i );

  increase == 'nonce' && ( txCount += 1 );

  const amount = toBaseUnit( String( txData.txTotal ), 18, web3.utils.BN );

  const rawTransaction = {
    from: getSenderAuth.i,
    nonce: web3.utils.toHex( txCount ),
    gasPrice: gasPriceOffer,
    gasLimit: web3.utils.toHex( settings.gasLimit ),
    to: contractAddress,
    value: '0x0',
    data: contract.methods.transfer( txData.recipientAddress, amount ).encodeABI(),
  };

  const transaction = new Tx( rawTransaction, { chain: credentials.float.chain } );

  transaction.sign( Buffer.from( getSenderAuth.j.slice( 2 ), 'hex' ) );

  return web3.eth.sendSignedTransaction( '0x' + transaction.serialize().toString( 'hex' ) )
    .once( 'transactionHash', function( hash ) {
      console.log( 'Managed transaction triggered. Hash: ' + hash );
      collP.child( getSenderAuth.e ).update( { 'p/t': hash } );
    } )
    .on( 'error', function( error ) {
      console.log( 'Managed Transaction Error: ' + JSON.stringify( error ) );
    } )
    .then( function( receipt ) {
      console.log( 'Managed Transaction Success' /* + JSON.stringify( receipt ) */ );
      return {
        success: true,
        data: receipt,
      };
    } )
    .catch( error => {
      execCounts[txData.recipientAddress].managed += 1;

      if ( execCounts[txData.recipientAddress].managed > 3 ) {
        return {
          success: false,
          error: error,
        };
      }

      if (
        error.message.includes( 'replacement transaction underpriced' )
      ) {
        return managedTransaction( txData /*, 'gas' */ );
      }
      else if (
        error.message.includes( 'already known' )
      ) {
        return managedTransaction( txData /*, 'nonce' */ );
      }
      else {
        return managedTransaction( txData );
      }

    } );

}

async function floatEth( which ) {
  console.log( 'Float address: ', which );
  console.log( 'Float account: ', web3.eth.defaultAccount );

  const gasPriceOffer = await castGasPriceOffer( 'verify' );

  const txObject = {
    from: web3.eth.defaultAccount,
    to: which,
    value: web3.utils.toWei( settings.floatEthAmount.toString(), 'ether' ),
    gasPrice: gasPriceOffer,
    gas: 21000,
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
          data: receipt,
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

async function verify( which ) {
  console.log( 'Verification address: ', which );
  console.log( 'Verification account: ', web3.eth.defaultAccount );

  const gasPriceOffer = await castGasPriceOffer( 'verify' );

  return contract.methods.verifyAccount( which ).send( {
    from: web3.eth.defaultAccount,
    gasPrice: gasPriceOffer,
    gasLimit: web3.utils.toHex( settings.gasLimit ),
  } )
    .once( 'transactionHash', ( hash ) => {
      console.log( 'Verification Hash: ', hash );
      // colP.child( /* todo */ ).update( { 'p/v': hash } );
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

async function castGasPriceOffer( which ) {
  const block = await web3.eth.getBlock( 'latest' );
  return web3.utils.toHex(
    Math.floor(
      web3.utils.hexToNumber( block.baseFeePerGas )
      * settings[which  + 'GasPriceMplr'],
    ),
  );
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
