
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
const { getSalt, bcrypt } = require( '../../../resources/crypt' );

module.exports = async ( context, data ) => {

  /** Prepare data */

  const uuidE = castUuid().base64Url.substr( 3, entitySetup.uuidStringLength );
  const uuidP = castUuid().base64Url.substr( 3, entitySetup.uuidStringLength );
  const uuidA = castUuid().base64Url.substr( 3, entitySetup.uuidStringLength );
  const unix = Math.floor( Date.now() / 1000 );
  const uPhrase = 'vx' + castUuid().base64Url.slice( 0, 15 ) + 'X';
  const creatorUPhrase = 'vx' + castUuid().base64Url.slice( 0, 15 ) + 'X';
  const bcyptedUPhrase = await bcrypt( uPhrase, getSalt() );

  let bcryptedCreatorUPhrase, heldBy, geoHash;

  if ( context.a ) {
    bcryptedCreatorUPhrase = await bcrypt( context.cU, getSalt() );
  }

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
        a: bcryptedCreatorUPhrase,
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

      f: data.profileInputServerSide.privacy,

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
        z: data.profileInputServerSide.continent,
      },
      o: {
        a: data.profileInputServerSide.tinyImg,
        b: data.profileInputServerSide.thumb,
        // c: data.profileInputServerSide.medImg,
        // n: data.profileInputServerSide.imgName,
        z: data.profileInputServerSide.avatar,
      },

      x: {
        a: bcryptedCreatorUPhrase,
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

      f: data.profileInputServerSide.privacy,

      o: {
        c: data.profileInputServerSide.medImg,
        n: data.profileInputServerSide.imgName,
      },

      x: {
        a: bcryptedCreatorUPhrase,
        m: heldBy,
      },
    },
    auth: {
      a: uuidA,
      b: entitySetup.authDocVersion,
      d: uuidE,
      e: uuidP,
      f: data.authInputServerSide.fImporter || bcyptedUPhrase,
      i: data.authInputServerSide.i,
      j: data.authInputServerSide.j,
    },
    toKeyFile: {
      uPhrase: uPhrase, // mixin of uPhrase to send back to user
      creatorUPhrase: creatorUPhrase, // mixin of creatorUPhrase to send back to user
    },
  };
};
