module.exports.checkAuth = ( context, entity ) => {
  if (
    context.a
    && (
      entity.a == context.d // user is entity
      || ( entity.x && entity.x.a == context.d && !entity.x.m ) // user is creator of entity
      || ( entity.x && entity.x.m == context.d ) // user is holder of entity
    )
  ) {
    return true;
  }
  return false;
};
