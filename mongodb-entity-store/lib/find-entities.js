const systemInit = require( '../systemInit' );

const EntityDB = require( '../models/v-entity-model' );

exports.findAllEntities = ( txData ) => {

  const getUser = ( fullId ) => {
    return new Promise( resolve => {
      EntityDB.findOne( { fullId: fullId }, { uPhrase: false } ).exec( function( err, doc ) {
        if ( err ) { resolve( 'Error: ' + err )}
        doc ? resolve( doc ) : resolve( 'not found' );
      } );
    } );
  };

  // const getInitiator = ( uPhrase ) => {
  //   return new Promise( resolve => {
  //     EntityDB.findOne( { uPhrase: uPhrase }, { uPhrase: false } ).exec( function( err, doc ) {
  //       if ( err ) { resolve( 'Error: ' + err )}
  //       doc ? resolve( doc ) : resolve( 'not found' );
  //     } );
  //   } );
  // };

  // const findUserLoop = async ( index, nameArray ) => {
  //   var user = 'no matches';
  //   var counter = capOnWords;
  //   var ckeckName = nameArray;
  //   while ( counter > 0 ) {
  //     await new Promise( resolve => {
  //       var tag = messageParts[index],
  //         name = tools.constructUserName( ckeckName );
  //       getUser( name, tag ).then( doc => {
  //         if ( doc === 'not found' ) {
  //           ckeckName.shift();
  //           counter -= 1;
  //         }
  //         else {
  //           user = doc;
  //           counter -= 100;
  //         }
  //         resolve();
  //       } );
  //     } );
  //   }
  //   return user;
  // };

  // const findTagsLoop = async ( messageParts ) => {
  //   var users = [], nameArray;
  //   for ( let i = 0; i < messageParts.length; i++ ) {
  //     await new Promise( resolve => {
  //       if ( messageParts[i].charAt( 0 ) === '#' ) {
  //
  //         nameArray = ( function() {
  //           var w = capOnWords + 1, arr = [];
  //           while ( w-- ) { arr.push( messageParts[i - w] ) }
  //           arr.pop();
  //           return arr.filter( Boolean );
  //         } )();
  //
  //         findUserLoop( i, nameArray ).then( res => {
  //           res === 'no matches' ? null : users.push( res );
  //           resolve();
  //         } );
  //       }
  //       else {
  //         resolve();
  //       }
  //     } ); // end Promise
  //   } // end for loop
  //   return users;
  // };

  const findEntities = async ( txData ) => {
    const community = getUser( systemInit.communityGovernance.commName + ' ' +  systemInit.communityGovernance.commTag );
    const tax = getUser( systemInit.taxPool.name + ' ' +  systemInit.taxPool.tag  );
    // const initiatorData = getInitiator( uPhrase );
    const initiatorData = getUser( txData.initiator );
    // const messageEntities = findTagsLoop( messageParts );
    const messageEntities = getUser( txData.recipient );
    const all = await Promise.all( [ community, tax, initiatorData, messageEntities ] );
    const allmE = all[3];

    return all.splice( 0, 3 ).concat( allmE );
  };

  return findEntities( txData );

};
