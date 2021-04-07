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
  }

  input WhereEntity {
    a: String
    m: String
    n: String
    i: String
  }
`;

const Jwt = `
  type Jwt {
    success: Boolean
    message: String
    uuidE: String
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
    getAuth(token: String!): Success
    getEntityQuery(filter: Filter!): [Entity]
    getEntity(where: WhereEntity): [Entity]
    getProfiles(array: [String!]): [Profile]
  }
`;

const Mutations = `
  type Mutation {
    setAuth: Jwt
    setDisconnect: Success
    setEntity(input: ${ settings.useClientData ? 'InputEntity' : 'EntityInputServerSide' }!): Entity
    setProfile(input: ${ settings.useClientData ? 'InputProfile' : 'ProfileInputServerSide' }!): Profile
  }
`;

const allDefs = gql`${ Filters + Jwt + Queries + Mutations + Profile + Auth + Entity + ServerSideInputs }`;

module.exports = allDefs;
