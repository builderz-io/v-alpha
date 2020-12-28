// Connect to firebase database
const namespaceDb = require( '../resources/databases-setup' ).namespaceDb;
const profileDb = require( '../resources/databases-setup' ).profileDb;

// Here Firebase returns an object and GraphQL is expecting an array, so we need to extract the values.

const colE = namespaceDb.database().ref( 'entities' ); // col as in "collection"
const colP = profileDb.database().ref( 'profiles' );

const resolvers = {
  Query: {
    getEntity: ( parent, args ) => {
      if ( args.m && args.n ) {
        return findByFullId( colE, args.m, args.n );
      }
      else if ( args.i ) {
        return findByEvmAddress( colE, args.i );
      }
      else {
        return mapSnap( colE );
      }
    },
    getProfile: ( parent, args ) => {
      return findProfiles( colP, args.a );
    }
  },
  Mutation: {
    setEntity: ( x, input ) => {return setItem( colE, input )},
    setProfile: ( x, input ) => {return setItem( colP, input )}
  }
};

function mapSnap( col ) {
  return col
    .once( 'value' )
    .then( snap => {return snap.val()} )
    .then( val => {return Object.keys( val ).map( key => {return val[key]} )} );
}

function findByFullId( col, m, n ) {
  return col
    .once( 'value' )
    .then( snap => {return snap.val()} )
    .then( val => { return [ Object.values( val ).find( entity => { return entity.m == m && entity.n == n } ) ] } );
}

function findByEvmAddress( col, i ) {
  return col
    .once( 'value' )
    .then( snap => {return snap.val()} )
    .then( val => { return [ Object.values( val ).find( entity => { return entity.i == i } ) ] } );
}

function findProfiles( col, a ) {
  return col
    .once( 'value' )
    .then( snap => {return snap.val()} )
    .then( val => {
      return a.map( uuidP => {
        return val[uuidP];
      } );
    } );
}

function setItem( col, { input } ) {
  return new Promise( resolve => {
    const data = JSON.parse( JSON.stringify( input ) );
    col.child( data.a ).update( data, () => {return resolve( data )} );
  } );
}

module.exports = resolvers;
