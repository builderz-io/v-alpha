var mongoose = require( 'mongoose' );

var entitySchema = mongoose.Schema( {
  fullId: String, // name + tag
  evmAddress: String,
  // uPhrase: String,
  profile: {
    fullId: String,
    title: String,
    tag: String,
    role: String,
    // status: String,
    // socketID: String,
    joined: {
      date: String,
      unix: Number,
      block: Number,
    }
  },
  evmCredentials: {
    address: String,
    privKey: String,
  },
  geometry: {
    type: { type: String },
    coordinates: [Number],
  },
  // profile: {
  //   joined: Date,
  //   lastLogin: Date,
  //   loginExpires: Date,
  //   timeZone: String,
  // },
  // owners: [{
  //   ownerName: String,
  //   ownerTag: String,
  // }],
  // admins: [{
  //   adminName: String,
  //   adminTag: String,
  // }],
  properties: {
    location: String,
    description: String,
    target: String,
    unit: String,
    creator: String,
    creatorTag: String,
    created: Date,
    fillUntil: Date,
    expires: Date,
    languages: String,
  },
  social: {
    fb: String,
    tw: String,
    web: String,
    tele: String,
    teleChatID: Number,
    email: String,
    confirmation: {
      time: Number,
      sixDigit: Number,
    }
  },
  onChain: {
    balance: Number,
    lastMove: Number,
    timeToZero: Number,
  },
  stats: {
    sendVolume: Number,
    receiveVolume: Number,
    allTimeVolume: Number,
  },

} );

module.exports = mongoose.model( 'Entity', entitySchema );
