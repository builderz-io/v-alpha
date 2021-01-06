const VEntity = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to create and manage entities
   *
   */

  'use strict';

  const entitySetup = {
    entityDocVersion: '/e1/v0',
    profileDocVersion: '/p1/v0',
    authDocVersion: '/a1/v0',
    useWhitelist: true, // allow only chars in whitelist
    maxEntityWords: 7,  // max allowed words in entity names (not humans)
    maxHumanWords: 3,  // max allowed words in human entity names
    maxWordLength: 14,  // max allowed length of each word in name
  };

  const charBlacklist = /[;/!?:@=&"<>#%(){}[\]|\\^~`]/g;
  const charWhitelist = /[^0-9^a-z^A-Z^\s]/g;

  /* ============== user interface strings ============== */

  const ui = {
    invalidTitle: 'Invalid title',
    invalidChar: 'Title: invalid character',
    maxLength: 'Title: max 14 characters in a word',
    min2Adjecent: 'Title: min 2 adjecent letters',
    maxHuman: 'Title: max 3 words',
    maxEntity: 'Title: max 7 words',
    tooLong: 'Title: max 200 characters',
    tooShort: 'Title: min 2 characters',
    free: 'free',
    targetRange: 'Target must be within 0 - 9999',
    isNaN: 'Target must be a number',
    noUnit: 'Please add a unit, such as "hour"',
    noTarget: 'Please add a target'
  };

  function getString( string, scope ) {
    return V.i18n( string, 'entity', scope || 'error message' ) + ' ';
  }

  /* ================== private methods ================= */

  async function castEntity( entityData ) {

    /**
     * Check whether lat/lng are present,
     * if the user entered a location.
     */

    if ( entityData.location && !entityData.lat ) {
      return {
        success: false,
        endpoint: 'entity',
        status: 'no geo data',
        message: 'could not attach geo data'
      };
    }

    /** Check whether the title is valid. */

    const title = castEntityTitle( entityData.title, entityData.role );

    if ( !title.success ) {
      return title; // return the error object
    }

    /** Check whether the target amount is valid. */

    const target = castTarget( entityData );

    if ( !target.success ) {
      return target; // return the error object
    }

    /** Cast tag and fullId. */

    const tag = V.castTag();
    const fullId = title.data[0] + ' ' + tag;

    /**
     * Check whether this title and tag combination exists,
     * otherwise start again.
     */

    const exists = await getEntity( fullId );

    if ( exists.success ) { // success is not a good thing here ;)
      return {
        success: false,
        endpoint: 'entity',
        status: 'entity exists',
        data: [fullId]
      };
    }

    /** Prepare data */

    const uuidE = V.castUuid().base64Url;
    const uuidP = V.castUuid().base64Url;
    const uuidA = V.castUuid().base64Url;
    const unix = Math.floor( Date.now() / 1000 );

    let geometry, uPhrase, creatorUuid, creator, creatorTag, block, rpc, contract, tinyImage, thumbnail, mediumImage;

    if ( entityData.location && entityData.lat ) {
      geometry = {
        rand: false,
        type: 'Point',
        coordinates: [ Number( entityData.lng ), Number( entityData.lat ) ],
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
      const gen = V.castUuid();
      uPhrase = 'vx' + gen.base64Url.slice( 0, 15 ) + 'X';
    }

    const activeEntity = V.getState( 'activeEntity' );

    if ( activeEntity ) {
      creatorUuid = activeEntity.uuidE;
      creator = activeEntity.profile.title;
      creatorTag = activeEntity.profile.tag;
    }
    else {
      creatorUuid = uuidE;
      creator = title.data[0];
      creatorTag = tag;
    }

    const email = activeEntity && activeEntity.social && activeEntity.social.email ? activeEntity.social.email : undefined;

    V.getState( 'tinyImageUpload' ) ? tinyImage = V.getState( 'tinyImageUpload' ) : null;
    V.getState( 'thumbnailUpload' ) ? thumbnail = V.getState( 'thumbnailUpload' ) : null;
    V.getState( 'mediumImageUpload' ) ? mediumImage = V.getState( 'mediumImageUpload' ) : null;
    V.setState( 'tinyImageUpload', 'clear' );
    V.setState( 'thumbnailUpload', 'clear' );
    V.setState( 'mediumImageUpload', 'clear' );

    if ( 'EVM' == V.getSetting( 'transactionLedger' ) ) {

      if ( !entityData.evmAddress ) {
        const newEvmAccount = window.Web3Obj.eth.accounts.create();
        entityData.evmAddress = newEvmAccount.address.toLowerCase();
        entityData.evmPrivateKey = newEvmAccount.privateKey.toLowerCase();
        entityData.evmIssuer = 'IDXNS';
      }
      else {
        entityData.evmIssuer = 'SELF';
      }

      if ( Object.keys( V.getState( 'rolesWithReceivingAddress' ) ).includes( entityData.role ) ) {
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
    else if ( 'Symbol' == V.getSetting( 'transactionLedger' ) ) {

      // EXPERIMENTAL

      const newSymbolAddress = await V.setActiveAddress();
      entityData.symbolCredentials ? null : entityData.symbolCredentials = newSymbolAddress.data[0];
    }

    const entityCast = {

      contextE: entitySetup.entityDocVersion,
      typeE: entityData.role,
      uuidE: uuidE,

      contextP: entitySetup.profileDocVersion,
      uuidP: uuidP,

      contextA: entitySetup.authDocVersion,
      uuidA: uuidA,

      active: true,
      statusCode: 100,

      title: title.data[0],
      tag: tag,

      creatorUuid: creatorUuid,

      uPhrase: uPhrase,

      issuer: window.location.host,
      unix: unix,
      expires: unix + 60 * 60 * 24 * 180,

      evmCredentials: {
        address: entityData.evmAddress,
        privateKey: entityData.evmPrivateKey,
        evmIssuer: entityData.evmIssuer,
      },
      symbolCredentials: entityData.symbolCredentials || {
        address: undefined
      },
      receivingAddresses: {
        evm: entityData.evmReceivingAddress
      },

      props: {
        baseLocation: entityData.location || undefined,
        descr: entityData.description || undefined,
        target: target.data[0],
        unit: entityData.unit || undefined,
        email: email,
        prefLangs: undefined
      },

      geometry: geometry,

      tinyImageDU: tinyImage ? tinyImage.dataUrl : undefined,
      thumbnailDU: thumbnail ? thumbnail.dataUrl : undefined,
      mediumImageDU: mediumImage ? mediumImage.dataUrl : undefined,

      // for backwards compatibility
      tinyImage: tinyImage,
      thumbnail: thumbnail,
      mediumImage: mediumImage,
      creator: creator,
      creatorTag: creatorTag,
      block: block,
      rpc: rpc,
      contract: contract

    };

    return {
      success: true,
      endpoint: 'entity',
      status: 'cast entity',
      data: [ entityCast ]
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
        data: [ Number( entityData.target ) ]
      };
    }

  }

  /* ================== public methods ================== */

  function castEntityTitle( title, role ) {

    const titleArray = title.trim().toLowerCase().split( ' ' );

    var checkLength = titleArray.length;
    var wordLengthExeeded = titleArray.map( item => item.length > entitySetup.maxWordLength );

    let error;

    ['vx', 'Vx', '0x'].includes( title.substring( 0, 2 ) ) ? error = getString( ui.invalidTitle + ' "' + 'vx' + '"' ) : null;
    title.indexOf( '2121' ) != -1 ? error = getString( ui.invalidTitle + ' "' + '2121' + '"'  ) : null;
    entitySetup.useWhitelist && title.match( charWhitelist ) ? error = getString( ui.invalidTitle ) : null;
    title.match( charBlacklist ) ? error = getString( ui.invalidChar ) + ' "' + title.match( charBlacklist )[0] + '"' : null;
    !title.match( /[a-z]{2}|[A-Z]{2}/g ) ? error = getString( ui.min2Adjecent ) : null;
    // title.length > 200  ? error = getString( ui.tooLong ) : null; // redundant rule
    // title.length < 2 ? error = getString( ui.tooShort ) : null; // redundant rule
    // title.indexOf( '#' ) != -1 ? error = getString( ui.invalidTitle ) : null;
    // title.replace( /[0-9]/g, '' ).length < title.length ? error = getString( ui.invalidTitle ) : null;
    ( [ 'member' ].includes( role ) && checkLength > entitySetup.maxHumanWords ) ? error = getString( ui.maxHuman ) : null;
    ( [ 'member' ].indexOf( role ) == -1 && checkLength > entitySetup.maxEntityWords ) ? error = getString( ui.maxEntity ) : null;
    wordLengthExeeded.includes( true ) ? error = getString( ui.maxLength ) : null;

    if ( error ) {
      return {
        success: false,
        endpoint: 'entity',
        status: 'invalid title',
        message: '🔮' + ' ' + error
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

    const returnFalse = ( tL, bal ) => ( {
      success: false,
      endpoint: 'entity',
      ledger: tL,
      status: 'could not retrieve entity balance',
      message: bal,
      data: []
    } );

    if ( ['EVM', 'Symbol'].includes( tL ) && V.aE() /* && V.aA() */ ) {

      const bal = entity[tL.toLowerCase() + 'Credentials']
        ? await V.getAddressState( entity[tL.toLowerCase() + 'Credentials']['address'] )
        : { success: false };

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

    if ( ['MongoDB', 'Firebase'].includes( whichLedger ) ) {
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
      Object.assign( data, {
        entity: whichEntity,
        // auth: V.getCookie( 'last-active-uphrase' ) ? V.getCookie( 'last-active-uphrase' ).replace( /"/g, '' ) : ''
      } );
      return V.setData( data, 'entity update', V.getSetting( 'entityLedger' ) ).then( res => {

        /* Only update state if activeEntity was edited, not a managed entity */

        if (
          'MongoDB' == V.getSetting( 'entityLedger' ) &&
          V.getState( 'activeEntity' ).fullId == res.data[0].fullId
        ) {
          V.setState( 'activeEntity', 'clear' );
          V.setState( 'activeEntity', res.data[0] );
        }
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
