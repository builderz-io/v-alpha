const { gql } = require( 'apollo-server-express' );

const Profile = require( './profile' );
const Entity = require( './entity' );
const Auth = require( './auth' );

const Filters = `
  input TitleFilter {
    query: String
    role: String
  }
`;

const Queries = `
  type Query {
    getAuth(token: String!): [Auth]
    getEntityQuery(filter: TitleFilter!): [Entity]
    getEntity(a: String, m: String, n: String, i: String): [Entity]
    getProfiles(array: [String!]): [Profile]
  }
`;

const Mutations = `
  type Mutation {
    setEntity(input: InputEntity!): Entity
    setProfile(input: InputProfile!): Profile
  }
`;

const allDefs = gql`${ Filters + Queries + Mutations + Profile + Entity + Auth }`;

module.exports = allDefs;
