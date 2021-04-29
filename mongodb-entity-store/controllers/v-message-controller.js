const systemInit = require( '../systemInit' );
const sio = require( '../server-es' ).sio;
const telegramNotification = require( '../lib/telegram' ).adminNotify;

const ChatDB = require( '../models/v-message-model' );

exports.set = function( req, res ) {

  const message = req.message;
  const sender = req.sender;
  const date = Date.now(); // moment.unix(Date.now()/1000).format('D MMM YYYY h:mm a');

  const newMessage = new ChatDB( {
    msg: message,
    sender: sender,
    // senderTag: 'test', //socket.userTag,
    time: date,
  } );

  telegramNotification( {
    msg: 'Someone wrote in',
    network: systemInit.communityGovernance.commName,
  } );

  newMessage.save( function( err ) {
    if ( err ) {
      res( {
        success: false,
        status: err,
      } );
    }
    else {

      sio.emit( 'community message', newMessage );

      res( {
        success: true,
        status: 'new message saved',
      } );
    }
  } );

};

exports.get = function( req, res ) {
  ChatDB.find( {}, function( err, messages ) {
    if ( err ) {
      res( {
        success: false,
        status: 'error getting messages',
        message: err,
      } );
    }
    else {
      res( {
        success: true,
        status: 'messages retrieved',
        data: [messages],
      } );
    }
  } );
};
