// Connect to firebase database
const { namespaceDb } = require( '../../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

const castObjectPaths = require( './cast-object-paths' );

module.exports = ( uuidE, data ) => {
  const track = {
    search: {
      a: data.m ? data.m.a : undefined,  // description
      b: data.m ? data.m.b : undefined,  // email
      c: data.n ? data.n.b : undefined,  // base Location
      d: data.o ? data.o.n : undefined,  // image name on upload
    },
  };

  const fields = castObjectPaths( track );

  return new Promise( resolve => {
    colE.child( uuidE ).update( fields, () => resolve( track ) );
  } );
};
