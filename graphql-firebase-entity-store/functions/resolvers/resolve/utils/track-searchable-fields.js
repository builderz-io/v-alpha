// Connect to firebase database
const { namespaceDb } = require( '../../../resources/databases-setup' );
const colE = namespaceDb.database().ref( 'entities' );

const castObjectPaths = require( './cast-object-paths' );

module.exports = ( uuidE, data ) => {
  const track = {
    search: {
      a: data.m ? data.m.r ? data.m.r : data.m.a : null,  // description
      b: data.m ? data.m.b : null,  // email
      c: data.n ? data.n.b : null,  // base Location
      d: data.o ? data.o.n : null,  // image name on upload
    },
  };

  const fields = castObjectPaths( track );

  return new Promise( resolve => {
    colE.child( uuidE ).update( fields, () => resolve( track ) );
  } );
};
