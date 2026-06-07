const collE = global.db.collE;

/**
 * Public lookup: resolve a group invite code (uuidE) to its display name and full id.
 * No authentication required.
 */
module.exports = async ( groupUuidE ) => {

  if ( !groupUuidE || typeof groupUuidE !== 'string' ) {
    return null;
  }

  const entity = await collE.child( groupUuidE ).once( 'value' )
    .then( snap => snap.val() );

  if ( !entity || !entity.a || entity.c !== 'Group' ) {
    return null;
  }

  return {
    name: entity.m,
    tag: entity.m + ' ' + entity.n,
  };

};
