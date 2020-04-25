const Chat = ( function() { // eslint-disable-line no-unused-vars

  /**
  * Module driving the chat
  *
  *
  */

  'use strict';

  /* ================== private methods ================= */

  async function presenter( which ) {

    const activeEntity = V.getState( 'activeEntity' );
    const messages = await V.getMessage();

    if( !messages.success || !messages.data[0].length ) {
      return {
        success: false,
        status: 'no messages found',
        data: []
      };
    }
    else if ( !activeEntity && which != '/chat/everyone' ) {
      return {
        success: false,
        status: 'not logged in',
        data: []
      };
    }
    else {
      return {
        success: true,
        status: 'ok',
        data: [{
          which: which,
          messages: messages.data[0],
          activeEntity: activeEntity ? activeEntity.data[0] : undefined,
        }]
      };
    }
  }

  function view( viewData ) {
    console.log( viewData );
    const $topcontent = ChatComponents.topcontent();
    const $list = CanvasComponents.list( 'narrow' );

    if ( viewData.success ) {
      viewData.data[0].messages.forEach( cardData => {
        viewData.data[0].activeEntity && viewData.data[0].activeEntity.fullId == cardData.sender ? cardData.sender = 'Me' : null;
        const $card = ChatComponents.message( cardData );
        V.setNode( $list, $card );
      } );
    }
    else {
      V.setNode( $topcontent, CanvasComponents.notFound( 'messages' ) );
    }

    // Navigation.animate( viewData.data[0].which );
    Navigation.drawV2( viewData.data[0].which );
    Page.draw( {
      topcontent: $topcontent,
      listings: $list,
      position: 'top',
      scroll: 'bottom'
    } );
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
        // cid: '2001',
        // f: 'Chat',
        title: 'Chat',
        // role: 'community',
        // draw: function() { Chat.draw() },
        // o: false,
        path: '/chat/everyone',
        draw: function() {
          Chat.draw( '/chat/everyone' );
        }
      },
      // {
      //   cid: '2002',
      //   f: 'Vivi Bot',
      //   title: 'Vivi Bot',
      // },
      // {
      //   cid: '3001',
      //   f: 'Sheela Anand',
      //   title: 'SA',
      // },
      // {
      //   cid: '3002',
      //   f: 'Bertrand Arnaud',
      //   title: 'BJ',
      // },
      // {
      //   cid: '3003',
      //   f: 'Marc Woods',
      //   title: 'MG',
      // },
      // {
      //   cid: '3004',
      //   f: 'Missy Z',
      //   title: 'MZ',
      // }
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
      const $form = V.getNode( '.messageform__input' );

      const message = $form.value;

      V.setMessageBot( message ).then( res => {
        if ( res.success ) {
          res.status == 'transaction successful' ? Account.drawHeaderBalance() : null;
          $form.value = '';
          // $form.setAttribute( 'placeholder', V.i18n( res.status, 'placeholder' ) );
          // console.log( res.status );
        }
        else {
          $form.value = '';
          $form.setAttribute( 'placeholder', V.i18n( res.status, 'placeholder' ) );
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
