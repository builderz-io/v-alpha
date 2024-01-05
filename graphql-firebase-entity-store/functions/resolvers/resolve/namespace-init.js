/* eslint global-require: "off" */

const settings = {
  floatEth: false,
};

const collE = global.db.collE;
const collP = global.db.collP;
const collA = global.db.collA;
const collI = global.db.collI;

const castObjectPaths = require( './utils/cast-object-paths' );
const trackProfileFields = require( './utils/track-profile-fields' );
const setNetwork = require( './utils/set-network' );

module.exports = async ( context, data ) => {

  /** Validate, cast and set inputs */
  if ( !context.doNotValidate ) { // option when running importer
    await require( '../validate/validate' )( context, data );
  }

  /** Cast full set of namespace fields and store in DB. */
  const namespace = await require( './utils/cast-namespace' )( context, data );

  const setA = new Promise( resolve => {
    collA.child( namespace.auth.a ).update( castObjectPaths( namespace.auth ), () => resolve( 'set Auth' ) );
  } );

  const setE = new Promise( resolve => {
    collE.child( namespace.entity.a ).update( castObjectPaths( namespace.entity ), () => resolve( 'set Entity' ) );
  } );

  const setP = new Promise( resolve => {
    collP.child( namespace.profile.a ).update( castObjectPaths( namespace.profile ), () => resolve( 'set Profile' ) );
  } );

  const setI = new Promise( resolve => {
    collI.child( namespace.profile.a ).update( castObjectPaths( namespace.image ), () => resolve( 'set Image' ) );
  } );

  const all = await Promise.all( [setA, setE, setP, setI] );

  if ( JSON.stringify( all ) != '["set Auth","set Entity","set Profile","set Image"]' ) {
    throw new Error( 'could not set up entity' );
  }

  /** Float some ETH and optionally auto-verify */
  // "awaiting" this would make the joining slow for the user
  if ( settings.floatEth && 'aa' == namespace.entity.c ) {
    require( './set-transaction' )( context, {
      recipientAddress: namespace.entity.i,
    }, 'float' );
  }

  /** Track profile fields in entity db */
  trackProfileFields( namespace.entity.a, namespace.profile );

  /** Update the network cluster and point-cache */
  setNetwork( context );

  /** Mixin the auth and return entity Doc */
  namespace.entity.auth = namespace.auth;
  Object.assign( namespace.entity.auth, namespace.toKeyFile );

  return namespace.entity;

};
