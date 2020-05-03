const systemInit = require( '../../systemInit' );
const i18n = require( '../../lang/' + systemInit.language );

const EntityDB = require( '../../models/v-entity-model' );
const TxDB = require( '../../models/v-transaction-model' );

const daysToZero = systemInit.tokenDyn.daysToZero;
const baseTimeToZero = systemInit.tokenDyn.baseTimeToZero * daysToZero;
const setTxFee = systemInit.tokenDyn.setTxFee;

const getBurned = ( entity, timeSecondsUNIX ) => {

  var a = timeSecondsUNIX - entity.onChain.lastMove, // elapsed time
    b = Math.ceil( entity.onChain.balance - entity.onChain.balance * ( a / entity.onChain.timeToZero ) ),
    c = entity.onChain.balance - b,
    d = entity.onChain.lastMove + entity.onChain.timeToZero - timeSecondsUNIX;

  return { burnedBlocks: a, burnedBalance: b, burnedDelta: c, remainingTimeToZero: d };
};

module.exports.updateAllEntities = async ( txRoleEntities, amount, date, timeSecondsUNIX, reference, txType ) => {

  var processedRecipients = 0;

  const txFee = Math.ceil( amount * setTxFee );  // var txFee = txArray[0] & 1 == 1 ? Math.ceil(txArray[0] * setTxFee) : Math.floor(txArray[0] * setTxFee); // i & 1 == 1 ? checks first bit
  const sender = txRoleEntities[2]; // TODO , was txRoleEntities.find( obj => {return obj.roleInTx === 'sender' } );
  const numberOfRecipients = 1; // TODO , was txRoleEntities.filter( obj => {return obj.roleInTx === 'recipient' } ).length;

  const burnS = getBurned( sender, timeSecondsUNIX );
  const newSenderBalance = burnS.burnedBalance - ( ( amount + txFee ) * numberOfRecipients );

  const updateSender = function() {
    return new Promise( resolve => {  // update sender onChain and stats

      EntityDB.findOneAndUpdate(
        { fullId: sender.fullId },
        {
          $set: { 'onChain.balance': newSenderBalance,
            'onChain.lastMove': timeSecondsUNIX,
            'onChain.timeToZero': burnS.remainingTimeToZero,
          },
          $inc: { 'stats.sendVolume': amount * numberOfRecipients }
        },
        {
          new: true,
        },
        ( err ) => {
          if ( err ) {
            console.log( err );
            // return handleMongoDBerror( 'Update Sender in Database', err );
          }

          resolve( 'sender updated' );
        }
      ); // end findOneAndUpdate
    } ); // end Promise
  }; // close updateSender function

  await updateSender();

  for ( let i = 0; i < txRoleEntities.length; i++ ) {

    const entity = txRoleEntities[i];

    if ( entity.roleInTx === 'recipient' ) {

      processedRecipients += 1;

      const burnR = getBurned( entity, timeSecondsUNIX );
      const newRecipientBalance = burnR.burnedBalance + amount;
      const newTimeToZeroRecipient = Math.ceil( burnR.remainingTimeToZero * ( burnR.burnedBalance / newRecipientBalance ) + baseTimeToZero * ( amount / newRecipientBalance ) );

      const updateRecipient = function() {

        const a = new Promise( resolve => {  // update recipient onChain and stats
          EntityDB.findOneAndUpdate(
            { fullId: entity.fullId },
            {
              $set: { 'onChain.balance': newRecipientBalance,
                'onChain.lastMove': timeSecondsUNIX,
                'onChain.timeToZero': newTimeToZeroRecipient,
              },
              $inc: { 'stats.receiveVolume': amount,
              }
            },
            {
              new: true,
            },
            ( err ) => {
              if ( err ) {return handleMongoDBerror( 'Update Recipient in Database', err )}
              resolve( 'recipient updated' );
            } // close callback
          ); // close findOneAndUpdate
        } ); // close Promise a

        const b = new Promise( resolve => {  // update recipient requestStats if applicable
          if ( txType === i18n.str50020 ) {

            EntityDB.findOneAndUpdate(
              { fullId: entity.fullId },
              {
                $set: { 'requestStats.lastDate': date,
                  'requestStats.lastPool': sender.profile.title,
                  'requestStats.lastAmount': amount,
                },
                $inc: { 'requestStats.totalRequested': amount,
                }
              },
              ( err ) => {
                if ( err ) {return handleMongoDBerror( 'Update Recipient Request Stats in Database', err )}
                resolve( 'Recipient Request Stats resolved incl requestStats' );
              } // close callback
            );  // close findOneAndUpdate
          }
          else {
            resolve( 'Recipient Request Stats resolved excl requestStats' );
          } // end if (request)
        } ); // close Promise b

        const c = new Promise( resolve => {  // write to recipient tx history
          TxDB.findOneAndUpdate(
            { fullId: entity.fullId },
            { $push: { txHistory: {
              date: date,
              initiator: txRoleEntities[2].profile.title,
              initiatorTag: txRoleEntities[2].profile.tag,
              from: sender.profile.title,
              fromTag: sender.profile.tag,
              to: entity.profile.title,
              toTag: entity.profile.tag,
              for: reference.trim().charAt( 0 ).toUpperCase() + reference.trim().slice( 1 ),
              senderFee: 0,
              burned: burnR.burnedDelta,
              tt0: newTimeToZeroRecipient,
              credit: amount,
              debit: 0,
              chainBalance: newRecipientBalance,
              amount: amount,
              txType: 'in',
              title: sender.profile.title + ' ' + sender.profile.tag,
              fromAddress: 'address unaval',
              toAddress: 'address unaval'
            } } },
            ( err ) => {
              if ( err ) { console.log( err ); return handleMongoDBerror( 'Push Recipient-Tx to Database', err ) }
              resolve( 'c resolved' );
            } // close callback
          ); // close findOneAndUpdate
        } ); // close Promise c

        const d = new Promise( resolve => { // write to sender tx history (!!!)
          TxDB.findOneAndUpdate(
            { fullId: sender.fullId },
            { $push: { txHistory: {
              date: date,
              initiator: txRoleEntities[2].profile.title,
              initiatorTag: txRoleEntities[2].profile.tag,
              from: sender.profile.title,
              fromTag: sender.profile.tag,
              to: entity.profile.title,
              toTag: entity.profile.tag,
              for: reference.trim().charAt( 0 ).toUpperCase() + reference.trim().slice( 1 ),
              senderFee: txFee,
              burned: processedRecipients === 1 ? burnS.burnedDelta : 0, // only first time
              tt0: burnS.remainingTimeToZero,
              credit: 0,
              debit: amount,
              chainBalance: burnS.burnedBalance - ( processedRecipients * ( amount + txFee ) ), // reduces with each processed recipient
              amount: amount,
              txType: 'out',
              title: entity.profile.title + ' ' + entity.profile.tag,
              fromAddress: 'address unaval',
              toAddress: 'address unaval'
            } } },
            ( err ) => {
              if ( err ) { return handleMongoDBerror( 'Push Sender-Tx to Database', err ) }
              resolve( 'd resolved' );
            } // close callback
          ); // close findOneAndUpdate
        } ); // close Promise d

        return Promise.all( [a, b, c, d] );

      }; // close updateRecipient function

      await updateRecipient();

    }
    else if ( entity.roleInTx === 'community' ) {

      if ( sender.profile.title != systemInit.communityGovernance.commName ) { // exclude funds sent from community account
        const updateCommunity = function() {
          return new Promise( resolve => {  // update community stats
            EntityDB.findOneAndUpdate(
              { fullId: entity.fullId },
              {
                $inc: { 'stats.allTimeVolume': amount, }
              },
              {
                new: true,
              },
              ( err ) => {
                if ( err ) {return handleMongoDBerror( 'Update Community Stats in Database', err )}
                resolve( 'comm stats resolved' );
              } // close callback
            ); // close findOneAndUpdate
          } ); // close Promise
        };

        await updateCommunity();

      } // close if

    }
    else if ( entity.roleInTx === 'taxpool' ) {

      // updating the tax account once... alternatively could be updated with each recipient

      const taxAmount = Math.ceil( ( amount * setTxFee ) * systemInit.taxPool.commTax ) * numberOfRecipients;
      const txString = numberOfRecipients > 1 ? i18n.strNfTx171 : i18n.strNfTx170;
      const numberOfTx = numberOfRecipients + ' ' + txString;
      const burnT = getBurned( entity, timeSecondsUNIX );
      const newTaxBalance = burnT.burnedBalance + taxAmount;
      const burnedTaxDelta = burnT.burnedDelta;
      const newTimeToZeroTax = Math.ceil( burnT.remainingTimeToZero * ( burnT.burnedBalance / newTaxBalance ) + baseTimeToZero * ( taxAmount / newTaxBalance ) );

      const updateTaxPool = function() {
        const a = new Promise( resolve => {  // update tax onChain and stats
          EntityDB.findOneAndUpdate(
            { fullId: entity.fullId },
            {
              $set: { 'onChain.balance': newTaxBalance,
                'onChain.lastMove': timeSecondsUNIX,
                'onChain.timeToZero': newTimeToZeroTax,
              },
              $inc: { 'stats.receiveVolume': taxAmount,
              }
            },
            {
              new: true,
            },
            ( err ) => {
              if ( err ) {return handleMongoDBerror( 'Update Tax Pool in Database', err )}
              resolve( 'tax pool updated' );
            } // close callback
          ); // close findOneAndUpdate
        } ); // close Promise a

        const b = new Promise( resolve => {  // write to tax tx history
          TxDB.findOneAndUpdate(
            { fullId: entity.fullId },
            { $push: { txHistory: {
              date: date,
              initiator: txRoleEntities[2].profile.title,
              initiatorTag: txRoleEntities[2].profile.tag,
              from: sender.profile.title,
              fromTag: sender.profile.tag,
              to: entity.profile.title, // will always just be tax pool name here
              toTag: entity.profile.tag, // will always just be tax pool tag here
              for: numberOfTx, // actual reference omitted here and replaced with numberOfRecipients
              senderFee: 0,
              burned: burnedTaxDelta,
              tt0: newTimeToZeroTax,
              credit: taxAmount,
              debit: 0,
              chainBalance: newTaxBalance,
              amount: taxAmount,
              txType: 'in',
              title: sender.profile.title + ' ' + sender.profile.tag,
              fromAddress: 'address unaval',
              toAddress: 'address unaval'
            } } },
            ( err ) => {
              if ( err ) { return handleMongoDBerror( 'Push Recipient-Tx to Database', err ) }
              resolve( 'b resolved' );
            } // close callback
          ); // close findOneAndUpdate
        } ); // close Promise c

        return Promise.all( [a, b] );

      };

      await updateTaxPool();

    }

  } // close loop over txRoleEntities

};
