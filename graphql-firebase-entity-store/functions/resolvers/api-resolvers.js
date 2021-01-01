// Connect to firebase database
const namespaceDb = require( '../resources/databases-setup' ).namespaceDb;
const profileDb = require( '../resources/databases-setup' ).profileDb;

// Here Firebase returns an object and GraphQL is expecting an array, so we need to extract the values.

const colE = namespaceDb.database().ref( 'entities' ); // col as in "collection"
const colP = profileDb.database().ref( 'profiles' );

const resolvers = {
  Query: {
    getEntity: ( parent, args, context ) => {
      if ( args.m && args.n ) {
        return findByFullId( colE, args.m, args.n );
      }
      else if ( args.i ) {
        if ( context ) {
          setNewExpiryDate( context );
        }
        return findByEvmAddress( colE, args.i );
      }
      else if ( args.f ) {
        if ( context ) {
          setNewExpiryDate( context );
        }
        return findByUphrase( colE, args.f );
      }
      else {
        return mapSnap( colE );
      }
    },
    getProfile: ( parent, args ) => findProfiles( colP, args.a )
  },
  Mutation: {
    setEntity: ( parent, input, context ) => setFields( colE, input, context ),
    setProfile: ( parent, input, context ) => setFields( colP, input, context )
  }
};

function mapSnap( col ) {
  return col.once( 'value' )
    .then( snap => snap.val() )
    .then( val => Object.keys( val ).map( key => val[key] ) );
}

function findByFullId( col, m, n ) {
  return col.once( 'value' )
    .then( snap => snap.val() )
    .then( val => [ Object.values( val ).find( entity => entity.m == m && entity.n == n ) ] );
}

function findByEvmAddress( col, i ) {
  return col.once( 'value' )
    .then( snap => snap.val() )
    .then( val => [ Object.values( val ).find( entity => entity.i == i ) ] );
}

function findByUphrase( col, f ) {
  return col.once( 'value' )
    .then( snap => snap.val() )
    .then( val => [ Object.values( val ).find( entity => entity.f == f ) ] );
}

function findProfiles( col, a ) {
  return col.once( 'value' )
    .then( snap => snap.val() )
    .then( val => a.map( uuidP => val[uuidP] ) );
}

async function setFields( col, { input }, context ) {
  const data = JSON.parse( JSON.stringify( input ) );
  const obj = await col.child( data.a ).once( 'value' )
    .then( snap => snap.val() );

  if (
    !obj
  ) {
    return new Promise( resolve => {
      col.child( data.a ).update( data, () => resolve( data ) );
    } );
  }
  else if (
    context.a &&
    (
      context.a == obj.a ||   // authorizes main entity update
      context.d == obj.a ||   // authorizes profile update of main entity
      context.a == ( obj.x ? obj.x.a : '' )   // authorizes updates of created entity or profile
      // IDEA: check owners first: ( obj.x ? obj.x.b ? obj.x.b : [ obj.x.a ] : [] ).includes( context.a )
    )
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
      col.child( data.a ).update( fields, () => resolve( data ) );
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

function setNewExpiryDate( context ) {
  const unix = Math.floor( Date.now() / 1000 );
  const expires = String( unix + 60 * 60 * 24 * 180 );
  const input = { input: { a: context.a, y: { c: expires } } };
  setFields( colE, input, context );
}

module.exports = resolvers;
