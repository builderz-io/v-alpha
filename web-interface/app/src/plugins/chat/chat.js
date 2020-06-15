const Chat = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Plugin driving the chat
   *
   */

  'use strict';

  function handleInputFocus() {
    const $response = V.getNode( '.messageform__response' );
    $response.innerHTML = '';
  }

  function handleInputTyping() {
    if ( V.getState( 'active' ).navItem == '/chat/everyone' ) {
      if ( V.getState( 'activeEntity' ) ) {
        window.socket.emit( 'user is typing', V.getState( 'activeEntity' ).fullId.split( ' ' )[0] );
      }
    }
  }

  function handleSetMessageBot() {
    const $form = V.getNode( '.messageform__input' );
    const $response = V.getNode( '.messageform__response' );

    const message = $form.value;

    V.setMessageBot( message ).then( res => {
      if ( res.success ) {
        if ( res.endpoint == 'transaction' ) {
          V.setState( 'active', { transaction: res } );
          Modal.draw( 'confirm transaction' );
        }
        else {
          $form.value = '';
        }
      }
      else {
        $response.append( V.sN( {
          t: 'div',
          c: 'messageform__respinner',
          s: {
            messageform__respinner: {
              color: 'red',
              background: 'white',
              padding: '2px 8px'
            }
          },
          h: res.status
        } ) );
      }
    } );
  }

  /* ================== private methods ================= */

  async function presenter( which ) {

    const activeEntity = V.getState( 'activeEntity' );
    const messages = await V.getMessage();

    if( !messages.success || !messages.data[0].length ) {
      return {
        success: false,
        status: 'no messages found',
        data: [{
          which: which,
          messages: [],
          activeEntity: activeEntity || undefined,
        }]
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
          activeEntity: activeEntity || undefined,
        }]
      };
    }
  }

  function view( viewData ) {

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

    // Navigation.draw( viewData.data[0].which );
    Page.draw( {
      topcontent: $topcontent,
      listings: $list,
      // position: 'top',
      scroll: 'bottom'
    } );
    Chat.drawMessageForm();
  }

  function preview( path ) {
    Navigation.draw( path );

    Page.draw( {
      position: 'top',
      // scroll: 'bottom'
    } );
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

    V.setNavItem( 'serviceNav', [
      {
        title: 'Chat',
        path: '/chat/everyone',
        draw: function() {
          Chat.draw( '/chat/everyone' );
        }
      }
    ] );

    if ( V.getSetting( 'chatLedger' ) == 'MongoDB' ) {
      window.socket.on( 'community message', drawMessage );
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

    // $input.addEventListener( 'focus', function( e ) {
    //   e.target.placeholder = placeholder;
    // } );
    $send.addEventListener( 'click', handleSetMessageBot );
    $input.addEventListener( 'focus', handleInputFocus );
    // $input.addEventListener( 'input', handleInputTyping );

    V.setState( 'active', { lastViewed: undefined } );

    V.setNode( $form, [ $response, $input, $send ] );
    V.setNode( 'body', $form );

  }

  function draw( which ) {
    preview( which );
    presenter( which ).then( viewData => { view( viewData ) } );
  }

  return {
    drawMessageForm: drawMessageForm,
    draw: draw,
    launch: launch
  };

} )();
