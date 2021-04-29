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
        uPhrase: data.auth,
        evmCredentials: data.evmCredentials
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
          }
        },
        uuidV4: data.uuidE,
      },
      paths: {
        entity: path,
        base64: '/' + data.uuidE
      },
      status: {
        active: true,
        verified: V.getSetting( 'defaultVerification' )
      },
      evmCredentials: {
        address: data.evmCredentials.evmAddress,
        issuer: data.evmCredentials.evmIssuer,
      },
      receivingAddresses: {
        evm: data.receivingAddresses.evm
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
