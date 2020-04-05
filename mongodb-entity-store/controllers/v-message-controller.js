const ChatDB = require( '../models/v-message-model' );

exports.set = function( req, res ) {

  const message = req.message;
  const sender = req.sender;
  const date = Date.now(); // moment.unix(Date.now()/1000).format('D MMM YYYY h:mm a');

  const newMessage = new ChatDB( {
    msg: message,
    sender: sender,
    // senderTag: 'test', //socket.userTag,
    time: date
  } );

  newMessage.save( function( err ) {
    if ( err ) {
      res( {
        success: false,
        status: err,
      } );
    }
    else {
      res( {
        success: true,
        status: 'new message saved'
      } );
    }
  } );

};
