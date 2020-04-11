const ChatComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for Marketplace Plugin
   *
   */

  'use strict';

  function chatSmallCard( variable, accountData ) {
    return V.castNode( {
      tag: 'li',
      setStyle: {
        'circle-2': {
          width: '3.5rem',
          height: '3.5rem'
        }
      },
      classes: 'pxy',
      html: '<div class="smallcard__container font-medium pxy">' +
              '<p class="font-medium pb-xs">' + variable + '</p>' +
              '<div class="flex justify-center items-center circle-2 rounded-full border-blackalpha font-medium no-txt-select">' +
                accountData[variable] +
              '</div>' +
            '</div>'
    } );
  }

  function message( msg ) {
    const width = msg.msg.length > 70 ? '300px' : msg.msg.length < 30 ? '220px' : '245px';
    const background = msg.sender == 'Me' ? msg.msg.match( 'You\'ve sent' ) ? '#c0d6b9' : '#e0e7eb' : '#f7f7f8';
    const style = msg.sender == 'Me' ? { 'margin-left': 'auto', 'width': width } : { width: width };
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

  function topSliderUl() {
    return V.castNode( {
      tag: 'ul',
      classes: 'flex overflow-x-scroll'
    } );
  }
  function listingsUl() {
    return V.castNode( {
      tag: 'ul',
      id: 'chat',
      classes: 'listings__ul flex flex-wrap content-start overflow-y-scroll',
      setStyle: {
        listings__ul: {
          height: '530px'
        }
      },
    } );
  }

  return {
    chatSmallCard: chatSmallCard,
    message: message,
    topSliderUl: topSliderUl,
    listingsUl: listingsUl
  };

} )();
