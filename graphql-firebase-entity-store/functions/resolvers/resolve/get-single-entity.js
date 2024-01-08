
const collE = global.db.collE;
const collA = global.db.collA;

const { checkAuth } = require( './utils/check-auth' );
const { decrypt } = require( '../../resources/crypt' );

module.exports = async ( context, match ) => {

  let entity;

  if ( match.uuidE ) {
    entity = await collE.child( match.uuidE ).once( 'value' )
      .then( snap => snap.val() );
  }
  else if ( match.title ) {
    entity = await collE.orderByChild( 'm' ).equalTo( match.title ).once( 'value' )
      .then( snap => {
        const data = snap.val();
        return data ? Object.values( data ) : [];
      } )
      .then( entities => entities.find( item => ( item.m + item.n ) == ( match.title + match.tag ) ) );
  }
  else {
    entity = await collE.orderByChild( match.key ).equalTo( match.value ).once( 'value' )
      .then( snap => {
        const data = snap.val();
        return data ? Object.values( data )[0] : null;
      } );
  }

  if ( !entity ) {
    return match.isInArray
      ? { /* success: false */ }
      : [ { /* success: false */ } ];
  }

  /**
   * block the return of the entity for non-owner/non-holder,
   * as per setting in the tracked field f
   */

  if (
    entity.zz && entity.zz.f && entity.zz.f > 0
    && !checkAuth( context, entity )
  ) {
    return match.isInArray
      ? { /* success: false */ }
      : [ { /* success: false */ } ];
  }

  if ( match.noMixins ) {
    return match.isInArray
      ? entity
      : [ entity ];
  }

  /**
   * mixin the fullId of the first "external" entity holder, if available
   * TODO:
   * - needs reworking, due to encryption
   * - check field "n" and "o" also
   * - cache this ?
   */

  // if ( entity.x ) {
  //   const firstHolder = await collE.child( entity.x.m || entity.x.a ).once( 'value' )
  //     .then( snap => snap.val() );
  //   const shownHolder = firstHolder.zz && firstHolder.zz.f && firstHolder.zz.f > 0
  //     ? 'private' // ( entity.m + ' ' + entity.n )
  //     : ( firstHolder.m + ' ' + firstHolder.n );
  //   Object.assign( entity, { holders: [ shownHolder ] } );
  // }
  // else {
  Object.assign( entity, { holders: [ entity.m + ' ' + entity.n ] } );
  // }

  /**
   * mixin the fullIds of entities held for user's own profile
   * TODO:
   * - check field "n" and "o" also
   * - cache this ?
   */

  if ( entity.a == context.d ) {

    const heldFilter = ( snap ) => {
      const data = snap.val();
      if ( data ) {
        let items = Object.values( data );
        if ( !checkAuth( context, entity ) ) {
          items = items.filter( item => item.zz && !item.zz.f );
        }
        return items;
      }
      return [];
    };

    const all = await Promise.all( [
      [], // TODO: collE.orderByChild( 'x/m' ).equalTo( context.bCU ).once( 'value' ).then( heldFilter ),
      collE.orderByChild( 'x/a' ).equalTo( context.bCU ).once( 'value' ).then( heldFilter ),
    ] );

    const points = all[1].concat( all[0] )
      .map( item => ( {
        a: item.a,
        c: item.c,
        d: item.d,
        fullId: item.m + ' ' + item.n,
        geo: item.zz && item.zz.i
          ? item.zz.i
          : ( item.zz.l
            ? JSON.parse( decrypt( JSON.parse( item.zz.l ) ) )
            : null ),
        continent: item.zz && item.zz.m ? item.zz.m : null,
        privacy: item.zz && item.zz.f ? item.zz.f : null,
      } ) );

    Object.assign( entity, { holderOf: points } );

  }
  else {
    Object.assign( entity, { holderOf: [] } );
  }

  /** authorize the mixin of private data for authenticated user */
  if (
    checkAuth( context, entity )
  ) {

    /** fetch related auth doc */
    const authDoc = await collA.child( entity.e ).once( 'value' )
      .then( snap => snap.val() );

    /** add auth token to entity object */
    Object.assign( entity, { auth: { f: authDoc.f, j: authDoc.j } } );
  }

  return match.isInArray
    ? entity
    : [ entity ];
};
