const collE = global.db.collE;

const PERSON_ROLES = ['aa', 'ab'];

module.exports = function touchLastRequested( entity ) {
  if ( !entity || !entity.a || !PERSON_ROLES.includes( entity.c ) ) {
    return;
  }

  const now = String( Math.floor( Date.now() / 1000 ) );

  collE.child( entity.a ).update( { 'y/d': now } );

  if ( !entity.y ) {
    entity.y = {};
  }

  entity.y.d = now;
};
