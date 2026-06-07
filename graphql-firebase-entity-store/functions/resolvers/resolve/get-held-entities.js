const collE = global.db.collE;
const collP = global.db.collP;

const { mixinEntityGeo, decryptProfileGeo } = require( './utils/resolve-held-geo' );

/**
 * Entities created under the authenticated user's creator key (x/a == bCU).
 */
function isCreatedByUser( context, entity ) {
  return (
    context.bCU
    && entity.x
    && entity.x.a == context.bCU
  );
}

module.exports = async ( context ) => {

  if ( !context.a || !context.bCU ) {
    throw new Error( '-2001 not authenticated' );
  }

  const heldSnap = await collE.orderByChild( 'x/a' ).equalTo( context.bCU ).once( 'value' );
  let entities = heldSnap.val() ? Object.values( heldSnap.val() ) : [];

  entities = entities.filter( entity =>
    entity
    && entity.a
    && isCreatedByUser( context, entity ),
  );

  if ( !entities.length ) {
    return [];
  }

  const linked = await Promise.all(
    entities.map( async ( entity ) => {
      mixinEntityGeo( entity );

      let profile = null;

      if ( entity.d ) {
        profile = await collP.child( entity.d ).once( 'value' )
          .then( snap => snap.val() );

        if ( profile ) {
          decryptProfileGeo( profile );
        }
      }

      return {
        entity: entity,
        profile: profile,
      };
    } ),
  );

  return linked.filter( item => item.entity && item.profile );

};
