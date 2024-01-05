/* eslint global-require: "off" */

const settings = {
  useClientData: false, // also change in typeDefs.js + in frontend
};

module.exports = async ( context, input, whichCol ) => {

  let coll;

  'entity' == whichCol && ( coll = global.db.collE )
  || 'profile' == whichCol && ( coll = global.db.collP )
  || 'image' == whichCol && ( coll = global.db.collI );

  /** Cast a copy of input */
  const data = JSON.parse( JSON.stringify( input ) );

  /** Get the profile or entity object to be updated */
  const objToUpdate = data.a != '-' ? await coll.child( data.a ).once( 'value' )
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
    return require( './namespace-init-cd' )( context, data, coll );
  }

  /**
   * If an object to update was found, check authentication and authorization.
   */

  else if (
    context.a
    && (
      [ /* entity */ objToUpdate.a, /* profile */ objToUpdate.d ].includes( context.d ) // user updating self
      || ( objToUpdate.x && context.bCU && objToUpdate.x.a == context.bCU && !objToUpdate.x.m ) // user updating created entity
      || ( objToUpdate.x && objToUpdate.x.m == context.d ) // user updating held entity
    )
  ) {
    return require( './namespace-update' )( context, data, objToUpdate, coll );
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
