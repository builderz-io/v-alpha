const Chat = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the chat
  *
  *
  */

  'use strict';

  const DOM = {};

  /* ================== private methods ================= */

  async function presenter( which ) {

    const $topcontent = ChatComponents.topcontent();
    const $list = CanvasComponents.list( 'narrow' );

    const activeEntity = V.getState( 'activeEntity' );
    const messages = await V.getMessage();

    if( !messages.success || !messages.data[0].length ) {
      return {
        topcontent: CanvasComponents.notFound( 'messages' ),
      };
    }

    messages.data[0].forEach( cardData => {
      activeEntity && activeEntity.fullId == cardData.sender ? cardData.sender = 'Me' : null;
      const $card = ChatComponents.message( cardData );
      V.setNode( $list, $card );
    } );

    // const $lastCard = ChatComponents.message( { sender: 'Me', msg: 'You\'ve sent 560 V to Sheela Anand #3565' } );
    // V.setNode( $list, $lastCard );

    const pageData = {
      topcontent: $topcontent,
      listings: $list,
      position: 'top',
      scroll: 'bottom'
    };

    return pageData;
  }

  function view( pageData ) {
    Page.draw( pageData );
    Chat.drawMessageForm();
  }

  function drawMessage( cardData ) {
    const $list = V.getNode( 'list' );
    const activeEntity = V.getState( 'activeEntity' );
    activeEntity && activeEntity.fullId == cardData.sender ? cardData.sender = 'Me' : null;
    const $messageCard = ChatComponents.message( cardData );
    V.setNode( $list, $messageCard );
    $list.scrollTop = $list.scrollHeight + 75;
  }

  /* ============ public methods and exports ============ */

  function launch() {

    V.setNavItem( 'entityNav', [
      // c = count  d = display Name  l = latest position (menu index)   s = short name   o = online
      {
        cid: '2001',
        c: 0,
        l: -1,
        f: 'Chat',
        title: 'Chat',
        // role: 'community',
        // draw: function() { Chat.draw() },
        o: true,
      },
      {
        cid: '2002',
        c: 0,
        l: -1,
        f: 'Vivi Bot',
        title: 'Vivi Bot',
        // role: 'bot',
        // draw: function() { Chat.draw() },
        o: true,
      },
      {
        cid: '3001',
        c: 0,
        l: -1,
        f: 'Sheela Anand',
        title: 'SA',
        // role: 'user',
        // draw: function() { Chat.draw() },
        o: true,
      },
      {
        cid: '3002',
        c: 0,
        l: -1,
        f: 'Bertrand Arnaud',
        title: 'BJ',
        // draw: function() { Chat.draw() },
        o: true,
      },
      {
        cid: '3003',
        c: 0,
        l: -1,
        f: 'Marc Woods',
        title: 'MG',
        // role: 'user',
        // draw: function() { Chat.draw() },
        o: false,
      },
      {
        cid: '3004',
        c: 0,
        l: -1,
        f: 'Missy Z',
        title: 'MZ',
        // role: 'user',
        // draw: function() { Chat.draw() },
        o: true,
      }
    ] );

    if ( V.getSetting( 'chatLedger' ) == 'MongoDB' ) {
      window.socket.on( 'community message', drawMessage );
    }

  }

  function drawMessageForm( options ) {
    if ( options == 'clear' ) {
      return V.setNode( '.messageform', 'clear' );
    }
    const $form = ChatComponents.messageForm();
    const $input = ChatComponents.messageInput();

    const $send = InteractionComponents.sendBtn();

    // $input.addEventListener( 'focus', function( e ) {
    //   e.target.placeholder = placeholder;
    // } );
    $send.addEventListener( 'click', function() {
      DOM.$form = V.getNode( '.messageform__input' );

      const message = DOM.$form.value;

      V.setMessageBot( message ).then( res => {
        if ( res.success ) {
          res.status == 'transaction successful' ? Account.drawHeaderBalance() : null;
          DOM.$form.value = '';
          // DOM.$form.setAttribute( 'placeholder', V.i18n( res.status, 'placeholder' ) );
          // console.log( res.status );
        }
        else {
          DOM.$form.value = '';
          DOM.$form.setAttribute( 'placeholder', V.i18n( res.status, 'placeholder' ) );
          console.error( 'try again, because: ', res.status );
        }
      } );
    } );

    V.setNode( $form, [ $input, $send ] );
    V.setNode( 'body', $form );

  }

  function draw( which ) {
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  return {
    drawMessageForm: drawMessageForm,
    draw: draw,
    launch: launch
  };

} )();
