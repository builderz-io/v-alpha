// Connect to firebase database
const { namespaceDb } = require( '../../resources/databases-setup' );
const { authDb } = require( '../../resources/databases-setup' );

const colE = namespaceDb.database().ref( 'entities' );
const colA = authDb.database().ref( 'authentication' );

module.exports = async ( context, match ) => {

  let entity;

  if ( match.uuidE ) {
    entity = await colE.child( match.uuidE ).once( 'value' )
      .then( snap => snap.val() );
    if ( match.isInArray ) {
      if ( !entity ) {
        return { success: false };
      }
      else {
        return entity;
      }
    }
  }
  else if ( match.title ) {
    entity = await colE.orderByChild( 'm' ).equalTo( match.title ).once( 'value' )
      .then( snap => {
        const data = snap.val();
        return data ? Object.values( data ) : [];
      } )
      .then( entities => entities.find( item => ( item.m + item.n ) == ( match.title + match.tag ) ) );
  }
  else {
    entity = await colE.orderByChild( match.key ).equalTo( match.value ).once( 'value' )
      .then( snap => {
        const data = snap.val();
        return data ? Object.values( data )[0] : null;
      } );
  }

  if ( !entity ) {
    return [{
      success: false,
    }];
  }

  if ( match.noMixins ) {
    return [entity];
  }

  /**
   * mixin the fullId of the first "external" entity holder, if available
   * TODO:
   * - check field "n" and "o" also
   * - cache this ?
   */

  if ( entity.x ) {
    const firstHolder = await colE.child( entity.x.m || entity.x.a ).once( 'value' )
      .then( snap => snap.val() )
      .then( entity => entity.m + ' ' + entity.n );
    Object.assign( entity, { holders: [ firstHolder ] } );
  }
  else {
    Object.assign( entity, { holders: [ entity.m + ' ' + entity.n ] } );
  }

  /**
   * mixin the fullIds of entities held
   * TODO:
   * - check field "n" and "o" also
   * - cache this ?
   */

  const heldXM = await colE.orderByChild( 'x/m' ).equalTo( entity.a ).once( 'value' )
    .then( snap => {
      const data = snap.val();
      return data ? Object.values( data ) : [];
    } );

  const heldXA = await colE.orderByChild( 'x/a' ).equalTo( entity.a ).once( 'value' )
    .then( snap => {
      const data = snap.val();
      return data ? Object.values( data ) : [];
    } );
    // .then( entities => entities.map( item => item.m + ' ' + item.n ) );

  const points = heldXA.concat( heldXM )
    .map( item => ( {
      a: item.a,
      c: item.c,
      d: item.d,
      fullId: item.m + ' ' + item.n,
      geo: item.zz && item.zz.i ? item.zz.i : null,
    } ) );

  Object.assign( entity, { holderOf: points } );

  /** authorize the mixin of private data for authenticated user */
  if (
    context.a &&
    (
      entity.a == context.d || // user is entity
      ( entity.x && entity.x.a == context.d && !entity.x.m ) || // user is creator of entity
      ( entity.x && entity.x.m == context.d ) // user is holder of entity
    )
  ) {

    /** fetch related auth doc */
    const authDoc = await colA.child( entity.e ).once( 'value' )
      .then( snap => snap.val() );

    /** add auth token to entity object */
    Object.assign( entity, { auth: { f: authDoc.f, j: authDoc.j } } );
  }
  return [entity];
};
