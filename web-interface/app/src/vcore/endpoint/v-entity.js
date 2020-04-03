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

  async function createTag( title ) {

    // for testing and demo content creation
    return '#2121';

    const existingTagsForName = await V.getData( 'tags', { for: title }, V.getSetting( 'entityLedger' ) );

    var continueDice = true;

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

  function createEntityTitle( input ) {

    let titleArray = input;

    if ( typeof input === 'string' ) {
      titleArray = input.trim().toLowerCase().split( ' ' );
    }

    return titleArray.map( function( string ) {
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

  }

  /* ============ public methods and exports ============ */

  function getEntity( which, data ) {
    return V.getData( which, data, V.getSetting( 'entityLedger' ) );
  }

  function setEntity( which, data, whichLedger ) {

    if ( validateTitle( data.title, data.role ) ) {

      data.title = createEntityTitle( data.title );

      return createTag( data.title ).then( tag => {
        data.tag = tag;
        data.fullId = data.title + ' ' + data.tag;
        return V.setData( which, data, whichLedger );
      } );

    }
    else {
      return Promise.resolve( { status: 'invalid title', message: 'invalid title' } );
    }

  }

  async function getAllEntityData() {
    const activeAddress = V.getState( 'activeAddress' );
    const entityData = V.getEntity( 'by ethAddress', activeAddress ).then( entity => { return entity} );
    const chainData = V.getAddressState( activeAddress ).then( accState => { return accState} );

    const all = await Promise.all( [entityData, chainData] );

    return  {
      name: all[0].data[0].fullId,
      ethBalance: all[1].data.ethBalance,
      tokenBalance: all[1].data.tokenBalance,
      liveBalance: all[1].data.liveBalance,
      lastBlock: all[1].data.lastBlock,
      zeroBlock: all[1].data.zeroBlock
    };
  }

  return {
    getEntity: getEntity,
    setEntity: setEntity,
    getAllEntityData: getAllEntityData
  };

} )();
