// defines Entity schema

const types = {
  Entity: `
    {
      a: ID!         // uuid - as base64 and URL compatible
      b: String      // @context - includes document version
      c: String      // @type
      d: String      // related profile document
      e: String      // related auth document

      g: String      // issuer

      i: String      // current EVM Address
      j: String      // receiving EVM Address

      m: String      // title
      n: String      // tag - regular
      o: String      // tag - special // ONLY when purchased

      r: [String]    // held by // UUID array

      x: RelationsE
      y: DatesE      // dates and status
      z: ChangeLogE

      holders: [String]     // mixin of fullIds of holders
      holderOf: [String]    // mixin of fullIds of entities held
      auth: AuthMixin       // mixin of Auth
      error: String         // mixin of error message, e.g. "not authorized to update"
    }
  `,
  RelationsE: `
    {
      a: String      // creator uuid
    }
  `,
  DatesE: `
    {
      a: String      // created
      b: String      // modified // ONLY on first modification
      c: String      // expires
      m: Boolean     // active
      z: Int         // status code
    }
  `,
  EntryE: `
    {
      a: String        // timestamp
      b: [String]      // fields
      c: [String]      // previous values
    }
  `,
  ChangeLogE: `
    {
      a: [EntryE]      // logging changes to this document // ONLY on first change
    }
  `,
  AuthMixin: `
    {
      a: ID!           // uuid - as base64 and URL compatible
      b: String        // @context - includes document version
      d: String        // related entity document
      e: String        // related profile document

      f: String        // auth string

      i: String        // evm address
      j: String        // evm address private key

      w: [String]      // auth log
    }
  `,
};

const helpers = require( './helpers' );

const schemaTypes = Object.keys( types );

let typeDefs = '';

schemaTypes.forEach( schemaType => {
  typeDefs += helpers.castTypeAndInputDefs( schemaType, types[schemaType], schemaTypes );
} );

module.exports = typeDefs;
