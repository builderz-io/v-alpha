const Chat = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the chat
   *
   */

  'use strict';

  let rerun;

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      chat: 'Chat',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== event handlers ================== */

  function handleInputFocus() {
    const $response = V.getNode( '.messageform__response' );
    $response.textContent = '';
  }

  function handleSetMessageBot( e, rerunMessage ) {
    const $form = V.getNode( '.messageform__input' ) || V.getNode( '.magic-btn__input' );
    const $response = V.getNode( '.messageform__response' );

    $form.style.height = '37px';

    const message = !rerunMessage
      ? $form.value
      : rerunMessage + ' ' + V.getString( 'to' ) + ' ' + V.getState( 'active' ).lastViewed;

    V.setMessageBot( message ).then( res => {
      V.sN( $response, '' );
      V.setState( 'active', { autofillUuidE: undefined } );
      if (
        res.success
        || ( res.data && res.data.setHighlight && res.data.setHighlight.a )
      ) {
        rerun = false;
        if ( res.endpoint == 'transaction' ) {
          V.setState( 'active', { transaction: res } );
          Modal.draw( 'confirm transaction' );
        }
        else {
          $form.value = '';
        }
      }
      else if (
        res.endpoint == 'transaction'
        && res.error == 'invalid recipient'
        && !rerun
        && V.getState( 'active' ).navItem.includes( 'profile' )
      ) {
        rerun = true;
        handleSetMessageBot( undefined, message ); // rerun with active profile
      }
      else {
        rerun = false;
        $response.append( V.cN( {
          c: 'messageform__res-inner pill-shadow',
          y: {
            'color': 'red',
            'background': 'white',
            'padding': '4px 12px',
            'border-radius': '20px',
          },
          h: res.status || res.errors[0].message,
        } ) );
      }
    } );
  }

  /* ================== private methods ================= */

  async function presenter( path ) {
    let messages;
    if ( V.getSetting( 'chatLedger' ) == 'Firebase' ) {
      messages = { success: false };
    }
    else {
      messages = await V.getMessage();
    }

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
    const $list = CanvasComponents.list();

    let previousSender;

    if ( viewData.success ) {
      viewData.data[0].messages.forEach( cardData => {

        previousSender == cardData.sender
          ? cardData.hideSender = true
          : null;

        previousSender = cardData.sender;

        if ( viewData.data[0].aE ) {
          viewData.data[0].aE.fullId == cardData.sender
            ? cardData.sender = 'Me'
            : null;
        }

        const $card = ChatComponents.message( cardData );
        V.setNode( $list, $card );
      } );
    }
    else if ( V.getSetting( 'chatLedger' ) == 'Firebase' ) {
      V.setNode( 'listings', $list );
      NetworkMainRoom.once( 'child_added', childAdded );
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
    Chat.drawMessageForm( 'no-prefill' );
  }

  function preview( path ) {
    Navigation.draw( path );

    Page.draw( {
      position: 'top',
    } );
  }

  function childAdded( snap ) {
    const res = snap.val();
    drawMessage( {
      time: res.a,
      uuidE: res.i,
      sender: res.j,
      msg: res.m,
    } );
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
        title: ui.chat,
        path: '/chat/everyone',
        draw: function() {
          Chat.draw( '/chat/everyone' );
        },
      },
    ] );

    if ( V.getSetting( 'chatLedger' ) == 'MongoDB' ) {
      window.socket.on( 'community message', drawMessage );

      window.socket.on( 'a user is typing', drawUserIsTyping );

      return;
    }

    if ( V.getSetting( 'chatLedger' ) == 'Firebase' ) {
      NetworkMainRoom.on( 'child_added',   function childAddedLive( snap ) {
        childAdded( snap );
      } );
    }

  }

  function drawMessageForm( options ) {

    V.setNode( '.messageform', 'clear' );
    if ( options == 'clear' ) { return }

    const prefill = options == 'no-prefill' ? '' : V.getState( 'active' ).lastViewed;

    const $form = ChatComponents.messageForm();
    const $input = ChatComponents.messageInput( prefill );
    const $response = ChatComponents.messageResponse();

    const $send = ChatComponents.messageSend();

    $send.addEventListener( 'click', handleSetMessageBot );
    $input.addEventListener( 'focus', handleInputFocus );

    V.setNode( $form, [ $response, $input, $send ] );
    V.setNode( 'page', $form );

  }

  function draw( path ) {
    preview( path );
    presenter( path ).then( viewData => { view( viewData ) } );
  }

  V.setState( 'availablePlugins', { chat: launch } );

  /* ====================== export ====================== */

  return {
    launch: launch,
    draw: draw,
    drawMessageForm: drawMessageForm,
    handleSetMessageBot: handleSetMessageBot,
  };

} )();
