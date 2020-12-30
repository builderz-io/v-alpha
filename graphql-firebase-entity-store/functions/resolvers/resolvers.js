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
    setEntity: ( parent, input, context ) => {
      return setItem( colE, input, context );
    },
    setProfile: ( parent, input, context ) => {
      return setItem( colP, input, context );
    }
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

async function setItem( col, { input }, context ) {
  const data = JSON.parse( JSON.stringify( input ) );
  const obj = await col
    .once( 'value' )
    .then( snap => {return snap.val()} )
    .then( val => { return Object.values( val ).find( entity => { return entity.a == data.a } ) } );

  // console.log( 555, obj, data, context );

  if (
    !obj
  ) {
    return new Promise( resolve => {
      col.child( data.a ).update( data, () => { return resolve( data ) } );
    } );
  }
  else if (
    obj.a == context.d || // authorizes a profile update
     obj.a == context.a // authorizes an entity update
  ) {

    /**
     * Cast Firebase-compatible object with paths, e.g.
     *      {'m': {'a': 'hello world'}}
     *   => {'m/a': 'hello world'}
     */

    const fields = castObjectPaths( data );

    /** Do not update uuid */
    delete fields.a;

    /** Update single fields */

    return new Promise( resolve => {
      col.child( data.a ).update( fields, () => { return resolve( data ) } );
    } );
  }
  else {
    return Promise.resolve( { a: 'not authorized' } );
  }
}

function castObjectPaths( data ) {
  const newObj = {};
  for ( const k in data ) {
    if ( typeof data[k] == 'object' ) {
      for ( const k2 in data[k] ) {
        if ( typeof data[k][k2] == 'object' ) {
          for ( const k3 in data[k][k2] ) {
            newObj[k + '/' + k2 + '/' + k3] = data[k][k2][k3];
          }
        }
        else {
          newObj[k + '/' + k2] = data[k][k2];
        }
      }
    }
    else {
      newObj[k] = data[k];
    }
  }

  return newObj;
}

module.exports = resolvers;
