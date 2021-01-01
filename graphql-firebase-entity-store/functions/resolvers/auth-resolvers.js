const authDb = require( '../resources/databases-setup' ).authDb;

const colA = authDb.database().ref( 'authentication' ); // col as in "collection"

const resolvers = {
  getAuthDoc: ( token ) => findByToken( colA, token )
};

function findByToken( col, token ) {
  console.log( 111, token );
  return col.once( 'value' )
    .then( snap => snap.val() )
    .then( val => [ Object.values( val ).find( entity => entity.a == token ) ] );
}

module.exports = resolvers;
