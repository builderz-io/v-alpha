const VMongoDB = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to connect to MongoDB (middleware)
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function castNewEntity( data ) {
    const fullId = data.title + ' ' + data.tag;
    const path = '/profile/' + V.castSlugOrId( fullId );
    const date = new Date();
    return {
      docVersion: data.contextP,
      fullId: fullId,
      path: path,
      private: {
        uPhrase: data.auth || data.uPhrase,
        evmCredentials: data.evmCredentials,
      },
      profile: {
        fullId: fullId,
        title: data.title,
        tag: data.tag,
        creator: data.creator,
        creatorTag: data.creatorTag,
        role: data.typeE,
        joined: {
          date: date.toString(),
          unix: data.unix,
          network: {
            host: data.issuer,
            block: data.block,
            rpc: data.rpc,
            contract: data.contract,
          },
        },
        uuidV4: data.uuidE,
      },
      paths: {
        entity: path,
        base64: '/' + data.uuidE,
      },
      status: {
        active: true,
        verified: V.getSetting( 'defaultVerification' ),
      },
      evmCredentials: {
        address: data.evmCredentials.evmAddress,
        issuer: data.evmCredentials.evmIssuer,
      },
      receivingAddresses: {
        evm: data.receivingAddresses.evm,
      },
      symbolCredentials: data.symbolCredentials,
      owners: [{
        ownerName: data.creator,
        ownerTag: data.creatorTag,
      }],
      admins: [{
        adminName: data.creator,
        adminTag: data.creatorTag,
      }],
      adminOf: [ fullId ],
      properties: data.props,
      tinyImage: data.tinyImage,
      thumbnail: data.thumbnail,
      mediumImage: data.mediumImage,
      geometry: data.geometry,
      social: {
        email: data.props.email,
      },
    };
  }

  function castMongoEntity( doc ) {
    if ( !doc ) { return doc }
    if ( doc.uuidE ) { return doc }
    if ( !doc.profile ) { return doc }

    const role = typeof doc.profile.role === 'string'
      ? ( doc.profile.role.length === 2 ? V.castRole( doc.profile.role ) : doc.profile.role )
      : 'Plot';
    const roleCode = role.length === 2 ? role : V.castRole( role );

    return {
      uuidE: doc.profile.uuidV4,
      uuidP: doc.profile.uuidV4,
      role: role,
      roleCode: typeof doc.profile.role === 'string' && doc.profile.role.length === 2
        ? doc.profile.role
        : V.castRole( role ),
      privacy: 1,
      title: doc.profile.title,
      tag: doc.profile.tag,
      profile: {
        title: doc.profile.title,
        tag: doc.profile.tag,
      },
      fullId: doc.fullId,
      path: doc.path || V.castPathOrId( doc.fullId ),
      properties: {
        description: doc.properties && doc.properties.description,
        target: doc.properties && doc.properties.target,
        unit: doc.properties && doc.properties.unit,
        baseLocation: doc.properties && doc.properties.baseLocation,
        email: doc.social && doc.social.email,
      },
      images: {},
      geometry: {
        coordinates: doc.geometry && doc.geometry.coordinates
          ? doc.geometry.coordinates
          : [13.405, 52.52],
        baseLocation: doc.properties && doc.properties.baseLocation,
        type: 'Point',
      },
      type: 'Feature',
      status: doc.status || { active: true },
      holders: doc.holders && doc.holders.length
        ? doc.holders
        : [doc.fullId],
      holderOf: doc.holderOf || [],
      questionnaire: doc.questionnaire || {},
      auth: {
        uPhrase: doc.private && doc.private.uPhrase,
        creatorUPhrase: doc.private && doc.private.uPhrase,
        evmCredentials: doc.private && doc.private.evmCredentials,
      },
      evmCredentials: doc.evmCredentials || {},
      receivingAddresses: doc.receivingAddresses || {},
      servicefields: doc.servicefields || {},
      onChain: doc.onChain || {
        balance: 0,
        lastMove: 0,
        timeToZero: 0,
      },
    };
  }

  function emit( data, whichEndpoint, xet ) {
    return new Promise( resolve => {
      socket.emit( xet + ' ' + whichEndpoint, data, function( res ) {
        resolve( res );
      } );
    } );
  }

  /* ================== public methods ================== */

  function getMongoDB( data, whichEndpoint ) {
    return emit( data, whichEndpoint, 'get' ).then( res => {
      if ( res && res.success && Array.isArray( res.data ) ) {
        res.data = res.data.map( castMongoEntity );
      }
      return res;
    } );
  }

  function setMongoDB( data, whichEndpoint ) {
    if ( whichEndpoint == 'entity' ) {
      data = castNewEntity( data );
    }
    return emit( data, whichEndpoint, 'set' ).then( res => {
      if ( res && res.success && Array.isArray( res.data ) && whichEndpoint === 'entity' ) {
        res.data = res.data.map( castMongoEntity );
      }
      return res;
    } );
  }

  /* ====================== export ====================== */

  V.getMongoDB = getMongoDB;
  V.setMongoDB = setMongoDB;
  V.castMongoEntity = castMongoEntity;

  return {
    getMongoDB: getMongoDB,
    setMongoDB: setMongoDB,
    castMongoEntity: castMongoEntity,
  };

} )();
