const { gql } = require( 'apollo-server-express' );

const Profile = require( './profile' );
const Entity = require( './entity' );
const Auth = require( './auth' );

const Queries = `
  type Query {
    getAuth(f: String!): [Auth]
    getEntity(a: String, m: String, n: String, i: String): [Entity]
    getProfile(a: [String!]): [Profile]
  }
`;

const Mutations = `
  type Mutation {
    setEntity(input: InputEntity!): Entity
    setProfile(input: InputProfile!): Profile
  }
`;

const allDefs = gql`${ Queries + Mutations + Profile + Entity + Auth }`;

module.exports = allDefs;
