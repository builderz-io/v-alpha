const ChatComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for Chat Plugin
   *
   */

  'use strict';

  function message( msg ) {
    const width = msg.msg.length > 70 ? '300px' : msg.msg.length < 30 ? '220px' : '245px';
    const background = msg.sender == 'Me' ? msg.msg.match( 'You\'ve sent' ) ? '#c0d6b9' : '#e0e7eb' : '#f7f7f8';
    const style = msg.sender == 'Me' ? { 'margin-left': 'auto', 'width': width } : { 'margin-right': 'auto', 'width': width };
    return V.castNode( {
      tag: 'li',
      classes: 'w-screen pxy',
      y: style,
      html: '<message style="background:' + background + '" class="message__container flex card-shadow rounded bkg-white pxy">' +
                  '<div class="font-medium pxy">' +
                    ( msg.sender == 'Me' ? '' : '<p>' + msg.sender + '</p>' ) +
                    '<p>' + msg.msg + '</p>' +
                  '</div>' +
              '</message>'
    } );
  }

  return {
    message: message,
  };

} )();
