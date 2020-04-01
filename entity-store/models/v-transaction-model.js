var mongoose = require( 'mongoose' );

var txSchema = mongoose.Schema( {
  fullId: String, // name + tag
  name: String,
  tag: String,
  txHistory: [{
    date: Date,
    initiator: String,
    initiatorTag: String,
    from: String,
    fromTag: String,
    to: String,
    toTag: String,
    for: String,
    senderFee: Number,
    burned: Number,
    tt0: Number,
    credit: Number,
    debit: Number,
    chainBalance: Number,
  }]
} );

module.exports = mongoose.model( 'Transaction', txSchema );
