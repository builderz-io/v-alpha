const ChatDB = require( '../models/v-message-model' );

exports.set = function( req, res ) {

  const message = req.msg;
  const date = Date.now(); // moment.unix(Date.now()/1000).format('D MMM YYYY h:mm a');

  const newMessage = new ChatDB( {
    msg: message,
    sender: 'test', //socket.user,
    senderTag: 'test', //socket.userTag,
    time: date
  } );

  newMessage.save( function( err ) {
    if ( err ) {
      res( {
        status: 'error',
        message: err,
      } );
    }
    else {
      res( {
        status: 'success',
        message: 'New Message saved successfully'
      } );
    }
  } );

};
