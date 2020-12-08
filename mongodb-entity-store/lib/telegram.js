const systemInit = require( '../systemInit' );

const Telegram = require( 'node-telegram-bot-api' );

let telegramBot;

if ( systemInit.telegramModule.adminNotifications ) {
  telegramBot = new Telegram( systemInit.communityGovernance.teleToken, { polling: true } );
}

module.exports.adminNotify = ( data ) => {
  if ( telegramBot ) {
    telegramBot.sendMessage( systemInit.communityGovernance.teleAdminNofityChat, data.msg + ' ' + data.network, { parse_mode: 'Markdown' } );
  }
};
