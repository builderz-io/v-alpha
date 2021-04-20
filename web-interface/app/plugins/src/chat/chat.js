const Chat = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the chat
   *
   */

  'use strict';

  /* ================== event handlers ================== */

  function handleInputFocus() {
    const $response = V.getNode( '.messageform__response' );
    $response.textContent = '';
  }

  function handleSetMessageBot() {
    const $form = V.getNode( '.messageform__input' );
    const $response = V.getNode( '.messageform__response' );

    const message = $form.value;

    V.setMessageBot( message ).then( res => {
      if ( res.success ) {
        V.sN( $response, '' );
        if ( res.endpoint == 'transaction' ) {
          V.setState( 'active', { transaction: res } );
          Modal.draw( 'confirm transaction' );
        }
        else {
          $form.value = '';
        }
      }
      else {
        V.sN( $response, '' );
        $response.append( V.sN( {
          t: 'div',
          c: 'messageform__respinner',
          s: {
            messageform__respinner: {
              color: 'red',
              background: 'white',
              padding: '2px 8px',
            },
          },
          h: res.status,
        } ) );
      }
    } );
  }

  /* ================== private methods ================= */

  async function presenter( path ) {

    const messages = await V.getMessage();

    if( !messages.success || !messages.data[0].length ) {
      return {
        success: false,
        status: 'no messages found',
        data: [{
          messages: [],
          aE: V.aE() || undefined,
        }],
      };
    }
    else if ( !V.aE() && path != '/chat/everyone' ) {
      return {
        success: false,
        status: 'not logged in',
        data: [],
      };
    }
    else {
      return {
        success: true,
        status: 'ok',
        data: [{
          messages: messages.data[0],
          aE: V.aE() || undefined,
        }],
      };
    }
  }

  function view( viewData ) {

    const $topcontent = ChatComponents.topcontent();
    const $list = CanvasComponents.list( 'narrow' );

    let previousSender;

    if ( viewData.success ) {
      viewData.data[0].messages.forEach( cardData => {

        previousSender == cardData.sender ?
          cardData.hideSender = true : null;

        previousSender = cardData.sender;

        if ( viewData.data[0].aE ) {
          viewData.data[0].aE.fullId == cardData.sender ?
            cardData.sender = 'Me' : null;
        }

        const $card = ChatComponents.message( cardData );
        V.setNode( $list, $card );
      } );
    }
    else if ( V.getSetting( 'chatLedger' ) == 'Firebase' ) {
      V.setNode( 'listings', $list );
      NetworkMainRoom.on( 'child_added', function( snap ) {
        const res = snap.val();
        drawMessage( {
          time: res.a,
          uuidE: res.i,
          sender: res.j,
          msg: res.m,
        } );
      } );
    }
    else {
      V.setNode( $topcontent, CanvasComponents.notFound( 'message' ) );
    }

    Page.draw( {
      topcontent: $topcontent,
      listings: $list,
      position: 'top', // set again to trigger scroll
      scroll: 'bottom',
    } );
    Chat.drawMessageForm();
  }

  function preview( path ) {
    Navigation.draw( path );

    Page.draw( {
      position: 'top',
    } );

    VMap.draw();
  }

  function drawMessage( cardData ) {
    if ( V.getState( 'active' ).navItem == '/chat/everyone' ) {
      const $list = V.getNode( 'list' );
      V.aE() && V.aE().fullId == cardData.sender ? cardData.sender = 'Me' : null;
      const $messageCard = ChatComponents.message( cardData );
      V.setNode( $list, $messageCard );
      $list.scrollTop = $list.scrollHeight + 75;
    }
  }

  function drawUserIsTyping( user ) {

    const t1 = V.getNode( '#typing_on_1' );
    if ( !t1 ) { return }
    const t2 = V.getNode( '#typing_on_2' );

    const a = t1.textContent.split( ' ' )[0];

    if ( user === false ) {
      resetTyping1();
      resetTyping2();
    }
    else if ( !a ) {
      t1.textContent = user + ' is typing ...';
      setTimeout( resetTyping1, 4000 );
      resetTyping2();
    }
    else if ( user == a ) {
      t1.textContent = user + ' is typing ...';
      setTimeout( resetTyping1, 4000 );
    }
    else {
      t2.textContent = user + ' is typing ...';
      setTimeout( resetTyping2, 4000 );
    }

    function resetTyping1() {
      t1.textContent = '';
    }

    function resetTyping2() {
      t2.textContent = '';
    }

  }

  /* ================== public methods ================== */

  function launch() {

    V.setNavItem( 'serviceNav', [
      {
        title: 'Chat',
        path: '/chat/everyone',
        draw: function() {
          Chat.draw( '/chat/everyone' );
        },
      },
    ] );

    if ( V.getSetting( 'chatLedger' ) == 'MongoDB' ) {
      window.socket.on( 'community message', drawMessage );

      window.socket.on( 'a user is typing', drawUserIsTyping );
    }

  }

  function drawMessageForm( options ) {
    V.setNode( '.messageform', 'clear' );
    if ( options == 'clear' ) { return }

    const prefill = V.getState( 'active' ).lastViewed;

    const $form = ChatComponents.messageForm();
    const $input = ChatComponents.messageInput( prefill );
    const $response = ChatComponents.messageResponse();

    const $send = InteractionComponents.sendBtn();

    $send.addEventListener( 'click', handleSetMessageBot );
    $input.addEventListener( 'focus', handleInputFocus );

    V.setNode( $form, [ $response, $input, $send ] );
    V.setNode( 'page', $form );

  }

  function draw( path ) {
    preview( path );
    presenter( path ).then( viewData => { view( viewData ) } );
  }

  /* ====================== export ====================== */

  return {
    launch: launch,
    drawMessageForm: drawMessageForm,
    draw: draw,
  };

} )();
