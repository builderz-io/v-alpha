var mongoose = require( 'mongoose' );

var entitySchema = mongoose.Schema( {
  fullId: String,
  path: String,
  private: {
    uPhrase: String,
    uuidV4: String,
    base64Url: String,
  },
  profile: {
    fullId: String, // name + tag, e.g. 'Jane Wood #2121'
    // slug: String, // name + tag in slug format, e.g. 'jane-wood-2121'
    path: String, // name + tag in path format, e.g. '/profile/jane-wood-2121'
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
    }
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
    privateKey: String,
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
