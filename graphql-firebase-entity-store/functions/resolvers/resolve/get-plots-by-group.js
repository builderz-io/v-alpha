const collP = global.db.collP;
const collE = global.db.collE;

/**
 * Same authorization as set-namespace.js for managing an entity.
 */
function isAuthorizedForGroup( context, groupEntity ) {
  return (
    context.a
    && (
      groupEntity.a == context.d
      || ( groupEntity.x && context.bCU && groupEntity.x.a == context.bCU && !groupEntity.x.m )
      || ( groupEntity.x && groupEntity.x.m == context.d )
    )
  );
}

/**
 * Load full namespace entity document (no getSingleEntity / auth gate).
 */
async function loadPlotEntity( uuidE ) {
  if ( !uuidE ) {
    return null;
  }

  const entity = await collE.child( uuidE ).once( 'value' )
    .then( snap => snap.val() );

  if ( !entity || !entity.a ) {
    return null;
  }

  if ( entity.c !== 'ap' ) {
    return null;
  }

  return entity;
}

module.exports = async ( context, groupUuidE ) => {

  if ( !context.a ) {
    throw new Error( '-2001 not authenticated' );
  }

  if ( !groupUuidE || typeof groupUuidE !== 'string' ) {
    return [];
  }

  const groupEntity = await collE.child( groupUuidE ).once( 'value' )
    .then( snap => snap.val() );

  if ( !groupEntity || !groupEntity.a ) {
    return [];
  }

  if ( groupEntity.c !== 'Group' ) {
    throw new Error( '-2002 not authorized' );
  }

  if ( !isAuthorizedForGroup( context, groupEntity ) ) {
    throw new Error( '-2002 not authorized' );
  }

  const profilesSnap = await collP.orderByChild( 's/s27' ).equalTo( groupUuidE ).once( 'value' );
  const profiles = profilesSnap.val();

  if ( !profiles ) {
    return [];
  }

  const profileEntries = Object.entries( profiles );

  const linked = await Promise.all(
    profileEntries.map( async ( [profileKey, profile] ) => {
      const entity = await loadPlotEntity( profile.d );

      return {
        profileKey,
        profileUuidP: profile.a || profileKey,
        entityUuidE: profile.d,
        entity,
        profile,
      };
    } ),
  );

  const plots = linked
    .filter( item => item.entity && item.profile )
    .map( item => ( {
      entity: item.entity,
      profile: item.profile,
    } ) );

  return plots;

};
