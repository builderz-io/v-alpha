const VMongoDB = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to connect to MongoDB (middleware)
   *
   */

  'use strict';

  /* ================== private methods ================= */

  function castNewEntity( entityData ) {
    return {
      // MongoDB version
      docVersion: V.getSetting( 'entityDocVersion' ),
      fullId: fullId,
      path: path,
      private: {
        uPhrase: uPhrase,
        evmCredentials: {
          address: entityData.evmAddress,
          privateKey: entityData.evmPrivateKey,
          issuer: entityData.evmIssuer,
        }
      },
      profile: {
        fullId: fullId,
        title: title.data[0],
        tag: tag,
        creator: creator,
        creatorTag: creatorTag,
        role: entityData.role,
        joined: {
          date: date,
          unix: unix,
          network: {
            host: host,
            block: block,
            rpc: rpc,
            contract: contract,
          }
        },
        uuidV4: uuid.v4,
      },
      paths: {
        entity: path,
        base64: '/' + uuid.base64Url
      },
      status: {
        active: true,
        verified: V.getSetting( 'defaultVerification' )
      },
      evmCredentials: {
        address: entityData.evmAddress,
        issuer: entityData.evmIssuer,
      },
      receivingAddresses: {
        evm: entityData.evmReceivingAddress
      },
      symbolCredentials: entityData.symbolCredentials || { address: undefined },
      owners: [{
        ownerName: creator,
        ownerTag: creatorTag,
      }],
      admins: [{
        adminName: creator,
        adminTag: creatorTag,
      }],
      adminOf: [ fullId ],
      properties: {
        baseLocation: entityData.location || undefined,
        description: entityData.description || undefined,
        target: target.data[0],
        unit: entityData.unit || undefined,
      },
      tinyImage: tinyImage,
      thumbnail: thumbnail,
      mediumImage: mediumImage,
      geometry: geometry,
      social: {
        email: email,
      }
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
    return emit( data, whichEndpoint, 'get' );
  }

  function setMongoDB( data, whichEndpoint ) {
    if ( whichEndpoint == 'entity' ) {
      data = castNewEntity( data );
    }
    return emit( data, whichEndpoint, 'set' );
  }

  /* ====================== export ====================== */

  V.getMongoDB = getMongoDB;
  V.setMongoDB = setMongoDB;

  return {
    getMongoDB: getMongoDB,
    setMongoDB: setMongoDB,
  };

} )();
