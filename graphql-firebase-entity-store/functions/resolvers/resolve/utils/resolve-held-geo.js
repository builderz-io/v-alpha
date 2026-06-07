const { decrypt } = require( '../../../resources/crypt' );

function resolveEntityGeo( entity ) {
  if ( !entity || !entity.zz ) {
    return null;
  }

  if ( entity.zz.i ) {
    return entity.zz.i;
  }

  if ( entity.zz.l ) {
    try {
      return JSON.parse( decrypt( JSON.parse( entity.zz.l ) ) );
    }
    catch ( err ) {
      return null;
    }
  }

  return null;
}

function mixinEntityGeo( entity ) {
  if ( !entity || !entity.zz || entity.zz.i ) {
    return entity;
  }

  const geo = resolveEntityGeo( entity );

  if ( geo ) {
    entity.zz.i = geo;
  }

  return entity;
}

function decryptProfileGeo( profile ) {
  if (
    !profile
    || !profile.n
    || !profile.n.d
    || profile.n.a
  ) {
    return profile;
  }

  try {
    profile.n.a = JSON.parse( decrypt( JSON.parse( profile.n.d ) ) );
  }
  catch ( err ) {
    console.log( 'profile geo decrypt failed:', err );
  }

  return profile;
}

module.exports = {
  resolveEntityGeo: resolveEntityGeo,
  mixinEntityGeo: mixinEntityGeo,
  decryptProfileGeo: decryptProfileGeo,
};
