// defines Auth schema

const types = {
  DatesA: `
    {
      a: String      // created
      b: String      // modified // ONLY on first modification
    }
  `,
  EntryA: `
    {
      a: String        // timestamp
      b: [String]      // fields
      c: [String]      // previous values
    }
  `,
  ChangeLogA: `
    {
      a: [EntryA]       // logging changes to this document // ONLY on first change
    }
  `,
  Auth: `
    {
      a: ID!           // uuid - as base64 and URL compatible
      b: String        // @context - includes document version

      f: String        // auth string

      m: [String]
      n: [String]

      y: DatesA
      z: ChangeLogA
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
