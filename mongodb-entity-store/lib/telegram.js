const systemInit = require( '../systemInit' );

const Telegram = require( 'node-telegram-bot-api' );

const telegramBot = new Telegram( systemInit.communityGovernance.teleToken, { polling: true } );

module.exports.adminNotify = ( data ) => {
  telegramBot.sendMessage( systemInit.communityGovernance.teleAdminNofityChat, data.msg + ' ' + data.network, { parse_mode: 'Markdown' } );
};
