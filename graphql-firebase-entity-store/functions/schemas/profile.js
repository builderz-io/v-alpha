// defines Profile schema

const types = {
  Profile: `
    {
      a: ID!           // uuid - as base64 and URL compatible
      b: String        // @context - includes document version
      d: String        // related entity document
      f: Int           // privacy setting

      m: Properties
      n: Geometry
      o: Images
      p: TransactionLog
      q: Questionnaire
      s: Servicefields  // fields for free allocation used by plugins or widgets

      x: RelationsP
      y: DatesP
      z: ChangeLogP

    }
  `,
  Properties: `
    {
      a: String       // description
      b: String       // email
      c: String       // preferred languages
      m: Int          // target
      n: String       // unit
      r: String       // filtered description
      s: String       // email private
    }
  `,
  Geometry: `
    {
      a: [Float]      // base coordinates
      b: String       // geo hash
      c: String       // base Location
      g: [Float]      // current coordinates
      h: String       // geo hash
      i: String       // current Location
      z: Int          // default continent
    }
  `,
  Images: `
    {
      a: String       // tiny  // data URI
      b: String       // thumb
      c: String       // medium
      n: String       // name on upload
      z: Int          // default avatar
    }
  `,
  Questionnaire: `
    {
      q1: String     // optional questionnaire, can vary for each network
      q2: String
      q3: String
      q4: String
      q5: String
      q6: String
      q7: String
      q8: String
      q9: String
      q10: String
    }
  `,
  Servicefields: `
    {
      s1: String       // some content
      s2: String
      s3: String
      s4: String
      s5: String
      s6: String
      s7: String
      s8: String
      s9: String
      s10: String
    }
  `,
  RelationsP: `
    {
      a: String      // creator uuid
      m: String      // held by (1)
      n: String      // held by (2)
      o: String      // held by (3)
    }
  `,
  DatesP: `
    {
      a: String      // created
      b: String      // modified // ONLY on first modification
    }
  `,
  DateEntry: `
    {
      a: String        // timestamp
      b: [String]      // fields
      c: [String]      // previous values
    }
  `,
  TransactionLog: `
    {
      a: [TxEntry]       // logging transactions
      z: Int              // last block queried
    }
  `,
  TxEntry: `
    {
      a: String     // txType: "out"
      b: String     // title: "Peter #3454"
      c: String     // message: "n/a"

      g: String     // amount: "27"
      h: String     // feeAmount: "8.10"
      i: String     // contribution: "0.90"
      j: String     // payout: "160"

      m: String     // fromAddress: "0xac6d20f6da9edc85647c8608cb6064794e20ca26"
      n: String     // fromUuidE: "wpjDqsOLZMObw6NHwprCuc"
      o: String     // fromEntity: "Account One #9383"

      p: String     // toAddress: "0x7dce8dd8a0dd6fe300beda9f1f8f87ecc3d1eb2d"
      q: String     // toUuidE: "wpjDqsOLZMObw6NHwprCuc"
      r: String     // toEntity: "0x7dce ... d1eb2d"

      s: String     // hash: "0xfd5b20bc5acdb7bb02f415562c847eb7b1bb961f81b405576be2a42ba3177b0f"
      t: Int        // block: 7587068
      u: Int        // blockDate: 1605964950
      v: Int        // logIndex: 40
    }
  `,
  ChangeLogP: `
    {
      a: [DateEntry]       // logging changes to this document // ONLY on first change
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
