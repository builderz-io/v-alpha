var mongoose = require( 'mongoose' );

var entitySchema = mongoose.Schema( {
  fullId: String, // name + tag
  activeAddress: String,
  uPhrase: String,
  profile: {
    fullId: String,
    title: String,
    tag: String,
    role: String,
    status: String,
    // socketID: String,
    verified: Boolean,
    joined: {
      date: String,
      unix: Number,
      block: Number,
    },
    creator: String,
    creatorTag: String,
  },
  evmCredentials: {
    address: String,
    privateKey: String,
  },
  symbolCredentials: {
    address: String,
    privateKey: String,
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
  owners: [{
    ownerName: String,
    ownerTag: String,
  }],
  admins: [{
    adminName: String,
    adminTag: String,
  }],
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
