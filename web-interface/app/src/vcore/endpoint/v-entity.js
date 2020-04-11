const VEntity = ( function() { // eslint-disable-line no-unused-vars

  // TODO:
  // what if dice cant find a free number? better pick from list?
  // location

  /**
   * V Entity
   *
   */

  'use strict';

  const entitySetup = {
    capWordLength: 7,  // a cap on the number of words in an entity name that the system can handle
    maxEntityWords: 7,  // max allowed words in entity names (not humans) // MUST be less or equal to capWordLength
    maxHumanWords: 3,  // max allowed words in human entity names // MUST be less or equal to capWordLength
    maxWordLength: 12,  // max allowed length of each word in name
  };

  /* ================== private methods ================= */

  async function castEntity( entityData ) {
    const all = await Promise.all( [
      castTag( entityData.title ),
      V.getContractState()
    ] );
    const title = V.castEntityTitle( entityData.title );
    const address = entityData.evmAddress ? entityData.evmAddress : V.getState( 'activeAddress' );

    const d = new Date();
    const date = d.toString();
    const unix = Date.now();

    let geometry;

    if ( entityData.location && entityData.lat ) {
      geometry = {
        type: 'Point',
        coordinates: [entityData.lng, entityData.lat],
      };
    }
    else {
      geometry = {
        type: 'Point',
        coordinates: [( Math.random() * ( 54 - 32 + 1 ) + 32 ).toFixed( 5 ) * -1, ( Math.random() * ( 35 - 25 + 1 ) + 25 ).toFixed( 5 )],
      };
    }

    const newEntity = {
      fullId: title + ' ' + all[0],
      evmAddress: address,
      profile: {
        fullId: title + ' ' + all[0],
        title: title,
        tag: all[0],
        role: entityData.role ? entityData.role : 'network',
        verified: false,
        joined: {
          date: date,
          unix: unix,
          block: all[1].success ? all[1].data[0].currentBlock : 0,
        },
        status: 'active'
      },
      evmCredentials: {
        address: address
      },
      properties: {
        location: entityData.location || 'no location given',
        description: entityData.description || 'no description given',
        target: entityData.target || 'none',
        unit: entityData.unit || 'none',
      },
      geometry: geometry,
    };

    return newEntity;
  }

  async function castTag( title ) {

    // for testing and demo content creation
    return '#2121';

    const existingTagsForName = await V.getData( { for: title }, 'tags', V.getSetting( 'entityLedger' ) );

    let continueDice = true;

    while ( continueDice ) { // 334 combinations in the format of #5626
      const number1 = String( Math.floor( Math.random() * ( 9 - 2 + 1 ) ) + 2 );
      const number2 = String( Math.floor( Math.random() * ( 9 - 1 + 1 ) ) + 1 );
      const number3 = String( Math.floor( Math.random() * ( 9 - 2 + 1 ) ) + 2 );

      if (
        number2 != number1 &&
        number3 != number1 &&
        number3 != number2 &&
        [number1, number2, number3].indexOf( '7' ) == -1 && // has two syllables
        [number1, number2, number3].indexOf( '4' ) == -1 && // stands for death in asian countries
        number1 + number2 != '69' && // sexual reference
        number3 + number2 != '69' &&
        number1 + number2 != '13' && // bad luck in Germany
        number3 + number2 != '13' &&
        number1 + number2 != '21' && // special VI tag
        number3 + number2 != '21' &&
        existingTagsForName.data.indexOf( '#' + number1 + number2 + number3 + number2 ) == -1
      ) {
        continueDice = false;
        return '#' + number1 + number2 + number3 + number2;
      }
    }
  }

  function validateTitle( title, role ) {

    var checkLength = title.split( ' ' ).length;
    var wordLengthExeeded = title.split( ' ' ).map( item => { return item.length > entitySetup.maxWordLength } );

    if (
      ['vx', 'Vx', '0x'].includes( title.substring( 0, 2 ) ) ||
         // ( systemInit.communityGovernance.excludeNames.includes( tools.constructUserName( title ) ) && !( entityData.firstRegistration ) ) ||
         title.length > 200 ||
         title.length < 2 ||
         title.indexOf( '#' ) != -1 ||
         title.indexOf( '2121' ) != -1 ||
         // title.replace( /[0-9]/g, '' ).length < title.length ||
         checkLength > entitySetup.capWordLength ||
         ( ['member', 'network'].includes( role ) && checkLength > entitySetup.maxHumanWords ) ||
         ( ['member', 'network'].indexOf( role ) == -1 && checkLength > entitySetup.maxEntityWords ) ||
         wordLengthExeeded.includes( true )
    ) {
      return false;
    }
    else {
      return true;
    }

  }

  /* ============ public methods and exports ============ */

  function getEntity(
    // defaults to searching all entities (by 'role')
    which = 'all',
    filter = 'role'
  ) {

    if ( which.substr( 0, 2 ) == '0x' ) {
      filter = 'evmAddress';
    }
    else if ( new RegExp( /#\d{4}/ ).test( which ) ) {
      filter = 'fullId';
    }

    return V.getData( which, 'entity by ' + filter, V.getSetting( 'entityLedger' ) );
  }

  async function setEntity( entityData, options = 'entity' ) {

    if ( options == 'verification' ) {
      return V.setData( entityData, options, V.getSetting( 'transactionLedger' ) );
    }
    else {
      const validTitle = validateTitle( entityData.title, entityData.role );

      if ( validTitle ) {
        const entityCast = await castEntity( entityData );
        return V.setData( entityCast, options, V.getSetting( 'entityLedger' ) );
      }
      else {
        return Promise.resolve( {
          success: false,
          status: 'invalid title',
          message: 'invalid title'
        } );
      }
    }
  }

  async function getActiveEntityData() {
    const aA = V.getState( 'activeAddress' );
    const txLedger = V.getSetting( 'transactionLedger' );

    let all;

    if( txLedger == 'EVM' ) {
      all = await Promise.all( [
        getEntity( aA ),
        V.getAddressState( aA )
      ] );
      if ( all[0].success && all[1].success ) {
        return  {
          success: true,
          status: 'EVM all entity data retrieved',
          data: [
            {
              name: all[0].data[0].fullId,
              ethBalance: all[1].data[0].ethBalance,
              tokenBalance: all[1].data[0].tokenBalance,
              liveBalance: all[1].data[0].liveBalance,
              lastBlock: all[1].data[0].lastBlock,
              zeroBlock: all[1].data[0].zeroBlock
            }
          ]
        };
      }
      else {
        return  {
          success: false,
          status: 'EVM all entity data not retrieved',
          data: []
        };
      }
    }
    else if ( txLedger == 'MongoDB' ) {
      all = await Promise.all( [
        getEntity( aA )
      ] );
      if ( all[0].success && all[0].data[0].length ) {
        return  {
          success: true,
          status: 'MongoDB all entity data retrieved',
          data: [
            {
              name: all[0].data[0].fullId,
              ethBalance: 'not available',
              tokenBalance: all[0].data[0].onChain.balance,
              liveBalance: all[0].data[0].onChain.balance, // TODO: this is the wrong balance
              lastBlock: all[0].data[0].onChain.lastMove,
              zeroBlock: 'not available'
            }
          ]
        };
      }
      else {
        return  {
          success: false,
          status: 'MongoDB all entity data not retrieved',
          data: []
        };
      }
    }
  }

  return {
    getEntity: getEntity,
    setEntity: setEntity,
    getActiveEntityData: getActiveEntityData
  };

} )();
