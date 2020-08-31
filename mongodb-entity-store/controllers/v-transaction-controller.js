const systemInit = require( '../systemInit' );
const findEntities = require( '../lib/find-entities' );
const updateEntities = require( '../lib/transaction-mongodb/update-entities' );
const checkValid = require( '../lib/transaction-mongodb/check-tx-validity' );
const telegramNotification = require( '../lib/telegram' ).adminNotify;

const addRolesSimplified = ( array ) => {

  const a = JSON.parse( JSON.stringify( array[0] ) );
  const b = JSON.parse( JSON.stringify( array[1] ) );
  const c = JSON.parse( JSON.stringify( array[2] ) );
  const d = JSON.parse( JSON.stringify( array[3] ) );

  a['roleInTx'] = 'community';
  b['roleInTx'] = 'taxpool';
  c['roleInTx'] = 'sender';
  d['roleInTx'] = 'recipient';

  return [a, b, c, d];
};

const EntityDB = require( '../models/v-entity-model' );
const TxDB = require( '../models/v-transaction-model' );

// rinkeby builderz
const rpc = 'https://rinkeby.infura.io/v3/32ec6f4ab5544ec3a45473458c3a1638';
const contractAddress = '0x23f1d397Bc94439C6159D618855d6D176CEad4E0'; // '0xfe611d4a98760fC70B030F9c5A418Da07adD18C1'; builderz.io
const chain = 'rinkeby';

const Web3 = require( 'web3' );
const Tx = require( 'ethereumjs-tx' ).Transaction;

const fs = require( 'fs' );
const abi = fs.readFileSync( 'lib/viabi.json' );
const web3 = new Web3( new Web3.providers.HttpProvider( rpc ) );
const contract = new web3.eth.Contract( JSON.parse( abi ), contractAddress );

exports.updateEntities = function( req, res ) {

  /*
  {
    date: '2020-02-27T19:10:56.551Z',
    amount: 980,
    command: 'send',
    sender: 'The Ocean Cleanup #9262',
    recipient: 'Web Developing #9656',
    reference: 'homepage codebase',
    timeSecondsUNIX: 1582830656,
    origMessage: [
      'send',       '980',
      'to',         'Web',
      'Developing', '#9656',

      'for',        'homepage',
      'codebase'
    ]
  }
  */

  const txData = req;

  findEntities.findAllEntities( txData )
    .then( entities => {
      // const txRoleEntities = addTxRole.addTxRole( messageParts, entities );
      const txRoleEntities = addRolesSimplified( entities );

      const checkValidity = checkValid.checkTxValidity( txRoleEntities, txData.amount, txData.timeSecondsUNIX, txData.reference, txData.command );

      if ( checkValidity !== true ) {
        res( {
          success: false,
          status: 'invalid transaction',
          ledger: 'MongoDB',
          message: 'MongoDB tx error: ' + checkValidity } );
      }
      else {
        // Updating MongoDB Accounts
        updateEntities.updateAllEntities( txRoleEntities, txData.amount, txData.feeAmount, txData.contribution, txData.date, txData.timeSecondsUNIX, txData.reference, txData.command ).then( success => {

          telegramNotification( {
            msg: 'MongoDB transaction in',
            network: systemInit.communityGovernance.commName
          } );

          res( {
            success: true,
            status: 'transaction successful',
            message: success,
            ledger: 'MongoDB'
          } );
        } );

      } // close else (valid transaction)

    } )
    .catch( ( err ) => {
      console.log( 'Issue in transaction - ' + err );
      res( {
        success: false,
        status: 'error',
        ledger: 'MongoDB',
        message: err
      } );
    } );

};

exports.findTransaction = function( req, res ) {

  TxDB.find( { fullId: req }, function( err, entities ) {
    if ( err ) {
      res( {
        success: false,
        status: 'error getting transactions',
        message: err,
      } );
    }
    else {
      res( {
        success: true,
        status: 'transactions retrieved from MongoDB',
        data: entities[0].txHistory
      } );
    }
  } );
};

exports.adminNotify = function( txSuccess ) {
  telegramNotification( {
    msg: 'Someone ' + txSuccess + ' transacted funds in',
    network: systemInit.communityGovernance.commName
  } );
};

exports.managedTransaction = async function( req, res ) {

  /* req = {
      date: '2020-08-30T22:07:22.117Z',
      amount: 13,
      feeAmount: 3.9,
      contribution: 0.43,
      txTotal: 17.33,
      currency: 'V',
      command: 'send',
      initiator: 'Tim #8959',
      sender: 'Tim #8959',
      recipient: 'One #9181',
      reference: 'no reference given',
      timeSecondsUNIX: 1598825242,
      origMessage: [ 'send', 'One', '#9181', '13' ]
    } */

  const getSender = await new Promise( resolve => {
    EntityDB.findOne( { fullId: req.sender }, { uPhrase: false } ).exec( function( err, doc ) {
      if ( err ) { resolve( 'Error: ' + err )}
      doc ? resolve( doc ) : resolve( 'not found' );
    } );
  } );

  const getRecipient = await new Promise( resolve => {
    EntityDB.findOne( { fullId: req.recipient }, { uPhrase: false } ).exec( function( err, doc ) {
      if ( err ) { resolve( 'Error: ' + err )}
      doc ? resolve( doc ) : resolve( 'not found' );
    } );
  } );

  const txCount = await web3.eth.getTransactionCount( getSender.evmCredentials.address );

  const amount = toBaseUnit( String( req.txTotal ), 18, web3.utils.BN );

  const rawTransaction = {
    from: getSender.evmCredentials.address,
    nonce: web3.utils.toHex( txCount ),
    gasPrice: web3.utils.toHex( 20 * 1e9 ),
    gasLimit: web3.utils.toHex( 210000 ),
    to: contractAddress,
    value: '0x0',
    data: contract.methods.transfer( getRecipient.evmCredentials.address, amount ).encodeABI(),
  };

  const transaction = new Tx( rawTransaction, { chain: chain } );

  transaction.sign( Buffer.from( getSender.private.evmCredentials.privateKey.slice( 2 ), 'hex' ) );

  web3.eth.sendSignedTransaction( '0x' + transaction.serialize().toString( 'hex' ) )
    .once( 'transactionHash', function( hash ) {
      console.log( 'Managed transaction triggered. Hash: ' + hash );
      res( {
        success: true,
        status: 'transaction transmitted using managed private key',
        data: [ hash ]
      } );
    } )
    .on( 'error', function( error ) {
      console.log( 'Managed Transaction Error: ' + JSON.stringify( error ) );

      res( {
        success: false,
        status: error.code,
        message: error.message,
        data: []
      } );

    } )
    .then( function( receipt ) {
      console.log( 'Managed Transaction Success' /* + JSON.stringify( receipt ) */ );
    } );

};

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
