var mongoose = require( 'mongoose' );

var msgSchema = mongoose.Schema( {
  msg: String,
  sender: String,
  senderTag: String,
  time: Date,
} );

module.exports = mongoose.model( 'Message', msgSchema );
