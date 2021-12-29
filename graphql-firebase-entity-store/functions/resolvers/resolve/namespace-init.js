/* eslint global-require: "off" */

const settings = {
  floatEth: false,
};

// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const { profileDb } = require( '../../resources/databases-setup' );
const { authDb } = require( '../../resources/databases-setup' );
const { imageDb } = require( '../../resources/databases-setup' );

const colE = namespaceDb.database().ref( 'entities' );
const colP = profileDb.database().ref( 'profiles' );
const colA = authDb.database().ref( 'authentication' );
const colI = imageDb.database().ref( 'images' );

const castObjectPaths = require( './utils/cast-object-paths' );
const trackProfileFields = require( './utils/track-profile-fields' );
const setNetwork = require( './utils/set-network' );

module.exports = async ( context, data ) => {

  /** Validate, cast and set inputs */
  if ( !context.doNotValidate ) { // option when running importer
    await require( '../validate/validate' )( context, data );
  }

  /** Cast full set of namespace fields and store in DB. */
  const namespace = require( './utils/cast-namespace' )( context, data );

  const setA = new Promise( resolve => {
    colA.child( namespace.auth.a ).update( castObjectPaths( namespace.auth ), () => resolve( 'set Auth' ) );
  } );

  const setE = new Promise( resolve => {
    colE.child( namespace.entity.a ).update( castObjectPaths( namespace.entity ), () => resolve( 'set Entity' ) );
  } );

  const setP = new Promise( resolve => {
    colP.child( namespace.profile.a ).update( castObjectPaths( namespace.profile ), () => resolve( 'set Profile' ) );
  } );

  const setI = new Promise( resolve => {
    colI.child( namespace.profile.a ).update( castObjectPaths( namespace.image ), () => resolve( 'set Image' ) );
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

  return namespace.entity;

};
