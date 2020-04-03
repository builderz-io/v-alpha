
module.exports.checkSenderBalance = ( txRoleEntities, amount, timeSecondsUNIX, setTxFee ) => {

  const senders = txRoleEntities.filter( obj => { return obj.roleInTx === 'sender' } );

  const recipients = txRoleEntities.filter( obj => { return obj.roleInTx === 'recipient' } );

  // var txFee = txArray[0] & 1 == 1 ? Math.ceil(txArray[0] * setTxFee) : Math.floor(txArray[0] * setTxFee); // i & 1 == 1 ? checks first bit
  var txFee = Math.ceil( amount * setTxFee );
  var burnedSenderBlocks = timeSecondsUNIX - senders[0].onChain.lastMove;
  var burnedSenderBalance = Math.ceil( senders[0].onChain.balance - ( senders[0].onChain.balance / ( senders[0].onChain.timeToZero / burnedSenderBlocks ) ) );

  var sufficientBalance = burnedSenderBalance - ( ( amount + txFee ) * recipients.length );

  var bottomLimit = 0;

  return sufficientBalance >= bottomLimit ? true : false;

};
