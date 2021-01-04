// defines Entity schema

const types = {
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
  Entity: `
    {
      a: ID!         // uuid - as base64 and URL compatible
      b: String      // @context - includes document version
      c: String      // @type
      d: String      // related profile document
      e: String      // related auth document

      g: String      // issuer

      i: String      // Current EVM Address
      j: String      // receiving EVM Address

      m: String      // title
      n: String      // tag - regular
      o: String      // tag - special // ONLY when purchased

      x: RelationsE
      y: DatesE      // Dates and Status
      z: ChangeLogE

      private: String  // mixin of uphrase and privateKey from Auth
      error: String  // mixin of error message
    }
  `
};

const helpers = require( './helpers' );

const schemaTypes = Object.keys( types );

let typeDefs = '';

schemaTypes.forEach( schemaType => {
  typeDefs += helpers.castTypeAndInputDefs( schemaType, types[schemaType], schemaTypes );
} );

module.exports = typeDefs;
