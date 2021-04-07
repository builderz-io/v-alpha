const ChatComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Chat Plugin
   *
   */

  'use strict';

  let autoCompleteActive = false;
  let stringToComplete = false;
  let permanentString = '';
  let dbEntries, sc, sel;

  document.addEventListener( 'click', function( e ) {
    revertAutoComplete( e.target );
  } );

  V.setStyle( {
    'chat-link a': {
      color: 'rgba(var(--link), 1)',
    },
    'messageform': {
      'bottom': '0',
      'border-top': '1px solid #e8e8ec',
      // 'background': '#d1d2da',
      'background': 'rgba(var(--brandPrimary),1)',
      'padding': '8px 5px',
      'border-radius': '3px 3px 0 0',
    },
    'messageform__input': {
      'height': '37px',
      'padding': '10px 15px',
      'width': '87%',
      // 'border': '1px solid #e8e8ec',
      'resize': 'none',
      'border-radius': '30px',
    },
    'messageform__response': {
      position: 'absolute',
      top: '-24px',
      // color: 'red',
      // background: 'white',
      // padding: '2px 8px'
    },
    'ac-suggestions': {
      'text-align': 'left',
      'cursor': 'default',

      /* border: 1px solid rgba(0,0,0,.1), */
      /* display: block, */
      /* z-index: 300, */
      'max-height': '254px',
      'overflow': 'hidden',
      'overflow-y': 'auto',

      /* box-sizing: border-box, */
      'border-radius': '6px',
      'padding': '9px 4px',
      'font-size': '0.9em',
    },
    'ac-suggestion': {
      'position': 'relative',
      'padding': '0 .6em',
      'line-height': '23px',
      'white-space': 'nowrap',
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'font-size': '1.02em',
      'color': '#333',
    },
    'ac-suggestion.selected': {

      /* background: #f0f0f0, */
      'color': 'rgba(var(--brandPrimary), 1)',
      'font-size': '1.05em',
      'font-family': 'IBM Plex Bold',
    },
  } );

  /* ============== user interface strings ============== */

  const ui = {
    notFound: 'not found',
    chatTitle: 'Chat with Everyone',
    placeholder: 'Send message or funds',
    placeholder2: 'Join first to send a message or funds',
  };

  function getString( string, scope ) {
    return V.i18n( string, 'chat', scope || 'chat components' );
  }

  /* ================== event handlers ================== */

  function handleTextareaInput() {
    // console.log( this.getBoundingClientRect().width / 9 );
    // console.log( this.value.length );
    this.style.height = '0px';
    this.style.height = ( this.scrollHeight ) + 'px';
  }

  function handleKeyUp( e ) {
    const key = window.event ? e.keyCode : e.which;
    // enter (to search)
    if ( key == 13 && V.i18n( 'search', 'trigger' ) == permanentString.split( ' ' )[0] ) {
      if ( sc.childElementCount == 1 ) {
        this.value = permanentString.split( ' ' )[0] + ' ' + sc.querySelector( '.ac-suggestion' ).getAttribute( 'data-val' );
        document.getElementById( 'send-message' ).click();
      }
      else if ( sel ) {
        this.value = permanentString.split( ' ' )[0] + ' ' + sel.getAttribute( 'data-val' );
        document.getElementById( 'send-message' ).click();
      }
    }
    // enter (to submit form)
    else if ( key == 13 && !autoCompleteActive ) {
      e.preventDefault();
      document.getElementById( 'send-message' ).click();
    }
    // enter, tab or right (to place selection)
    else if ( ( key == 13 || key == 9 || key == 39 ) && autoCompleteActive ) {
      e.preventDefault();
      if ( sc.childElementCount == 1 ) {
        placeSelection( sc.querySelector( '.ac-suggestion' ).getAttribute( 'data-val' ), permanentString, this );
      }
      else if ( sel ) {
        placeSelection( sel.getAttribute( 'data-val' ), permanentString, this );
      }
    }
    // esc
    else if ( key == 27 && autoCompleteActive ) {
      revertAutoComplete();
      e.stopPropagation();
    }
    // backspace
    else if ( key == 8 && stringToComplete.length < 3 ) {
      revertAutoComplete();
    }
    // down (40), up (38)
    // loop through list using keyboard
    else if ( ( key == 40 || key == 38 ) && autoCompleteActive ) {

      let next;

      if ( !sel ) {
        const sgs = sc.querySelectorAll( '.ac-suggestion' );
        next = ( key == 40 ) ? sgs[0] : sgs[sgs.length - 1]; // first : last
        next.classList.add( 'selected' );
        considerSelection( next.getAttribute( 'data-val' ), permanentString, this );
      }
      else {
        next = ( key == 40 ) ? sel.nextSibling : sel.previousSibling;
        if ( next ) {
          sel.classList.remove( 'selected' );
          next.classList.add( 'selected' );
          considerSelection( next.getAttribute( 'data-val' ), permanentString, this );
        }
        else {
          sel.classList.remove( 'selected' );
          this.value = permanentString + ' ';
          next = 0;
        }
      }
    }
    // all other keys
    else {
      const autofillParts = V.checkForTriggers( this.value );

      if ( autofillParts ) {

        const strings = autofillParts.filter( item => isNaN( item.toLowerCase() ) ); // remove amounts
        strings.shift(); // remove command

        const lastTagIndex = ( function() {
          var i = autofillParts.length;
          while( i-- ) {
            if ( autofillParts[i].indexOf( '#' ) != -1 ) {
              return i;
            }
          }
        } )();

        permanentString = ( function() {
          if ( lastTagIndex >= 1 ) {
            return autofillParts.slice( 0, lastTagIndex + 1 ).join( ' ' );
          }
          else {
            return autofillParts.slice( 0, autofillParts.indexOf( strings[0] ) ).join( ' ' );
          }
        } )();

        stringToComplete = ( function() {
          if ( lastTagIndex >= 1 ) {
            return autofillParts.slice( lastTagIndex + 1 ).filter( item => isNaN( item ) ).join( ' ' );
          }
          else {
            return strings.join( ' ' );
          }
        } )().toLowerCase();

      } // close if autofillParts

      if ( stringToComplete && !autoCompleteActive ) {

        // TODO: could do with a better implementation of ignoring the "for" trigger-word

        if ( stringToComplete.length == 2 && stringToComplete != V.i18n( 'for', 'trigger' ) ) {

          V.getQuery( { query: stringToComplete, role: 'all' } ).then( res => {
            dbEntries = res.data;
            if ( res.success ) {
              setFirstSuggestions( dbEntries, stringToComplete, permanentString, this );
            }
          } );

          // socket.emit( 'get all entities', [stringToComplete, $( '#header-svg' ).attr( 'fullid' )], function( callback ) {
          //   dbEntries = callback.sort();
          //   setFirstSuggestions( dbEntries, stringToComplete, permanentString );
          // } );
        }
        if ( stringToComplete.length == 4 && stringToComplete.substr( 0, 2 ) == V.i18n( 'for', 'trigger' ) ) {

          // socket.emit( 'get all entities', stringToComplete, function( callback ) {
          //   dbEntries = callback;
          //   setFirstSuggestions( dbEntries, [stringToComplete, $( '#header-svg' ).attr( 'fullid' )], permanentString );
          // } );
        }
      } // close if stringToComplete

      if ( stringToComplete && autoCompleteActive && !( key == 40 || key == 38 ) ) {
        setNewSuggestions( dbEntries, stringToComplete );
      }

    } // close else of key pressed checking

  }

  function handleKeyDown( e ) {
    sc = V.getNode( '.ac-suggestions' );

    if ( sc ) {
      sel = sc.getNode( '.ac-suggestion.selected' );
    }

    const key = window.event ? e.keyCode : e.which;

    if ( key != 13 ) {
      if ( V.aE() && this.value.substring( 0, 4 ) != 'send' ) {
        window.socket.emit( 'user is typing', V.aE().fullId.split( ' ' )[0] );
      }
    }
    if ( key == 13 ) {
      e.preventDefault();
      window.socket.emit( 'user is typing', false );
    }
    else if ( ( key == 40 || key == 38 ) && autoCompleteActive ) {
      e.preventDefault();
    }
    else if ( key == 9 ) {
      e.preventDefault();
    }
    // backspace
    else if ( key == 8 && stringToComplete.length < 3 ) {
      revertAutoComplete();
    }
    else if ( key > 48 && key < 58 && autoCompleteActive ) {
      // const sc = document.getElementsByClassName( 'ac-suggestions' )[0];
      // const sel = sc.querySelector( '.ac-suggestion.selected' );
      if ( sc.childElementCount == 1 ) {
        placeSelection( sc.querySelector( '.ac-suggestion' ).getAttribute( 'data-val' ), permanentString, this );
      }
      else if ( sel ) {
        placeSelection( sel.getAttribute( 'data-val' ), permanentString, this );
      }
      else {
        revertAutoComplete();
      }
    }

  }

  /* ========= private methods (autocomplete) =========== */

  function setFirstSuggestions( dbEntries, stringToComplete, permanentString, $textarea ) {

    autoCompleteActive = true;

    const sc = castFirstSuggestions( $textarea, dbEntries, stringToComplete ); // suggestions container

    live( 'ac-suggestion', 'mouseout', function() {
      const sel = sc.querySelector( '.ac-suggestion.selected' );
      if ( sel ) { setTimeout( function() { sel.classList.remove( 'selected' ) }, 20 )}
    }, sc );

    live( 'ac-suggestion', 'mouseover', function() {
      const sel = sc.querySelector( '.ac-suggestion.selected' );
      if ( sel ) { sel.classList.remove( 'selected' ) }
      this.classList.add( 'selected' );
      // considerSelection(sc.querySelector('.ac-suggestion.selected').getAttribute('data-val'), permanentString, this);
    }, sc );

    live( 'ac-suggestion', 'mousedown', function() {
      if ( hasAutoCompleteClass( this, 'ac-suggestion' ) ) { // else outside click
        placeSelection( this.getAttribute( 'data-val' ), permanentString, $textarea );
      }
    }, sc );

    V.setNode( 'page', sc );
    // document.body.appendChild( sc );

  }

  function setNewSuggestions( dbEntries, stringToComplete ) {
    V.setNode( '.ac-suggestions', '' );
    let count = 0;
    for ( let i=0; i<dbEntries.length; i++ ) {
      if ( dbEntries[i].fullId.toLowerCase().includes( stringToComplete ) ) {
        V.setNode( '.ac-suggestions', castSuggestion( dbEntries[i], stringToComplete ) );
        count += 1;
      }
    }
    if ( !count ) {
      V.setNode( '.ac-suggestions', notFound( stringToComplete ) );
    }
  }

  function considerSelection( selectedEntity, permanentString, $elem ) {
    if ( selectedEntity === null ) {return}
    const completeString = permanentString  + ' ' + selectedEntity + ' ';
    // $( '#textarea-text' ).attr( 'rows', Math.ceil( completeString.length / Math.floor( $( '#textarea-text' ).width() / 10 ) ).toString() );
    // $( '#textarea-text' ).css( 'border-color', 'rgb(99, 82, 185)' );
    $elem.value = completeString;
  }

  function placeSelection( selectedEntity, permanentString, $elem ) {
    considerSelection( selectedEntity, permanentString, $elem );
    revertAutoComplete();
    window.setTimeout( function() { $elem.focus() }, 10 );
  }

  function revertAutoComplete() {

    autoCompleteActive = false;
    stringToComplete = false;
    permanentString = '';
    dbEntries = [];

    V.setNode( '.ac-suggestions', 'clear' );

  }

  function hasAutoCompleteClass( el, className ) { return el.classList ? el.classList.contains( className ) : new RegExp( '\\b'+ className+'\\b' ).test( el.className ) }

  function addEvent( el, type, handler ) {
    if ( el.attachEvent ) {el.attachEvent( 'on'+type, handler )}
    else {el.addEventListener( type, handler )}
  }

  function live( elClass, event, cb, context ) {
    addEvent( context || document, event, function( e ) {
      var found, el = e.target || e.srcElement;
      while ( el && !( found = hasAutoCompleteClass( el, elClass ) ) ) {el = el.parentElement}
      if ( found ) {cb.call( el, e )}
    } );
  }

  /* ================= private components =============== */

  // autocomplete

  function castFirstSuggestions( $textarea, dbEntries, stringToComplete ) {
    const rect = $textarea.getBoundingClientRect();

    return V.cN( {
      t: 'div',
      c: 'ac-suggestions absolute card-shadow bkg-white',
      y: {
        left: rect.left + 'px',
        bottom: rect.height + 20 + 'px',
        width: rect.width + 'px',
      },
      h: !dbEntries.length ? notFound( stringToComplete ) : V.cN( {
        t: 'div',
        h: dbEntries.map( entry => castSuggestion( entry, stringToComplete ) ),
      } ),
    } );
  }

  function castSuggestion( entity, stringToComplete ) {
    const search = stringToComplete.replace( /[-/\\^$*+?.()|[\]{}]/g, '\\$&' );
    const re = new RegExp( '(' + search.split( ' ' ).join( '|' ) + ')', 'gi' );
    const name = entity.title;
    const tag = entity.tag;

    return V.cN( {
      t: 'div',
      c: 'ac-suggestion',
      a: {
        'data-val': name + ' ' + tag,
      },
      innerHtml: name.replace( re, '<span class="txt-brand-primary font-bold">$1</span>' ) + ' ' + tag,
    } );

  }

  function notFound( stringToComplete ) {
    return V.cN( {
      t: 'div',
      c: 'ac-suggestion',
      h: '"' + stringToComplete + '" ' + getString( ui.notFound ),
    } );
  }

  /* ================  public components ================ */

  function topcontent() {
    return V.cN( {
      t: 'div',
      c: 'w-full',
      h: [
        {
          t: 'h2',
          c: 'font-bold fs-l leading-snug txt-center w-full pxy',
          h: getString( ui.chatTitle, 'chat title' ),
        },
        {
          t: 'span',
          c: 'block h-4 fs-s txt-center',
          i: 'typing_on_1',
        },
        {
          t: 'span',
          c: 'block h-4 fs-s txt-center',
          i: 'typing_on_2',
        },
      ],
    } );
  }

  function message( msg ) {
    let width = msg.msg.length > 70 ? '300px' : msg.msg.length < 30 ? '220px' : '245px';
    const background = msg.sender == 'Me' ? msg.msg.match( 'You\'ve sent' ) ? '#c0d6b9' : '#e0e7eb' : '#f7f7f8';
    const linkedMsg = V.castLinks( msg.msg );
    linkedMsg.iframes.includes( 'iframe' ) ? width = '330px' : null;
    const style = msg.sender == 'Me' ? { 'margin-left': 'auto', 'width': width } : { 'margin-right': 'auto', 'width': width };

    return V.castNode( {
      tag: 'li',
      classes: 'w-screen pxy',
      a: {
        id: msg._id,
      },
      y: style,
      h: {
        t: 'message',
        c: 'message__container flex card-shadow rounded bkg-white pxy',
        y: {
          background: background,
        },
        h: {
          t: 'div',
          c: 'font-medium pxy',
          h: [
            {
              x: msg.sender == 'Me' || msg.hideSender ? false : true,
              t: 'p',
              c: 'cursor-pointer',
              a: {
                onclick: msg.sender == 'Me' || msg.hideSender ? '' : 'Profile.draw(\'' + V.castPathOrId( msg.sender ) + '\')',
              },
              h: msg.sender,
            },
            {
              t: 'p',
              c: 'chat-link',
              h: linkedMsg.iframes,
            },
          ],
        },
      },
    } );
  }

  function messageForm() {
    return V.sN( {
      t: 'div',
      c: 'messageform flex items-center absolute w-full pxy card-shadow',
    } );
  }

  function messageInput( prefill ) {
    return V.sN( {
      t: 'textarea',
      c: 'messageform__input mr-2',
      h: prefill ? 'send ' + prefill + ' 10' : '',
      a: {
        // style: 'height:10px;overflow-y:hidden;',
        placeholder: V.aE() ? getString( ui.placeholder, 'message textarea placeholder' )
          : getString( ui.placeholder2, 'message textarea placeholder' ),
      },
      e: {
        keyup: handleKeyUp,
        keydown: handleKeyDown,
        input: handleTextareaInput,
      },
    } );
  }

  function messageSend() {
    return V.sN( {
      t: 'button',
      c: 'circle-1 flex justify-center items-center rounded-full bkg-white',
      h: V.getIcon( 'send' ),
    } );
  }

  function messageResponse() {
    return V.sN( {
      t: 'div',
      c: 'messageform__response',
      // h: 'test response msg'
    } );
  }

  /* ====================== export ====================== */

  return {
    topcontent: topcontent,
    message: message,
    messageForm: messageForm,
    messageInput: messageInput,
    messageSend: messageSend,
    messageResponse: messageResponse,
  };

} )();
