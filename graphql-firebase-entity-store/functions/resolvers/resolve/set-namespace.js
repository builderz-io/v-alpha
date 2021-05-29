/* eslint global-require: "off" */

const settings = {
  useClientData: false, // also change in typeDefs.js + in frontend
};

module.exports = async ( context, input, whichCol ) => {

  let col;

  if ( whichCol == 'entity' ) {
    const { namespaceDb } = require( '../../resources/databases-setup' );
    col = namespaceDb.database().ref( 'entities' );
  }
  else if ( whichCol == 'profile' ) {
    const { profileDb } = require( '../../resources/databases-setup' );
    col = profileDb.database().ref( 'profiles' );
  }

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
    return require( './namespace-init' )( context, data );
  }
  else if (
    !objToUpdate && settings.useClientData
  ) {
    return require( './namespace-init-cd' )( context, data, col );
  }

  /**
   * If an object to update was found, check authentication and authorization.
   */

  else if (
    context.a &&
    ( objToUpdate.a == context.d || // user updating self
      ( objToUpdate.x && objToUpdate.x.m == context.d ) // user updating held entity
    )
  ) {
    return require( './namespace-update' )( context, data, objToUpdate, col );
  }
  else if ( !context.a ) {
    throw new Error( '-2001 not authenticated to update' );
    // return Promise.resolve( { error: '-5001 not authenticated to update', a: data.a } );
  }
  else {
    throw new Error( '-2002 not authorized to update' );
    // return Promise.resolve( { error: '-5002 not authorized to update', a: data.a } );
  }
};
