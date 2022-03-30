String.prototype.uncomment = function() {
  return this.replace( /\s+\/\/\s.+/g, '' );
};

const settings = {
  useClientData: false, // also change in set-namespace.js + in frontend
};

const { gql } = require( 'apollo-server-express' );

const Profile = require( './profile' );
const Auth = require( './auth' );
const Entity = require( './entity' );
const ServerSideInputs = require( './server-side-inputs' );

const Filters = `
  input Filter {
    query: String
    role: String
    field: String
    mapState: String
    isAutofill: Boolean
  }

  input WhereEntity {
    a: [String]
    m: String
    n: String
    i: String
  }

  input WhereProfile {
    a: String
  }

  input WhereGeo {
    i: String
  }

  type Image {
    a: String
    o: Images
    x: RelationsP
  }

  type Highlight {
    a: String
    y: Int
  }

  input InputHighlight {
    a: String
    y: InputHighlightY
  }

  input InputHighlightY {
    c: Int
  }

  type Point {
    a: String
    c: String
    d: String
    zz: PointZz
  }

  type PointZz {
    i: [Float]
    m: Int
  }
`;

const Transaction = `
  input InputTransaction {
    initiatorAddress: String
    recipientAddress: String
    txTotal: String
  }
  type SuccessTx {
    success: Boolean
    error: String
    data: ReceiptTx
  }
  type ReceiptTx {
    blockNumber: Int
    transactionHash: String
  }
`;

const Jwt = `
  type Jwt {
    success: Boolean
    message: String
    uuidE: String
    uuidP: String
    exp: Int
    jwt: String
    tempRefresh: String
  }
  type Success {
    success: Boolean
  }
`;

const Queries = `
  type Query {
    getEntities(where: WhereEntity): [Entity]
    getProfiles(array: [String!]): [Profile]
    getEntityQuery(filter: Filter!): [Entity]
    getProfile(where: WhereProfile): [Profile]
    getPoints(where: WhereGeo): [Point]
    getHighlights: [Highlight]
    getImage(where: WhereProfile): [Image]
  }
`;

const Mutations = `
  type Mutation {
    setAuth: Jwt
    setDisconnect: Success
    setTransaction(tx: InputTransaction!): SuccessTx
    setHighlight(input: InputHighlight!): Highlight
    setEntity(input: ${ settings.useClientData ? 'InputEntity' : 'EntityInputServerSide' }!): Entity
    setProfile(input: ${ settings.useClientData ? 'InputProfile' : 'ProfileInputServerSide' }!): Profile
    setImage(input: ImageInputServerSide!): Image
  }
`;

const allDefs = gql`${ Filters + Transaction + Jwt + Queries + Mutations + Profile + Auth + Entity + ServerSideInputs }`;

module.exports = allDefs;
