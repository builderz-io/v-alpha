
// const credentials = require( '../credentials/credentials' );
// const rpc = credentials.float.rpc;
// const contractAddress = credentials.float.contractAddress;
//
// const Web3 = require( 'web3' );
// const web3 = new Web3( rpc );
//
// const abi = require( '../resources/viabi.json' ); // using require here
// const contract = new web3.eth.Contract( abi, contractAddress ); // using abi without JSON.parse here

const entitySetup = {
  entityDocVersion: '/e1/v0',
  profileDocVersion: '/p1/v0',
  authDocVersion: '/a1/v0',
  imageDocVersion: '/i1/v0',
  daysToExpiry: 365 * 2,
  uuidStringLength: 10,
};

const { castUuid } = require( '../../../resources/v-core' );

module.exports = ( context, data ) => {

  /** Prepare data */

  const uuidE = castUuid().base64Url.substr( 3, entitySetup.uuidStringLength );
  const uuidP = castUuid().base64Url.substr( 3, entitySetup.uuidStringLength );
  const uuidA = castUuid().base64Url.substr( 3, entitySetup.uuidStringLength );
  const unix = Math.floor( Date.now() / 1000 );
  const uPhrase = 'vx' + castUuid().base64Url.slice( 0, 15 ) + 'X';

  let creatorUuid, heldBy, geoHash;

  if ( context.a ) {
    // heldBy = context.d;
    creatorUuid = context.d;
  }
  // else {
  //   heldBy = [uuidE];
  //   creatorUuid = uuidE;
  // }

  if ( data.profileInputServerSide.lngLat ) {
    geoHash = require( 'geofire-common' ).geohashForLocation( [
      data.profileInputServerSide.lngLat[1],
      data.profileInputServerSide.lngLat[0],
    ] );
  }

  // let block, rpc, contract;

  // await getContractState().then( res => {
  //
  //   if ( res.success ) {
  //     block = res.data[0].currentBlock;
  //     rpc = res.data[0].network.rpc;
  //     contract = res.data[0].contract;
  //   }
  //   else {
  //     block = -1;
  //     rpc = 'error';
  //     contract = 'error';
  //   }
  // } );

  return {
    entity: {
      a: uuidE,
      b: entitySetup.entityDocVersion,
      c: data.c,
      d: uuidP,
      e: uuidA,
      g: data.gImporter || context.host,

      i: data.i,
      j: data.j,

      m: data.m,
      n: data.n,

      x: {
        a: creatorUuid,
        m: heldBy,
      },

      y: {
        a: String( unix ),
        c: String( unix + 60 * 60 * 24 * entitySetup.daysToExpiry ),
        m: true,
        z: 100,
      },

      zz: {
        i: data.profileInputServerSide.lngLat,
        j: geoHash,
        k: data.profileInputServerSide.loc,
      },
    },
    profile: {
      a: uuidP,
      b: entitySetup.profileDocVersion,
      d: uuidE,

      m: {
        a: data.profileInputServerSide.descr,
        b: data.profileInputServerSide.email,
        c: data.prefLangImporter,
        m: data.profileInputServerSide.target,
        n: data.profileInputServerSide.unit,
        r: data.profileInputServerSide.filteredDescr,
        s: data.profileInputServerSide.emailPrivate,
      },
      n: {
        a: data.profileInputServerSide.lngLat,
        b: geoHash,
        c: data.profileInputServerSide.loc,
      },
      o: {
        a: data.profileInputServerSide.tinyImg,
        b: data.profileInputServerSide.thumb,
        // c: data.profileInputServerSide.medImg,
        // n: data.profileInputServerSide.imgName,
      },

      x: {
        a: creatorUuid,
        m: heldBy,
      },

      y: {
        a: String( unix ),
      },
    },
    image: {
      a: uuidP,
      b: entitySetup.imageDocVersion,
      d: uuidE,

      o: {
        c: data.profileInputServerSide.medImg,
        n: data.profileInputServerSide.imgName,
      },

      x: {
        a: creatorUuid,
        m: heldBy,
      },
    },
    auth: {
      a: uuidA,
      b: entitySetup.authDocVersion,
      d: uuidE,
      e: uuidP,
      f: data.authInputServerSide.fImporter || uPhrase,
      i: data.authInputServerSide.i,
      j: data.authInputServerSide.j,
    },
  };
};
