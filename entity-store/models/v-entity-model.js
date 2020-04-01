var mongoose = require( 'mongoose' );

var entitySchema = mongoose.Schema( {
  fullId: String, // name + tag
  uPhrase: String,
  credentials: {
    name: String,
    tag: String,
    role: String,
    status: String,
    socketID: String,
  },
  ethCredentials: {
    address: String,
    privKey: String,
    pass: String,
  },
  profile: {
    joined: Date,
    lastLogin: Date,
    loginExpires: Date,
    timeZone: String,
  },
  // owners: [{
  //   ownerName: String,
  //   ownerTag: String,
  // }],
  // admins: [{
  //   adminName: String,
  //   adminTag: String,
  // }],
  properties: {
    description: String,
    creator: String,
    creatorTag: String,
    created: Date,
    fillUntil: Date,
    expires: Date,
    target: String,
    unit: String,
    location: String,
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
  requestStats: {
    lastDate: Date,
    lastPool: String,
    lastAmount: Number,
    totalRequested: Number,
  },
  geometry: {
    type: { type: String },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    }
  },
  cache: {
    txHistoryTable: String,
    description: {
      short: String,
      medium: String,
      long: String,
    }
  },

} );

module.exports = mongoose.model( 'Entity', entitySchema );
