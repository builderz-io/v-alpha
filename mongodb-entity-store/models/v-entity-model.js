var mongoose = require( 'mongoose' );

var entitySchema = mongoose.Schema( {
  docVersion: String,
  fullId: String,
  path: String,
  private: {
    uPhrase: String,
    evmCredentials: {
      address: String,
      privateKey: String,
      issuer: String
    }
  },
  profile: {
    fullId: String, // name + tag, e.g. 'Jane Wood #2121'
    title: String,
    tag: String,
    creator: String,
    creatorTag: String,
    role: String,
    joined: {
      date: String,
      unix: Number,
      network: {
        host: String,
        block: Number,
        rpc: String,
        contract: String,
      }
    },
    uuidV4: String
  },
  paths: {
    entity: String, // name + tag in path format, e.g. '/profile/jane-wood-2121'
    base64: String // shall be immutable, the uuidV4 encoded as base64, e.g. '/eBp0cCNDT1aBZqTu4mFeFQ'
  },
  status: {
    active: Boolean,
    verified: Boolean,
  },
  receivingAddresses: {
    evm: String,
  },
  evmCredentials: {
    address: String,
    issuer: String
  },
  symbolCredentials: {
    rawAddress: String,
    address: String,
    privateKey: String,
  },
  geometry: {
    rand: Boolean,
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
  adminOf: [String],
  properties: {
    baseLocation: String,
    currentLocation: String,
    currentUTC: String,
    introduction: String,
    description: String,
    preferredLangs: String,
    target: String,
    unit: String,
    fillUntil: Date,
    expires: Date,
    languages: String,
    appLang: String,
  },
  tinyImage: {
    blob: Buffer,
    contentType: String,
    originalName: String,
    entity: String
  },
  thumbnail: {
    blob: Buffer,
    contentType: String,
    originalName: String,
    entity: String
  },
  social: {
    facebook: String,
    twitter: String,
    telegram: String,
    website: String,
    email: String,
    teleChatID: Number,
    confirmation: {
      time: Number,
      sixDigit: Number,
    }
  },
  questionnaire: {
    q1: String,
    q2: String,
    q3: String,
    q4: String,
    q5: String,
    q6: String,
    q7: String,
    q8: String,
    q9: String,
    q10: String,
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
