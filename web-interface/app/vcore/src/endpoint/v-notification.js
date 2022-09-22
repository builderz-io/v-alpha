const VNotification = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage Email and Telegram notifications
   *
   */

  'use strict';

  const settings = {
    emailEndpoint: V.getSetting( 'emailEndpoint' ),
    telegramEndpoint: V.getSetting( 'telegramEndpoint' ),
  };

  /* ================== private methods ================= */

  function castNotificationData( data ) {
    return Object.assign( data, {
      action: data.action || data.act,
      network: window.location.hostname || 'Testnet',
      recipient: data.recipient
        || V.getSetting( 'networkAdminEmail' )
        || V.getSensitiveData( 'viAdmin' ) + '@' + 'gmail.com',
    } );
  }

  /* ================== public methods ================== */

  function setEmailNotification( data ) {
    return V.setData( castNotificationData( data ), settings.emailEndpoint, 'api' );
  }

  function setTelegramNotification( data ) {
    return V.setData( castNotificationData( data ), settings.telegramEndpoint, 'api' );

  }

  /* ====================== export ====================== */

  V.setEmailNotification = setEmailNotification;
  V.setTelegramNotification = setTelegramNotification;

  return {
    setEmailNotification: setEmailNotification,
    setTelegramNotification: setTelegramNotification,
  };

} )();
