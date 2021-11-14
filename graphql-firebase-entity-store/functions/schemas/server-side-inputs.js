/**
 * Defines Input schemas when used server side
 *
 */

const types = {
  EntityInputServerSide: `
    {
      a: ID!         // uuid (E)

      c: String      // @type

      i: String      // current EVM Address
      j: String      // receiving EVM Address

      m: String      // title

      y: DatesEInputServerSide      // dates and status

      authInputServerSide: AuthMixinInputServerSide
      profileInputServerSide: ProfileMixinInputServerSide
    }
  `,
  AuthMixinInputServerSide: `
    {
      i: String        // evm address
      j: String        // evm address private key
    }
  `,
  ProfileMixinInputServerSide: `
    {
      descr: String
      email: String
      emailPrivate: String
      target: Int
      unit: String
      lngLat: [Float]
      loc: String
      tinyImg: String
      thumb: String
      medImg: String
      imgName: String
    }
  `,
  DatesEInputServerSide: `
    {
      m: Boolean     // active
    }
  `,
  ProfileInputServerSide: `
    {
      a: ID!            // uuid (P)

      m: InputProperties
      n: InputGeometry
      o: InputImages
      p: InputTransactionLog
      q: InputQuestionnaire
    }
  `,
  ImageInputServerSide: `
    {
      a: ID!            // uuid (P)

      o: InputImages
      x: InputRelationsP

    }
  `,
};

const helpers = require( './helpers' );

const schemaTypes = Object.keys( types );

let typeDefs = '';

schemaTypes.forEach( schemaType => {
  typeDefs += helpers.castInputServerSideDefs( schemaType, types[schemaType], schemaTypes );
} );

module.exports = typeDefs;
