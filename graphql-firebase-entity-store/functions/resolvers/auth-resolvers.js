const authDb = require( '../resources/databases-setup' ).authDb;

const colA = authDb.database().ref( 'authentication' ); // col as in "collection"

const resolvers = {
  getAuthDoc: ( token ) => findByToken( colA, token )
};

function findByToken( col, token ) {
  return col.once( 'value' )
    .then( snap => snap.val() )
    .then( val => [ Object.values( val ).find( entity => entity.f == token ) ] );
}

module.exports = resolvers;
