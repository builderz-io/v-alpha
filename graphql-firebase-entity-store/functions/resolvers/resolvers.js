// Connect to firebase database
const namespaceDb = require( '../resources/databases-setup' ).namespaceDb;
const profileDb = require( '../resources/databases-setup' ).profileDb;
const authDb = require( '../resources/databases-setup' ).authDb;

const colE = namespaceDb.database().ref( 'entities' ); // col as in "collection"
const colP = profileDb.database().ref( 'profiles' );
const colA = authDb.database().ref( 'authentication' );

const settings = {
  useClientData: true,
};

const resolvers = {
  Query: {
    getEntity: ( parent, args, context ) => {
      if ( context && context.a ) {
        // do stuff like setNewExpiryDate on all owned entities
      }
      if ( args.m && args.n ) {
        return findByFullId( context, args.m, args.n );
      }
      else if ( args.i ) {
        return findByEvmAddress( context, args.i );
      }
      else {
        return mapSnap( colE );
      }
    },
    getProfile: ( parent, args ) => findProfiles( colP, args.a ),
    getAuth: ( parent, args ) => findByToken( colA, args.f )
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

function findByFullId( context, m, n ) {
  const match = function( entity ) {
    return entity.m == m && entity.n == n;
  };
  return getSingleEntity( context, match );
}

function findByEvmAddress( context, i ) {
  const match = function( entity ) {
    return entity.i == i;
  };
  return getSingleEntity( context, match );
}

async function getSingleEntity( context, match ) {
  const entity = await colE.once( 'value' )
    .then( snap => snap.val() )
    .then( val => Object.values( val ).find( match ) );

  /** authorize the mixin of private data for authenticated user */
  if ( context.a && ( context.m.includes( entity.a ) ) ) {

    /** fetch related auth doc */
    const obj = await colA.child( entity.e ).once( 'value' )
      .then( snap => snap.val() );

    /** add auth token to entity object */
    Object.assign( entity, { auth: { a: obj.f } } );
  }
  return [entity];
}

function findByToken( col, f ) {
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
    !obj && settings.useClientData
  ) {
    return new Promise( resolve => {
      data.b == '/e1/v0' ? colA.child( data.auth.a ).update( data.auth ) : null;
      const omitAuth = JSON.parse( JSON.stringify( data ) );
      delete omitAuth.auth;
      // TODO: post-write data should be resolved, not pre-write data
      col.child( data.a ).update( omitAuth, () => resolve( data ) );
    } );
  }
  else if (
    !obj && !settings.useClientData
  ) {
    return new Promise( resolve => {
      // initializeEntity( data )
    } );
  }
  else if ( !context.a ) {
    return Promise.resolve( { error: 'not authenticated' } );
  }
  else if (
    context.a &&                            // check authentication
    (
      // context.m.includes( obj.a ) ||     // authorizes main entity update
      context.m.includes( obj.x.a )         // authorizes updates as owner
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
    return Promise.resolve( { error: 'not authorized' } );
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
  const input = { input: { a: context.m, y: { c: expires } } };
  setFields( colE, input, context );
}

module.exports = resolvers;
