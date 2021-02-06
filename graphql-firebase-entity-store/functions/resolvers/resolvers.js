const credentials = require( '../credentials/credentials' );
const { sign } = require( 'jsonwebtoken' );

// Connect to firebase database
const namespaceDb = require( '../resources/databases-setup' ).namespaceDb;
const profileDb = require( '../resources/databases-setup' ).profileDb;
const authDb = require( '../resources/databases-setup' ).authDb;

const colE = namespaceDb.database().ref( 'entities' ); // col as in "collection"
const colP = profileDb.database().ref( 'profiles' );
const colA = authDb.database().ref( 'authentication' );

const settings = {
  useClientData: false, // also change in typeDefs.js
  jwtExpiry: 60 * 10, // seconds
};

const resolvers = {
  Query: {
    getEntity: ( parent, args, { context } ) => {
      if ( args.where.m && args.where.n ) {
        return findByFullId( context, args.where.m, args.where.n );
      }
      else if ( args.where.i ) {
        return findByEvmAddress( context, args.where.i );
      }
      else if ( args.where.a ) {
        return findByUuide( context, args.where.a );
      }
      else {
        return getAllEntities( context );
      }
    },
    getProfiles: ( parent, args ) => mapProfiles( args.array ),
    getAuth: ( parent, args ) => findByUphraseOrRefreshToken( args.token ),
    getEntityQuery: ( parent, args, { context } ) => filterEntities( context, args.filter ),
  },
  Mutation: {
    setAuth: ( parent, __, { context, res } ) => setAuth( context, res ),
    setDisconnect: ( parent, __, { context, res } ) => setDisconnect( context, res ),
    setEntity: ( parent, { input }, { context } ) => setFields( context, input, colE ),
    setProfile: ( parent, { input }, { context } ) => setFields( context, input, colP ),
  },
};

async function setAuth( context, res ) {
  // https://hasura.io/blog/best-practices-of-using-jwt-with-graphql

  /**
   * If first visit or user is logged out, no context can be set.
   * Hence return early.
   */

  if ( !context.a ) {
    return {
      success: false,
      message: 'could not find an entity for setting up the context object',
    };
  }

  const VCore = require( './v-core' );
  const newRefreshToken = 'REFR' + VCore.castUuid().base64Url.substr( 1, 16 ); // e.g. REFRr1KM2HCkMKkRlbCt

  await new Promise( resolve => {
    colA.child( context.a ).update( castObjectPaths( { g: newRefreshToken } ), () => resolve( 'set newRefreshToken' ) );
  } );

  const options = {
    httpOnly: true,
    // maxAge: 60 * 60 * 24 * 5 * 1000,
    // secure: true,
  };

  res.cookie( 'refresh_token', newRefreshToken, options );

  return {
    success: true,
    message: 'successfully set refreshToken and sent cookie',
    exp: settings.jwtExpiry,
    uuidE: context.d,
    jwt: sign(
      {
        user: {
          a: context.a,
          d: context.d,
        },
      },
      credentials.jwtSignature,
      {
        expiresIn: settings.jwtExpiry,
      },
    ),
  };
}

async function setDisconnect( context, res ) {

  const disconnect = await new Promise( resolve => {
    colA.child( context.a ).update( { g: null }, () => resolve( { success: true } ) );
  } );

  if ( disconnect.success ) {
    res.clearCookie( 'refresh_token' );
    return disconnect;
  }
  else {
    return {
      success: false,
    };
  }
}

function getAllEntities( context ) {
  return colE.once( 'value' )
    .then( snap => snap.val() )
    .then( val => Object.values( val ).filter( E => E.g == context.host ) );
}

function findByFullId( context, m, n ) {
  const match = function( E ) {
    return E.m == m && E.n == n;
  };
  return getSingleEntity( context, match );
}

function findByEvmAddress( context, i ) {
  const match = function( E ) {
    return E.i == i;
  };
  return getSingleEntity( context, match );
}

function findByUuide( context, a ) {
  const match = function( E ) {
    return E.a == a;
  };
  return getSingleEntity( context, match );
}

async function getSingleEntity( context, match ) {

  /** retrieve the entity */
  const DB = await colE.once( 'value' )
    .then( snap => snap.val() )
    .then( val => val ? Object.values( val ) : null );

  const entity = DB ? DB.find( match ) : null;

  if ( !entity ) {
    return Promise.resolve( [{
      success: false,
    }] );
  }

  /**
   * mixin the fullIds of the current entity holders
   */
  const holdersFullIds = DB.filter( item => entity.x.b.includes( item.a ) ).map( item => item.m + ' ' + item.n );
  Object.assign( entity, { holders: holdersFullIds } );

  /**
   * mixin the fullIds of entities held
   */
  const heldFullIds = DB.filter( item => item.x.b.includes( entity.a ) ).map( item => item.m + ' ' + item.n );
  Object.assign( entity, { holderOf: heldFullIds } );

  /** authorize the mixin of private data for authenticated user */
  if ( context.a && entity.x.b.includes( context.d ) ) {

    /** fetch related auth doc */
    const authDoc = await colA.child( entity.e ).once( 'value' )
      .then( snap => snap.val() );

    /** add auth token to entity object */
    Object.assign( entity, { auth: { f: authDoc.f, j: authDoc.j } } );
  }
  return [entity];
}

function findByUphraseOrRefreshToken( token ) {
  return colA.once( 'value' )
    .then( snap => snap.val() )
    .then( val => [ Object.values( val ).find( auth => [auth.f, auth.g].includes( token ) ) ] );
}

function filterEntities( context, filter ) {
  const q = filter.query.toLowerCase();
  return colE.once( 'value' )
    .then( snap => snap.val() )
    .then( val => Object.values( val ).filter( E => {
      let text;
      if ( E.search && E.search.z && E.search.z.length ) {

        /** uses keyword cache to filter */
        text = E.search.z;
      }
      else {

        /** creates a new keyword cache */
        let strings = [ E.m, E.n ];
        strings = E.o ? strings.concat( [ E.m, E.o ] ) : strings; // title + special tag
        strings = E.search ? strings.concat( [ E.search.a, E.search.b, E.search.c, E.search.d ] ) : strings;
        strings = strings.concat( [ E.i, E.a, E.d ] );
        text = strings.join( ' ' );
        colE.child( E.a ).update( { 'search/z': text } );
      }
      text = text.toLowerCase();
      const role = filter.role != E.c ? filter.role == 'all' ? true : false : true;
      return role && text.includes( q ) && E.g == context.host;
    }
    ) );
}

function mapProfiles( a ) {
  return colP.once( 'value' )
    .then( snap => snap.val() )
    .then( val => a.map( uuidP => val[uuidP] ) );
}

async function setFields( context, input, col ) {

  /** Cast a copy of input */
  const data = JSON.parse( JSON.stringify( input ) );

  /** Get the profile or entity object to be updated */
  const objToUpdate = data.a != '-' ? await col.child( data.a ).once( 'value' )
    .then( snap => snap.val() ) : undefined;

  /** Determine set new or update action */

  /**
   * If no object to update was found, initialize a new set of data.
   * Either use client or server side initialisation.
   */

  if (
    !objToUpdate && !settings.useClientData
  ) {
    return initNamespace( context, data );
  }
  else if (
    !objToUpdate && settings.useClientData
  ) {
    return initNamespaceFromClientData( context, data, col );
  }

  /**
   * If an object to update was found, check authentication and authorization.
   */

  else if (
    context.a && objToUpdate.x.b.includes( context.d )
  ) {
    return updateInNamespace( context, data, objToUpdate, col );
  }
  else if ( !context.a ) {
    return Promise.resolve( { error: '-5001 not authenticated to update', a: data.a } );
  }
  else {
    return Promise.resolve( { error: '-5002 not authorized to update', a: data.a } );
  }
}

async function initNamespace( context, data ) {

  if ( data.c === 'Person' ) {
    // require( './auto-float' ).autoFloat( data.i );  // eslint-disable-line global-require
  }

  const VCore = require( './v-core' );

  /** Check whether the title is valid. */

  const title = VCore.castEntityTitle( data.m, data.c ); // eslint-disable-line global-require
  if ( !title.success ) {
    return { error: '-5003 ' + title.message, a: data.a };
  }

  /** Check whether the target amount is valid. */

  const target = VCore.castTarget( data.profileInputServerSide.target, data.profileInputServerSide.unit, data.c );

  if ( !target.success ) {
    return { error: '-5005 ' + target.message, a: data.a };
  }

  /** Cast tag and check whether the title and tag combi exist. */

  let tag = VCore.castTag(); // eslint-disable-line global-require
  let exists = await findByFullId( context, data.m, tag );
  let counter = 0;

  while ( exists[0].a && counter <= 10 ) {
    counter += 1;
    tag = VCore.castTag(); // eslint-disable-line global-require
    exists = await findByFullId( context, data.m, tag );
  }

  if ( counter == 10 ) {
    return { error: '-5003 combination of title and tag already exists', a: data.a };
  }
  else {
    data.n = tag;
  }

  /** Cast full set of namespace fields and store in DB. */

  const namespace = require( './cast-namespace' ).castNamespace( context, data ); // eslint-disable-line global-require

  const setA = await new Promise( resolve => {
    colA.child( namespace.auth.a ).update( castObjectPaths( namespace.auth ), () => resolve( 'set Auth' ) );
  } );

  const setP = await new Promise( resolve => {
    colP.child( namespace.profile.a ).update( castObjectPaths( namespace.profile ), () => resolve( 'set Profile' ) );
  } );

  const setE = await new Promise( resolve => {
    colE.child( namespace.entity.a ).update( castObjectPaths( namespace.entity ), () => resolve( 'set Entity' ) );
  } );
  // console.log( setA, setP, setE );

  /** Mixin the auth and return entity Doc */
  namespace.entity.auth = namespace.auth;

  /** Track searchable fields in entity db */
  trackSearchableFields( namespace.entity.a, namespace.profile );

  return namespace.entity;

}

function initNamespaceFromClientData( context, data, col ) {
  return new Promise( resolve => {
    if ( data.c === 'Person' ) {
      // require( './auto-float' ).autoFloat( data.i );  // eslint-disable-line global-require
    }

    /** Track searchable fields in entity db */
    data.b.includes( '/p' ) ? trackSearchableFields( data.d, data ) : null;

    /** Write auth data into auth db */
    data.b.includes( '/e' ) ? colA.child( data.auth.a ).update( data.auth ) : null;

    /** Then omit the auth data and write entity data into entity db */
    const omit = JSON.parse( JSON.stringify( data ) );
    delete omit.auth;

    // TODO: post-write data should be resolved, not pre-write data
    col.child( data.a ).update( omit, () => resolve( data ) );
  } );
}

async function updateInNamespace( context, data, objToUpdate, col ) {

  /** Clear keyword cache */
  colE.child( objToUpdate.b.includes( '/e' ) ? objToUpdate.a : objToUpdate.d ).update( { 'search/z': '' } );

  /** Track searchable fields in entity db */
  objToUpdate.b.includes( '/p' ) ? trackSearchableFields( objToUpdate.d, data ) : null;

  /** If title in entity is being updated, run title validation checks */
  if (
    objToUpdate.b.includes( '/e' ) &&
        ( data.m == '' || data.m )
  ) {
    const title = require( './v-core' ).castEntityTitle( data.m, data.c ); // eslint-disable-line global-require

    if ( !title.success ) {
      return Promise.resolve( { error: '-5003 ' + title.message, a: data.a } );
    }
    const exists = await findByFullId( context, data.m, objToUpdate.n );
    if ( exists[0].a ) {
      return Promise.resolve( { error: '-5003 combination of title and tag already exists', a: data.a } );
    }

    data.m = title.data[0]; // overwrite field with formattedTitle
  }

  const fields = castObjectPaths( data );

  /** Never update uuid */
  delete fields.a;

  /** Update single fields */

  return new Promise( resolve => {
    col.child( data.a ).update( fields, () => resolve( data ) );
  } );
}

function castObjectPaths( data ) {

  /**
   * Cast Firebase-compatible object with paths, e.g.
   *      {'m': {'a': 'hello world'}}
   *   => {'m/a': 'hello world'}
   */

  const newObj = {};
  for ( const k in data ) {
    if ( typeof data[k] == 'object' ) {
      for ( const k2 in data[k] ) {
        if ( typeof data[k][k2] == 'object' ) {
          for ( const k3 in data[k][k2] ) {
            data[k][k2][k3] != undefined ? newObj[k + '/' + k2 + '/' + k3] = data[k][k2][k3] : null;
          }
        }
        else {
          data[k][k2] != undefined ? newObj[k + '/' + k2] = data[k][k2] : null;
        }
      }
    }
    else {
      data[k] != undefined ? newObj[k] = data[k] : null;
    }
  }

  return newObj;
}

function trackSearchableFields( uuidE, data ) {
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
}

function setNewExpiryDate( context ) {
  const unix = Math.floor( Date.now() / 1000 );
  const expires = String( unix + 60 * 60 * 24 * 365 * 2 );
  const input = { input: { a: context.m, y: { c: expires } } };
  setFields( colE, input, context );
}

module.exports = resolvers;
