module.exports.checkAuth = ( context, entity ) => {
  if (
    context.a
    && (
      entity.a == context.d // user is entity
      || ( entity.x && context.bCU && entity.x.a == context.bCU && !entity.x.m ) // user is creator of entity
      // TODO: || ( entity.x && entity.x.m == context.d ) // user is holder of entity
    )
  ) {
    return true;
  }
  return false;
};
