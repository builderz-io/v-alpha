/**
 * Defines Entity schema
 *
 * Note: auth and profile data, generated client-side, are submitted by client
 * to retain the idea to move this data to decentralized tech later on.
 *
 */

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

      x: RelationsE
      y: DatesE      // dates and status
      z: ChangeLogE

      zz: Tracked    // track certain profile fields

      holders: [String]          // mixin of fullIds of holders
      holderOf: [PointMixin]     // mixin of point-data and fullId of entities held

      auth: AuthMixin         // mixin of auth data - see note above

    }
  `,
  Tracked: `
    {
      a: String       // description
      b: String       // email

      d: String       // image name on upload

      i: [Float]      // base coordinates
      j: String       // geo hash
      k: String       // base Location

      m: Int          // continent
      n: Int          // avatar

      z: String       // keyword cache
    }
  `,
  RelationsE: `
    {
      a: String      // creator uuid
      m: String      // held by (1)
      n: String      // held by (2)
      o: String      // held by (3)
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

      f: String        // hash of uPhrase and salt

      uPhrase: String  // decrypted uPhrase

      i: String        // evm address
      j: String        // evm address private key

      w: [String]      // auth log
    }
  `,
  PointMixin: `
    {
      a: String
      c: String
      fullId: String
      geo: [Float]
      continent: Int
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
