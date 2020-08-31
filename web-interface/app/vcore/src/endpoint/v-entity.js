const VEntity = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage entities
   *
   */

  'use strict';

  const entitySetup = {
    useWhitelist: true, // allow only chars in whitelist
    // capWordLength: 7,  // a cap on the number of words in an entity name that the system can handle
    maxEntityWords: 7,  // max allowed words in entity names (not humans) // MUST be less or equal to capWordLength
    maxHumanWords: 3,  // max allowed words in human entity names // MUST be less or equal to capWordLength
    maxWordLength: 12,  // max allowed length of each word in name
  };

  const charBlacklist = /[;/!?:@=&"<>#%(){}[\]|\\^~`]/g;
  const charWhitelist = /[^0-9^a-z^A-Z^\s]/g;

  /* ============== user interface strings ============== */

  const ui = {
    invalidTitle: 'invalid title',
    invalidChar: 'invalid character',
    maxLength: 'max 12 characters in a word',
    min2Adjecent: 'min 2 adjecent letters',
    maxHuman: 'max 3 words',
    maxEntity: 'max 7 words',
    tooLong: 'max 200 characters',
    tooShort: 'min 2 characters',
    free: 'free',
    targetRange: 'target must be within 0 - 9999',
    isNaN: 'target must be a number',
    noUnit: 'please add a unit, such as "hour"',
    noTarget: 'please add a target'
  };

  function getString( string, scope ) {
    return V.i18n( string, 'entity', scope || 'error message' ) + ' ';
  }

  /* ================== private methods ================= */

  async function castEntity( entityData ) {

    if ( entityData.location && !entityData.lat ) {
      return {
        success: false,
        endpoint: 'entity',
        status: 'no geo data',
        message: 'could not attach geo data'
      };
    }

    // check whether we have a valid title
    const title = castEntityTitle( entityData.title, entityData.role );

    if ( !title.success ) {
      return title; // error object
    }

    const target = castTarget( entityData );

    if ( !target.success ) {
      return target; // error object
    }

    // cast tag and fullId
    const tag = V.castTag();
    const fullId = title.data[0] + ' ' + tag;
    const slug = V.castSlugOrId( fullId );
    const path = '/profile/' + slug;

    // check whether this title and tag combination exists, otherwise start again
    const exists = await getEntity( fullId );

    if ( exists.success ) { // success is not a good thing here ;)
      return {
        success: false,
        endpoint: 'entity',
        status: 'entity exists',
        data: [fullId]
      };
    }

    const activeEntity = V.getState( 'activeEntity' );
    const imageUpload = V.getState( 'imageUpload' );
    const tinyImageUpload= V.getState( 'tinyImageUpload' );

    const d = new Date();
    const date = d.toString();
    const unix = Date.now();

    let geometry, uPhrase, creator, creatorTag, block, rpc, contract, thumbnail, tinyImage;

    if ( entityData.location && entityData.lat ) {
      geometry = {
        rand: false,
        type: 'Point',
        coordinates: [entityData.lng, entityData.lat],
      };
    }
    else {
      const gen = V.castRandLatLng();
      geometry = {
        rand: true,
        type: 'Point',
        coordinates: [ gen.lng, gen.lat ],
      };
    }

    if ( entityData.uPhrase ) {
      uPhrase = entityData.uPhrase; // for demo data
    }
    else {
      const gen = V.castUUID();
      uPhrase = 'vx' + gen.base64Url.slice( 0, 15 ) + 'X';
    }

    if ( imageUpload ) {
      thumbnail = {
        blob: imageUpload.blob,
        contentType: imageUpload.contentType,
        originalName: imageUpload.originalName,
        entity: fullId
      };
    }

    if ( tinyImageUpload ) {
      tinyImage = {
        blob: tinyImageUpload.blob,
        contentType: tinyImageUpload.contentType,
        originalName: tinyImageUpload.originalName,
        entity: fullId
      };
    }

    if ( activeEntity ) {
      creator = activeEntity.profile.title;
      creatorTag = activeEntity.profile.tag;
    }
    else {
      creator = title.data[0];
      creatorTag = tag;
    }

    if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) {

      if ( !entityData.evmAddress ) {
        const web3 = new Web3( Web3.givenProvider );
        const newEvmAccount = web3.eth.accounts.create();
        entityData.evmAddress = newEvmAccount.address.toLowerCase();
        entityData.evmPrivateKey = newEvmAccount.privateKey.toLowerCase();
        entityData.evmIssuer = 'VDID';
      }
      else {
        entityData.evmIssuer = 'SELF';
      }

      if ( ['skill', 'job'].includes( entityData.role ) ) {
        Object.assign( entityData, { evmReceivingAddress: V.aE().evmCredentials.address } );
      }

      await V.getContractState().then( res => {

        if ( res.success ) {
          block = res.data[0].currentBlock;
          rpc = res.data[0].network.rpc;
          contract = res.data[0].contract;
        }
        else {
          block = -1;
          rpc = 'error';
          contract = 'error';
        }
      } );
    }
    else {
      block = Math.floor( unix / 1000 );
      rpc = 'none';
      contract = 'none';
    }

    const host = window.location.host;

    if ( V.getSetting( 'transactionLedger' ) == 'Symbol' ) {

      // TODO: sync with EVM

      const newSymbolAddress = await V.setActiveAddress();
      entityData.symbolCredentials ? null : entityData.symbolCredentials = newSymbolAddress.data[0];
    }

    const uuid = V.castUUID();

    const email = activeEntity && activeEntity.social && activeEntity.social.email ? activeEntity.social.email : undefined;

    const newEntity = {
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
      geometry: geometry,
      social: {
        email: email,
      }
    };

    V.setState( 'imageUpload', 'clear' );

    return {
      success: true,
      endpoint: 'entity',
      status: 'cast entity',
      data: [ newEntity ]
    };
  }

  function castTarget( entityData ) {
    let error;

    entityData.target == '' ? entityData.target = undefined : null;

    if (  entityData.target ) {
      entityData.unit == '' ? error = getString( ui.noUnit ) : null;
      isNaN( entityData.target ) ? error = getString( ui.isNaN ) : null;
    }

    if ( ['pool'].includes( entityData.role ) ) {
      entityData.unit == '' ? error = undefined : null;
      !entityData.target ? error = getString( ui.noTarget ) : null;
      // entityData.target.toLowerCase().trim() == getString( ui.free ).trim() ? entityData.target = 0 : null;
    }

    Number( entityData.target ) > 9999 || Number( entityData.target ) < 0 ? error = getString( ui.targetRange ) : null;

    if ( error ) {
      return {
        success: false,
        endpoint: 'entity',
        status: 'invalid target',
        message: error
      };
    }
    else {
      return {
        success: true,
        endpoint: 'entity',
        status: 'cast entity target',
        data: [ entityData.target ]
      };
    }

  }

  /* ================== public methods ================== */

  function castEntityTitle( title, role ) {

    const titleArray = title.trim().toLowerCase().split( ' ' );

    var checkLength = titleArray.length;
    var wordLengthExeeded = titleArray.map( item => { return item.length > entitySetup.maxWordLength } );

    let error;

    ['vx', 'Vx', '0x'].includes( title.substring( 0, 2 ) ) ? error = getString( ui.invalidTitle + ' "' + 'vx' + '"' ) : null;
    // ( systemInit.communityGovernance.excludeNames.includes( tools.constructUserName( title ) ) && !( entityData.firstRegistration ) )  ? error = getString( ui.invalidTitle ) : null;
    entitySetup.useWhitelist && title.match( charWhitelist ) ? error = getString( ui.invalidTitle ) : null;
    title.match( charBlacklist ) ? error = getString( ui.invalidChar ) + ' "' + title.match( charBlacklist )[0] + '"' : null;
    !title.match( /[a-z]{2}|[A-Z]{2}/g ) ? error = getString( ui.min2Adjecent ) : null;
    title.length > 200  ? error = getString( ui.tooLong ) : null;
    title.length < 2 ? error = getString( ui.tooShort ) : null;
    // title.indexOf( '#' ) != -1 ? error = getString( ui.invalidTitle ) : null;
    title.indexOf( '2121' ) != -1 ? error = getString( ui.invalidTitle + ' "' + '2121' + '"'  ) : null;
    // title.replace( /[0-9]/g, '' ).length < title.length ? error = getString( ui.invalidTitle ) : null;
    // checkLength > entitySetup.capWordLength ? error = getString( ui.invalidTitle ) : null;
    ( [ 'member' ].includes( role ) && checkLength > entitySetup.maxHumanWords ) ? error = getString( ui.maxHuman ) : null;
    ( [ 'member' ].indexOf( role ) == -1 && checkLength > entitySetup.maxEntityWords ) ? error = getString( ui.maxEntity ) : null;
    wordLengthExeeded.includes( true ) ? error = getString( ui.maxLength ) : null;

    if ( error ) {
      return {
        success: false,
        endpoint: 'entity',
        status: 'invalid title',
        message: error
      };
    }
    else {

      const formattedTitle = titleArray.map( function( string ) {
        if ( string.length > 2 && string.substr( 0, 2 ) == 'mc' ) {
          return string.charAt( 0 ).toUpperCase() + string.slice( 1, 2 ) + string.charAt( 2 ).toUpperCase() + string.slice( 3 );
        }
        if ( string.length > 3 && string.substr( 0, 3 ) == 'mac' ) {
          return string.charAt( 0 ).toUpperCase() + string.slice( 1, 3 ) + string.charAt( 3 ).toUpperCase() + string.slice( 4 );
        }
        else {
          return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
        }
      } ).join( ' ' );

      return {
        success: true,
        endpoint: 'entity',
        status: 'cast entity title',
        data: [ formattedTitle ]
      };
    }
  }

  async function getEntityBalance( entity = V.aE() ) {

    const tL = V.getSetting( 'transactionLedger' );
    const tLWeb2 = V.getSetting( 'transactionLedgerWeb2' );

    const returnFalse = ( tL, bal ) => {
      return {
        success: false,
        endpoint: 'entity',
        ledger: tL,
        status: 'could not retrieve entity balance',
        message: bal,
        data: []
      };
    };

    if ( ['EVM', 'Symbol'].includes( tL ) && V.aA() && V.aE() ) {

      const bal = await V.getAddressState( entity[tL.toLowerCase() + 'Credentials']['address'] );

      if ( bal.success ) {
        return  {
          success: true,
          endpoint: 'entity',
          ledger: tL,
          status: 'entity balance retrieved',
          data: [
            {
              coinBalance: bal.data[0].coinBalance,
              tokenBalance: bal.data[0].tokenBalance,
              liveBalance: bal.data[0].liveBalance,
              lastBlock: bal.data[0].lastBlock,
              zeroBlock: bal.data[0].zeroBlock
            }
          ]
        };
      }
      else {
        return returnFalse( tL, bal );
      }
    }
    else if ( tLWeb2 == 'MongoDB' && V.aE() ) {
      const bal = await getEntity( entity.fullId );

      if ( bal.success ) {
        return  {
          success: true,
          endpoint: 'entity',
          ledger: tLWeb2,
          status: 'entity balance retrieved',
          data: [
            {
              tokenBalance: bal.data[0].onChain.balance,
              liveBalance: bal.data[0].onChain.balance, // TODO: this is the wrong live balance
              lastBlock: bal.data[0].onChain.lastMove,
            }
          ]
        };
      }
      else {
        return returnFalse( tL, bal );
      }
    }
    else {
      return returnFalse( tL, 'no aA and no aE' );
    }
  }

  function getEntity(
    // defaults to searching all entities (via all roles)
    which = 'all',
    filter = 'role'
  ) {

    const whichLedger = V.getSetting( 'entityLedger' );

    if ( whichLedger == 'MongoDB' ) {
      if ( which.substr( 0, 2 ) == '0x' ) {
        filter = 'evmAddress';
      }
      if (
        which.substr( 0, 1 ) == 'T' &&
        which.length == 40
      ) {
        filter = 'symbolAddress';
      }
      else if ( which.substr( 0, 2 ) == 'vx' ) {
        filter = 'uPhrase';
      }
      else if ( new RegExp( /#\d{4}/ ).test( which ) ) {
        filter = 'fullId';
      }
    }
    else if ( whichLedger == '3Box' ) {

      // TODO: this currently only requests a single entity if address is given
      // and returns false otherwise in order to allow castEntity to run successfully

      if ( which.substr( 0, 2 ) == '0x' ) {
        // TODO: filter = 'evmAddress';
      }
      else {
        return Promise.resolve( {
          success: false,
          endpoint: 'entity',
          status: 'return false for testing',
        } );
      }
    }

    return V.getData( which, 'entity by ' + filter, whichLedger );
  }

  async function setEntity( whichEntity, data ) {
    if ( typeof whichEntity == 'object' ) {
      let entityCast = await castEntity( whichEntity );

      while ( entityCast.status == 'entity exists' ) {
        console.log( 'entity exists (while loop):', entityCast.data[0].fullId );
        entityCast = await castEntity( whichEntity );
      }

      if ( entityCast.success ) {
        return V.setData( entityCast.data[0], 'entity', V.getSetting( 'entityLedger' ) );
      }
      else {
        return Promise.resolve( entityCast );
      }
    }
    else if ( data == 'verification' ) {
      return V.setData( whichEntity, 'verification', V.getSetting( 'transactionLedger' ) );
    }
    else {
      Object.assign( data, { entity: whichEntity } );
      return V.setData( data, 'entity update', V.getSetting( 'entityLedger' ) ).then( res => {
        V.setState( 'activeEntity', 'clear' );
        V.setState( 'activeEntity', res.data[0] );
        return res;
      } );
    }

  }

  function getQuery( data ) {
    return V.getData( data, 'entity by query', V.getSetting( 'entityLedger' ) );
  }

  /* ====================== export ====================== */

  V.castEntityTitle = castEntityTitle;
  V.getEntity = getEntity;
  V.setEntity = setEntity;
  V.getEntityBalance = getEntityBalance;
  V.getQuery = getQuery;

  return {
    castEntityTitle: castEntityTitle,
    getEntity: getEntity,
    setEntity: setEntity,
    getEntityBalance: getEntityBalance,
    getQuery: getQuery
  };

} )();
