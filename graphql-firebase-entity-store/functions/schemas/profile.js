// defines Profile schema

const types = {
  Profile: `
    {
      a: ID!           // uuid - as base64 and URL compatible
      b: String        // @context - includes document version
      d: String        // related entity document

      m: Properties
      n: Geometry
      o: Images

      x: RelationsP
      y: DatesP
      z: ChangeLogP

      error: String     // mixin of error message, e.g. "not authorized to update"
    }
  `,
  Properties: `
    {
      a: String       // description
      b: String       // email
      c: String       // preferred languages
      m: Int          // target
      n: String       // unit
    }
  `,
  Geometry: `
    {
      a: [Float]      // base coordinates
      b: String       // base Location
      c: [Float]      // current coordinates
      d: String       // current Location
      z: Boolean      // allocated
    }
  `,
  Images: `
    {
      a: String       // tiny  // data URI
      b: String       // thumb
      c: String       // medium
    }
  `,
  RelationsP: `
    {
      a: String      // creator uuid
      b: [String]    // owned by
    }
  `,
  DatesP: `
    {
      a: String      // created
      b: String      // modified // ONLY on first modification
    }
  `,
  EntryP: `
    {
      a: String        // timestamp
      b: [String]      // fields
      c: [String]      // previous values
    }
  `,
  ChangeLogP: `
    {
      a: [EntryP]       // logging changes to this document // ONLY on first change
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
