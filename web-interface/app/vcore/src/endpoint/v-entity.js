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
    daysToExpiry: 365 * 2,
    useWhitelist: true, // allow only chars in whitelist
    maxEntityWords: 7,  // max allowed words in entity names (not humans)
    maxHumanWords: 3,  // max allowed words in human entity names
    maxWordLength: 16,  // max allowed length of each word in name
  };

  const charBlacklist = /[.,;/!?:@=&"<>#%(){}[\]|\\^~`]/g;
  const charWhitelist = /[^0-9^a-z^A-Z^\s^'-–]/g;

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      invalidTitle: 'Invalid title',
      invalidChar: 'Title: invalid character',
      maxLength: 'Title: max 16 characters in a word',
      min2Adjecent: 'Title: min 2 adjacent letters',
      maxHuman: 'Title: max 3 words',
      maxEntity: 'Title: max 7 words',
      // tooLong: 'Title: max 200 characters',
      // tooShort: 'Title: min 2 characters',
      noNumbers: 'Title: Your personal name can not include a number',
      free: 'free',
      targetRange: 'Target must be within 0 - 9999',
      isNaN: 'Target must be a number',
      noUnit: 'Please add a unit, such as "hour"',
      noTarget: 'Please add a target',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== private methods ================= */

  async function castEntity( entityData ) {

    /**
     * Perfrom some initial input validation already client side,
     * so that we don't even hit the server:
     *
     * - Is lat/lng are present, if the user entered a location?
     * - Is the title valid?
     * - Are target and unit valid?
     */

    if ( entityData.location && !entityData.lat ) {
      return {
        success: false,
        endpoint: 'entity',
        status: 'no geo data',
        message: 'geoData is incomplete - select from suggestions',
      };
    }

    // const title = { data: [entityData.title] }; // test server response

    const title = castEntityTitle( entityData.title.toLowerCase(), entityData.role );

    if ( !title.success ) {
      return title; // return the error object
    }

    // const target = { data: [ Number( entityData.target ) ] }; // test server response

    const target = castTarget( entityData.target, entityData.unit, entityData.role );

    if ( !target.success ) {
      return target; // return the error object
    }

    /** Cast a tag */

    const tag = castTag();

    /**
     * Check whether this title and tag combination exists,
     * otherwise start again.
     *
     * NOTE: now server side
     */

    // const fullId = title.data[0] + ' ' + tag;
    // const exists = await getEntity( fullId );

    // if ( exists.success ) { // success is not a good thing here ;)
    //   return {
    //     success: false,
    //     endpoint: 'entity',
    //     status: 'entity exists',
    //     data: [fullId],
    //   };
    // }

    /** Prepare data */

    const uuidE = V.castUuid().base64Url.substr( 3, V.getSetting( 'uuidStringLength' ) );
    const uuidP = V.castUuid().base64Url.substr( 3, V.getSetting( 'uuidStringLength' ) );
    const uuidA = V.castUuid().base64Url.substr( 3, V.getSetting( 'uuidStringLength' ) );
    const unix = V.castUnix();

    let geometry = {};

    let uPhrase, creatorUuid, heldBy, block, rpc, contract, tinyImage, thumbnail, mediumImage;

    if ( entityData.location && entityData.lat ) {
      geometry = {
        coordinates: [ Number( entityData.lng ), Number( entityData.lat ) ],
        baseLocation: entityData.location || undefined,
        type: 'Point',
        rand: false,
      };
    }
    else if ( entityData.location && !entityData.lat ) {
      geometry = {
        baseLocation: entityData.location || undefined,
      };
    }
    // else {
    //   const gen = V.castRandLatLng();
    //   geometry = {
    //     coordinates: [ gen.lng, gen.lat ],
    //     // baseLocation: entityData.location || undefined,
    //     type: 'Point',
    //     rand: true,
    //   };
    // }

    if ( entityData.uPhrase ) {
      uPhrase = entityData.uPhrase; // for demo data
    }
    else {
      const gen = V.castUuid();
      uPhrase = 'vx' + gen.base64Url.slice( 0, 15 ) + 'X';
    }

    const aE = V.getState( 'activeEntity' );

    if ( aE ) {
      // heldBy = aE.uuidE;
      creatorUuid = aE.uuidE;
    }
    // else {
    //   heldBy = [uuidE];
    //   creatorUuid = uuidE;
    // }

    const email = aE && aE.properties ? aE.properties.email || undefined : undefined;

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

      const newSymbolAddress = await V.setConnectedAddress();
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
      heldBy: heldBy,

      uPhrase: uPhrase,

      issuer: window.location.host,
      unix: unix,
      expires: unix + 60 * 60 * 24 * entitySetup.daysToExpiry,

      evmCredentials: {
        address: entityData.evmAddress,
        privateKey: entityData.evmPrivateKey,
        evmIssuer: entityData.evmIssuer,
      },
      symbolCredentials: entityData.symbolCredentials || {
        address: undefined,
      },
      receivingAddresses: {
        evm: entityData.evmReceivingAddress,
      },

      props: {
        descr: entityData.description || undefined,
        target: target.data[0],
        unit: entityData.unit || undefined,
        email: email,
        emailPrivate: entityData.emailPrivate || undefined,
      },

      geometry: geometry,

      imageName: thumbnail ? thumbnail.originalName : undefined,
      tinyImageDU: tinyImage ? tinyImage.dataUrl : undefined,
      thumbnailDU: thumbnail ? thumbnail.dataUrl : undefined,
      mediumImageDU: mediumImage ? mediumImage.dataUrl : undefined,

      continent: entityData.continent,
      avatar: entityData.avatar,
      privacy: entityData.privacy,

      // for backwards compatibility
      tinyImage: tinyImage,
      thumbnail: thumbnail,
      mediumImage: mediumImage,
      // creator: creator,
      // creatorTag: creatorTag,
      block: block,
      rpc: rpc,
      contract: contract,

    };

    return {
      success: true,
      endpoint: 'entity',
      status: 'cast entity',
      data: [ entityCast ],
    };
  }

  /* ================== public methods ================== */

  function castEntityTitle( title, role ) {

    title = title.trim().toLowerCase();

    /* Remove the dashes in title for checking and formatting to work */
    const titleNoDashArray = title.replace( /[-–]/g, ' ' ).split( ' ' );
    const checkLength = titleNoDashArray.length;
    const wordLengthExeeded = titleNoDashArray.map( item => item.length > entitySetup.maxWordLength );

    let error;

    ['vx', 'Vx', '0x'].includes( title.substring( 0, 2 ) ) ? error = V.getString( ui.invalidTitle + ' "' + 'vx' + '"' ) : null;
    title.indexOf( '2121' ) != -1 ? error = V.getString( ui.invalidTitle + ' "' + '2121' + '"'  ) : null;
    entitySetup.useWhitelist && title.match( charWhitelist ) ? error = V.getString( ui.invalidTitle ) : null;
    title.match( charBlacklist ) ? error = V.getString( ui.invalidChar ) + ' "' + title.match( charBlacklist )[0] + '"' : null;
    !title.match( /[a-z]{2}|[A-Z]{2}/g ) ? error = V.getString( ui.min2Adjecent ) : null;
    // title.length > 200  ? error = V.getString( ui.tooLong ) : null; // redundant rule
    // title.length < 2 ? error = V.getString( ui.tooShort ) : null; // redundant rule
    // title.indexOf( '#' ) != -1 ? error = V.getString( ui.invalidTitle ) : null;
    // title.replace( /[0-9]/g, '' ).length < title.length ? error = V.getString( ui.invalidTitle ) : null;
    ( [ 'Person', 'PersonMapped' ].includes( role ) && checkLength > entitySetup.maxHumanWords ) ? error = V.getString( ui.maxHuman ) : null;
    ( [ 'Person', 'PersonMapped' ].includes( role ) && title.match( /[0-9]/g ) ) ? error = V.getString( ui.noNumbers ) : null;
    ( [ 'Person', 'PersonMapped' ].indexOf( role ) == -1 && checkLength > entitySetup.maxEntityWords ) ? error = V.getString( ui.maxEntity ) : null;
    wordLengthExeeded.includes( true ) ? error = V.getString( ui.maxLength ) : null;

    if ( error ) {
      return {
        success: false,
        endpoint: 'entity',
        status: 'invalid title',
        message: /* '🔮' + ' ' + */ error,
      };
    }
    else {

      let formattedTitle = titleNoDashArray.map( function( string ) {
        if ( /* [ 'Person', 'PersonMapped' ].includes( role ) && */ string.length > 2 && string.substr( 0, 2 ) == 'mc' ) {
          return string.charAt( 0 ).toUpperCase() + string.slice( 1, 2 ) + string.charAt( 2 ).toUpperCase() + string.slice( 3 );
        }
        if ( /* [ 'Person', 'PersonMapped' ].includes( role ) && */ string.length > 3 && string.substr( 0, 3 ) == 'mac' ) {
          return string.charAt( 0 ).toUpperCase() + string.slice( 1, 3 ) + string.charAt( 3 ).toUpperCase() + string.slice( 4 );
        }
        else {
          return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
        }
      } ).join( ' ' );

      /* bring back the dash if originally found in title */
      if ( title.indexOf( '-' ) != -1 || title.indexOf( '–' ) != -1 ) {
        const index = title.indexOf( '-' ) + title.indexOf( '–' ) + 1;
        const x = formattedTitle.split( '' );
        x[index] = '-';
        formattedTitle = x.join( '' );
      }

      return {
        success: true,
        endpoint: 'entity',
        status: 'cast entity title',
        data: [ formattedTitle ],
      };
    }
  }

  function castTag() {
    // debug
    // return '#2121';

    // for demo content creation
    // if ( V.getSetting( 'demoContent' ) ) {
    //   return '#2121';
    // }

    let continueDice = true;

    while ( continueDice ) {
      const number1 = String( V.castRandomInt( 2, 9 ) );
      const number2 = String( V.castRandomInt( 1, 9 ) );
      const number3 = String( V.castRandomInt( 2, 9 ) );

      if (
        number2 != number1
        && number3 != number1
        && number3 != number2
        && [number1, number2, number3].indexOf( '6' ) == -1 // could be mistaken for 8
        && [number1, number2, number3].indexOf( '7' ) == -1 // has two syllables
        && [number1, number2, number3].indexOf( '4' ) == -1 // stands for death in asian countries
        && number1 + number2 != '69' // sexual reference
        && number3 + number2 != '69'
        && number1 + number2 != '13' // bad luck in Germany
        && number3 + number2 != '13'
        && number1 + number2 != '21' // special VI tag
        && number3 + number2 != '21'
      ) {
        continueDice = false;
        const tag = '#' + number1 + number2 + number3 + number2;
        return tag;
      }
    }
  }

  function castTarget( target, unit, role )  {
    let error;

    target == '' ? target = undefined : null;

    if (  target ) {
      unit == '' ? error = V.getString( ui.noUnit ) : null;
      isNaN( target ) ? error = V.getString( ui.isNaN ) : null;
    }

    if ( ['Pool'].includes( role ) ) {
      unit == '' ? error = undefined : null;
      !target ? error = V.getString( ui.noTarget ) : null;
      // target.toLowerCase().trim() == V.getString( ui.free ).trim() ? target = 0 : null;
    }

    Number( target ) > 9999 || Number( target ) < 0 ? error = V.getString( ui.targetRange ) : null;

    if ( error ) {
      return {
        success: false,
        endpoint: 'entity',
        status: 'invalid target',
        message: error,
      };
    }
    else {
      return {
        success: true,
        endpoint: 'entity',
        status: 'cast entity target',
        data: [ Number( target ) || undefined ],
      };
    }

  }

  async function getEntityBalance( entity = V.aE() ) {

    const tL = V.getSetting( 'transactionLedger' );

    const returnFalse = ( tL, bal ) => ( {
      success: false,
      endpoint: 'entity',
      ledger: tL,
      status: 'could not retrieve entity balance',
      message: bal,
      data: [],
    } );

    if ( ['EVM', 'Symbol'].includes( tL ) && V.aE() /* && V.cA() */ ) {

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
            bal.data[0],
          ],
        };
      }
      else {
        return returnFalse( tL, bal );
      }
    }
    else if ( tL == 'MongoDB' && V.aE() ) {
      const bal = await getEntity( entity.fullId );

      if ( bal.success ) {
        return  {
          success: true,
          endpoint: 'entity',
          ledger: tL,
          status: 'entity balance retrieved',
          data: [
            {
              tokenBalance: bal.data[0].onChain.balance,
              liveBalance: bal.data[0].onChain.balance, // TODO: this is the wrong live balance
              lastBlock: bal.data[0].onChain.lastMove,
            },
          ],
        };
      }
      else {
        return returnFalse( tL, bal );
      }
    }
    else {
      return returnFalse( tL, 'no cA and no aE' );
    }
  }

  function getEntity(
    // defaults to searching all entities (via all roles)
    which = 'all',
    filter = 'role',
  ) {

    const whichLedger = V.getSetting( 'entityLedger' );

    if ( ['MongoDB', 'Firebase'].includes( whichLedger ) ) {

      if (
        typeof which == 'object'
        || Array.isArray( which )
      ) {
        filter = 'uuidE';
      }
      else if (
        new RegExp( /\s#\d{4}/ ).test( which )
      ) {
        filter = 'fullId';
      }
      else if ( 'feature' == which ) {
        filter = which;
      }
      else if ( 'highlight' == which ) {
        filter = which;
      }
      else if ( 'point' == which ) {
        filter = which;
      }
      else if (
        which.length == V.getSetting( 'uuidStringLength' )
      ) {
        filter = 'uuidE';
      }
      else if (
        '0x' == which.substr( 0, 2 )
        && which.length == 42
      ) {
        filter = 'evmAddress';
      }
      else if (
        'JOIN' == which.substr( 0, 4 )
        && which.length == 48
      ) {
        filter = 'evmAddress';
      }
      else if (
        which.substr( 0, 1 ) == 'T'
        && which.length == 40
      ) {
        filter = 'symbolAddress';
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
    else if ( 'verification' == data ) {
      return V.setData( whichEntity, 'verification', V.getSetting( 'transactionLedger' ) );
    }
    else if ( V.checkForEmphasisTrigger( data ) ) {
      return V.setData( whichEntity, data, V.getSetting( 'entityLedger' ) );
    }
    else {
      Object.assign( data, {
        entity: whichEntity,
      } );
      return V.setData( data, 'entity update', V.getSetting( 'entityLedger' ) ).then( res => {
        console.log( 'RESPONSE:', res );

        if ( res.success ) {
          V.setCache( 'viewed', 'clear' ); // TODO: could be more granular

          /** Only update state if activeEntity was edited, not a managed entity */
          if (
            'Firebase' == V.getSetting( 'entityLedger' )
            && [ V.aE().uuidE, V.aE().uuidP ].includes( res.data[0].a )
          ) {
            getEntity( V.aE().uuidE ).then( res => {
              if ( res.success ) {
                V.setActiveEntity( res.data[0] ); // pass object
              }
            } );
          }
          else if (
            'MongoDB' == V.getSetting( 'entityLedger' )
            && V.aE().fullId == res.data[0].fullId
          ) {
            V.setActiveEntity( res.data[0] );
          }
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
  V.castTag = castTag;
  V.castTarget = castTarget;
  V.getEntity = getEntity;
  V.setEntity = setEntity;
  V.getEntityBalance = getEntityBalance;
  V.getQuery = getQuery;

  return {
    castEntityTitle: castEntityTitle,
    castTag: castTag,
    castTarget: castTarget,
    getEntity: getEntity,
    setEntity: setEntity,
    getEntityBalance: getEntityBalance,
    getQuery: getQuery,
  };

} )();
