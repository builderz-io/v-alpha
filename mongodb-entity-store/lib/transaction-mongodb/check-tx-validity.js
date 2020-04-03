const systemInit = require( '../../systemInit' );
const i18n = require( '../../lang/' + systemInit.language );

const checkSenderBalance = require( './check-sender-balance' ).checkSenderBalance;

const requestLimit = systemInit.poolGovernance.maxRequest;
const setTxFee = systemInit.tokenDyn.setTxFee;

module.exports.checkTxValidity = ( txRoleEntities, amount, timeSecondsUNIX, reference, txType ) => {

  const senders = txRoleEntities.filter( obj => {return obj.roleInTx === 'sender' } );
  const recipients = txRoleEntities.filter( obj => {return obj.roleInTx === 'recipient' } );
  const deactiveRecipient = recipients.filter( obj => {return obj.credentials.status != 'active' } );
  var sufficientBalance = true;
  // var lastRequestDate;

  if ( senders.length > 0 && recipients.length > 0 ) {
    sufficientBalance = checkSenderBalance( txRoleEntities, amount, timeSecondsUNIX, setTxFee );

    // // TODO:
    // if (txType == i18n.str50020 && recipients[0].requestStats.lastDate === undefined) {
    //    lastRequestDate = moment(recipients[0].requestStats.lastDate).subtract(2, 'days');
    // } else {
    //   // lastRequestDate = moment(srArray[1].requestStats.lastDate);
    // }
  }

  return senders.length === 0 ? i18n.strErTx175 : // 'No valid sender to initiate transfer'
    senders.length > 1 ? 'Only one sender allowed' :
      recipients.length < 1 ? i18n.strErTx130 : // 'No recipients entered'
      // TODO: sending to self >>> txType != i18n.str50020 && recipients.indexOf(senders[0]) != -1 ? errorTx(i18n.strErTx140 + ' <span class="currency-unit">' + i18n.str60010 + '</span> ' + i18n.strErTx141) :
        systemInit.communityGovernance.limitTransactions === true && senders[0].credentials.role == 'network' && recipients.find( recipient => {return recipient.credentials.role != 'network'} ) ? i18n.strErTx125 : // 'For security references you can only transact with unverified members...'
          senders[0].credentials.status != 'active' ? senders[0].credentials.name + ' ' + senders[0].credentials.tag + ' ' + i18n.strErTx180 : // '... account deactivated'
            deactiveRecipient[0] ? deactiveRecipient[0].credentials.name + ' ' + deactiveRecipient[0].credentials.tag + ' ' + i18n.strErTx180 : // '... account deactivated'
            // TODO: fillUntil
            // TODO: all expiry date rules
              ( txType == i18n.str50020 || txType == i18n.str50030 ) && reference.length < 11 ? i18n.strErTx240 : // 'You must provide a more detailed reference...'
                txType == i18n.str50020 && ['pool', 'contribution'].indexOf( senders[0].credentials.role ) == -1 ? i18n.strErTx170 + ' ' + senders[0].credentials.name + ' ' + senders[0].credentials.tag : // 'You cannot request from ...'
                  txType == i18n.str50020 && amount > requestLimit ? i18n.strErTx160 + ' ' + requestLimit + ' ' + i18n.strErTx163 : // 'Request limit of ... exceeded'
                    txType == i18n.str50030 && ( senders[0].properties.creator != txRoleEntities[2].credentials.name || senders[0].properties.creatorTag != txRoleEntities[2].credentials.tag ) ? i18n.strErTx250 : // 'You must be the account-creator to transfer'
                      amount <= 0 ? i18n.strErTx110 : // 'Invalid amount'
                        sufficientBalance === false ? i18n.strErTx230 + ' ' + amount * recipients.length + ' <span class="currency-unit">' + i18n.str60010 + '</span>. ' + i18n.strErTx220 + ' ' + Math.ceil( amount * recipients.length * ( 1 + setTxFee ) - senders[0].onChain.balance ) + ' <span class="currency-unit">' + i18n.str60010 + '</span> ' + i18n.strErTx223 :

                          true;

};
