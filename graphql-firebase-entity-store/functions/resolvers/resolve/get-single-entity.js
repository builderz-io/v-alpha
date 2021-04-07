// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const { authDb } = require( '../../resources/databases-setup' );

const colE = namespaceDb.database().ref( 'entities' );
const colA = authDb.database().ref( 'authentication' );

module.exports = async ( context, match, uuidE ) => {

  const DB = await colE.once( 'value' )
    .then( snap => snap.val() )
    .then( val => val ? Object.values( val ) : null );

  let entity;
  if ( uuidE ) {
    entity = await colE.child( uuidE ).once( 'value' )
      .then( snap => snap.val() );
  }
  else {
    entity = DB ? DB.find( match ) : null;
  }

  if ( !entity ) {
    return [{
      success: false,
    }];
  }

  /**
   * mixin the fullIds of the current entity holders
   */
  if ( entity.x.b.length > 1 ) {
    const holdersFullIds = DB.filter( item => entity.x.b.includes( item.a ) ).map( item => item.m + ' ' + item.n );
    Object.assign( entity, { holders: holdersFullIds } );
  }
  else {
    Object.assign( entity, { holders: [entity.m + ' ' + entity.n] } );
  }

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
};
