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

const TxDB = require( '../models/v-transaction-model' );

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
