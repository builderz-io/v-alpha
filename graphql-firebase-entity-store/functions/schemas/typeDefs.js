const { gql } = require( 'apollo-server-express' );

const Profile = require( './profile' );
const Entity = require( './entity' );

const Queries = `
  type Query {
    getEntity(m: String, n: String, i: String): [Entity]
    getProfile(a: [String!]): [Profile]
  }
`;

const Mutations = `
  type Mutation {
    setEntity(input: InputEntity!): Entity
    setProfile(input: InputProfile!): Profile
  }
`;

const allDefs = gql`${ Queries + Mutations + Profile + Entity }`;

module.exports = allDefs;
