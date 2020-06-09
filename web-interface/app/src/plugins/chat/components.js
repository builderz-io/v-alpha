const ChatComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Chat Plugin
   *
   */

  'use strict';

  document.addEventListener( 'click', function( e ) {
    revertAutoComplete( e.target );
    // document.getElementById( 'textarea-text' ).focus();
    // $( '#confirm-tx' ).remove();
  } );

  V.setStyle( {
    'messageform': {
      'bottom': '0',
      'border-top': '1px solid #e8e8ec',
      'background': '#d1d2da',
      'padding': '8px 5px'
    },
    'messageform__input': {
      'height': '36px',
      'padding': '9px 15px',
      'min-width': '302px',
      'border': '1px solid #e8e8ec',
      'resize': 'none',
      'border-radius': '30px'
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
      'color': 'rgba(var(--brand), 1)',
      'font-size': '1.05em',
    }
  } );

  let autoCompleteActive = false;
  let stringToComplete = false;
  let permanentString = '';
  let dbEntries, sc, sel;

  /* ================== event handlers ================== */

  function handleKeyUp( e ) {
    const key = window.event ? e.keyCode : e.which;
    // const sc = document.getElementsByClassName( 'ac-suggestions' )[0];
    // // let sel;
    //
    // if ( sc ) {
    //   sel = sc.querySelector( '.ac-suggestion.selected' );
    // }

    // enter (to search)
    if ( key == 13 && V.i18n( 'search', 'trigger' ) == permanentString.split( ' ' )[0] ) {
      // const sc = document.getElementsByClassName( 'ac-suggestions' )[0];
      // const sel = sc.querySelector( '.ac-suggestion.selected' );
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
      // const sc = document.getElementsByClassName( 'ac-suggestions' )[0];
      // const sel = sc.querySelector( '.ac-suggestion.selected' );
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
    // esc
    // else if ( key == 27 ) {
    //   $( '#textarea-text' ).val( '' );
    // }
    // backspace
    else if ( key == 8 && stringToComplete.length < 3 ) {
      revertAutoComplete();
    }
    // down (40), up (38)
    else if ( ( key == 40 || key == 38 ) && autoCompleteActive ) {

      // const sc = document.getElementsByClassName( 'ac-suggestions' )[0];
      // const sel = sc.querySelector( '.ac-suggestion.selected' );

      let next;

      if ( !sel ) {
        next = ( key == 40 ) ? sc.querySelector( '.ac-suggestion' ) : sc.childNodes[sc.childNodes.length - 1]; // first : last
        next.className += ' selected';
        considerSelection( next.getAttribute( 'data-val' ), permanentString, this );
      }
      else {
        next = ( key == 40 ) ? sel.nextSibling : sel.previousSibling;
        if ( next ) {
          sel.className = sel.className.replace( 'selected', '' );
          next.className += ' selected';
          considerSelection( next.getAttribute( 'data-val' ), permanentString, this );
        }
        else { sel.className = sel.className.replace( 'selected', '' ); this.value = permanentString + ' '; next = 0 } // loop through list using keyboard
      }
    }
    // all other keys
    else {
      const autofillParts = V.checkForTriggers( this.value );

      if ( autofillParts ) {

        const strings = autofillParts.filter( item => { return isNaN( item.toLowerCase() ) } ); // remove amounts
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
            return autofillParts.slice( lastTagIndex + 1 ).filter( item => { return isNaN( item ) } ).join( ' ' );
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
            renderFirstAutocompleteElement( dbEntries, stringToComplete, permanentString, this );
          } );

          // socket.emit( 'get all entities', [stringToComplete, $( '#header-svg' ).attr( 'fullid' )], function( callback ) {
          //   dbEntries = callback.sort();
          //   renderFirstAutocompleteElement( dbEntries, stringToComplete, permanentString );
          // } );
        }
        if ( stringToComplete.length == 4 && stringToComplete.substr( 0, 2 ) == V.i18n( 'for', 'trigger' ) ) {

          // socket.emit( 'get all entities', stringToComplete, function( callback ) {
          //   dbEntries = callback;
          //   renderFirstAutocompleteElement( dbEntries, [stringToComplete, $( '#header-svg' ).attr( 'fullid' )], permanentString );
          // } );
        }
      } // close if stringToComplete

      if ( stringToComplete && autoCompleteActive && !( key == 40 || key == 38 ) ) {
        renderNewAutocompleteElement( dbEntries, stringToComplete );
      }

    } // close else of key pressed checking

  }

  function handleKeyDown( e ) {
    sc = V.getNode( '.ac-suggestions' );

    if ( sc ) {
      sel = sc.getNode( '.ac-suggestion.selected' );
    }
    else {
      return;
    }

    const key = window.event ? e.keyCode : e.which;

    if ( key != 13 ) {
      if ( this.value.substring( 0, 4 ) != 'send' ) {
        window.socket.emit( 'user is typing', V.getState( 'activeEntity' ).fullId.split( ' ' )[0] );
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

  /* =============== autocomplete methods =============== */

  function renderFirstAutocompleteElement( dbEntries, stringToComplete, permanentString, $elem ) {

    autoCompleteActive = true;

    const rect = $elem.getBoundingClientRect();

    // create suggestions container "sc"
    // const sc = document.createElement( 'div' );
    // sc.className = 'ac-suggestions card-shadow';
    //
    // sc.style.position = 'absolute';
    // sc.style.left = rect.left + 'px'; //  Math.round( rect.left + ( window.pageXOffset || document.documentElement.scrollLeft ) - 40 ) + 'px';
    // sc.style.bottom = rect.height + 20 + 'px';
    // sc.style.width = rect.width + 'px'; // Math.round( rect.right - rect.left + 80 ) + 'px'; // outerWidth
    //
    // let s = '';
    // if ( !dbEntries.length ) { s += '<div class="ac-suggestion">"' + stringToComplete + '" ' + V.i18n( 'not found', 'app' ) }
    // for ( let i=0; i<dbEntries.length; i++ ) { s += renderItem( dbEntries[i], stringToComplete ) }
    // sc.innerHTML = s;

    const sc = V.cN( {
      t: 'div',
      c: 'ac-suggestions absolute card-shadow',
      y: {
        left: rect.left + 'px',
        bottom: rect.height + 20 + 'px',
        width: rect.width + 'px'
      },
      h: !dbEntries.length ? notFound( stringToComplete ) : V.cN( {
        t: 'div',
        h: dbEntries.map( entry => { return renderItem( entry, stringToComplete ) } )
      } )
    } );

    live( 'ac-suggestion', 'mouseout', function() {
      const sel = sc.querySelector( '.ac-suggestion.selected' );
      if ( sel ) {setTimeout( function() { sel.className = sel.className.replace( 'selected', '' ) }, 20 )}
    }, sc );

    live( 'ac-suggestion', 'mouseover', function() {
      const sel = sc.querySelector( '.ac-suggestion.selected' );
      if ( sel ) {sel.className = sel.className.replace( 'selected', '' )}
      this.className += ' selected';
      // considerSelection(sc.querySelector('.ac-suggestion.selected').getAttribute('data-val'), permanentString, this);
    }, sc );

    live( 'ac-suggestion', 'mousedown', function() {
      if ( hasAutoCompleteClass( this, 'ac-suggestion' ) ) { // else outside click
        placeSelection( this.getAttribute( 'data-val' ), permanentString, $elem );
      }
    }, sc );

    V.setNode( 'body', sc );
    // document.body.appendChild( sc );

  }

  function renderNewAutocompleteElement( dbEntries, stringToComplete ) {

    // var s = '';
    V.setNode( '.ac-suggestions', '' );

    for ( let i=0; i<dbEntries.length; i++ ) {
      if ( dbEntries[i].fullId.toLowerCase().includes( stringToComplete ) ) {
        // s += renderItem( dbEntries[i], stringToComplete );
        V.setNode( '.ac-suggestions', renderItem( dbEntries[i], stringToComplete ) );
      }
      else {
        V.setNode( '.ac-suggestions', notFound( stringToComplete ) );
        break;
      }
    }

    // if ( !s.length ) {s += '<div class="ac-suggestion">"' + stringToComplete + '" ' + V.i18n( 'not found', 'app' )}

    // document.getElementsByClassName( 'ac-suggestions' )[0].innerHTML = s;

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

  function renderItem( entity, stringToComplete ) {
    const search = stringToComplete.replace( /[-/\\^$*+?.()|[\]{}]/g, '\\$&' );
    const re = new RegExp( '(' + search.split( ' ' ).join( '|' ) + ')', 'gi' );
    const name = entity.profile.title; // item.slice( 0, -5 );
    const tag = entity.profile.tag; // item.substr( item.length-5 );
    // return '<div class="ac-suggestion" data-val="' + entity.profile.fullId + '">' + name.replace( re, '<span class="txt-brand font-bold">$1</span>' ) + ' <span class="user-tag">' + tag + '</span>' + '</div>';

    return V.cN( {
      t: 'div',
      c: 'ac-suggestion',
      a: {
        'data-val': entity.profile.fullId
      },
      h: name.replace( re, '<span class="txt-brand font-bold">$1</span>' ) + ' <span class="user-tag">' + tag + '</span>'
    } );

  }

  function revertAutoComplete() {

    // $( '#textarea-text' ).css( 'border-color', '#151414' );

    autoCompleteActive = false;
    stringToComplete = false;
    permanentString = '';
    dbEntries = [];

    V.setNode( '.ac-suggestions', 'clear' );

    /*close all autocomplete lists in the document*/
    // const x = document.getElementsByClassName( 'ac-suggestions' );
    // for ( let i = 0; i < x.length; i++ ) {
    //
    //   let that = x[i];
    //   // removeEvent( that, 'keydown', that.keydownHandler );
    //   // removeEvent( that, 'keyup', that.keyupHandler );
    //
    //   that.parentNode.removeChild( that );
    //   that = null;
    // }
  }

  function hasAutoCompleteClass( el, className ) { return el.classList ? el.classList.contains( className ) : new RegExp( '\\b'+ className+'\\b' ).test( el.className ) }

  function addEvent( el, type, handler ) {
    if ( el.attachEvent ) {el.attachEvent( 'on'+type, handler )}
    else {el.addEventListener( type, handler )}
  }

  function removeEvent( el, type, handler ) {
    // if (el.removeEventListener) not working in IE11
    if ( el.detachEvent ) {el.detachEvent( 'on'+type, handler )}
    else {el.removeEventListener( type, handler )}
  }

  function live( elClass, event, cb, context ) {
    addEvent( context || document, event, function( e ) {
      var found, el = e.target || e.srcElement;
      while ( el && !( found = hasAutoCompleteClass( el, elClass ) ) ) {el = el.parentElement}
      if ( found ) {cb.call( el, e )}
    } );
  }

  /* ================== private methods ================= */

  function notFound( stringToComplete ) {
    return V.cN( {
      t: 'div',
      c: 'ac-suggestion',
      h: '"' + stringToComplete + '" ' + V.i18n( 'not found', 'app' )
    } );
  }

  /* ================== public methods ================== */

  /* ================  public components ================ */

  function topcontent() {
    return V.cN( {
      t: 'div',
      c: 'w-full',
      h: [
        {
          t: 'h2',
          c: 'font-bold fs-l leading-snug txt-center w-screen pxy',
          h: V.i18n( 'Chat with Everyone', 'app', 'chat title' )
        },
        {
          t: 'span',
          c: 'block h-4 fs-s txt-center',
          i: 'typing_on_1'
        },
        {
          t: 'span',
          c: 'block h-4 fs-s txt-center',
          i: 'typing_on_2'
        },
      ]
    } );
  }

  function message( msg ) {
    let width = msg.msg.length > 70 ? '300px' : msg.msg.length < 30 ? '220px' : '245px';
    const background = msg.sender == 'Me' ? msg.msg.match( 'You\'ve sent' ) ? '#c0d6b9' : '#e0e7eb' : '#f7f7f8';
    const linkedMsg = V.castLinks( msg.msg );
    linkedMsg.includes( 'iframe' ) ? width = '330px' : null;
    const style = msg.sender == 'Me' ? { 'margin-left': 'auto', 'width': width } : { 'margin-right': 'auto', 'width': width };

    return V.castNode( {
      tag: 'li',
      classes: 'w-screen pxy',
      y: style,
      html: '<message style="background:' + background + '" class="message__container flex card-shadow rounded bkg-white pxy">' +
                  '<div class="font-medium pxy">' +
                    ( msg.sender == 'Me' ? '' : '<p onclick="Profile.draw(\'' + V.castPathOrId( msg.sender ) + '\')" >' + msg.sender + '</p>' ) +
                    '<p>' + linkedMsg + '</p>' +
                  '</div>' +
              '</message>'
    } );
  }

  function messageForm() {
    return V.sN( {
      t: 'div',
      c: 'messageform flex fixed pxy w-full card-shadow',
    } );
  }

  function messageInput( prefill ) {
    const aE = V.getState( 'activeEntity' );
    return V.sN( {
      t: 'textarea',
      c: 'messageform__input mr-2',
      h: prefill ? 'send ' + prefill + ' 10' : '',
      // h: 'send 100 to Community #2121',
      // h: 'send Peter Smith #2121 100',
      // h: 'verify Acc One #2989',
      // h: 'send Community Contribution #2121 100 for corona masks funding',
      // h: 'verify 0x3107b077b7745994cd93d85092db034ca1984d46',
      a: {
        placeholder: aE ? V.i18n( 'Send message or funds', 'placeholder', 'message input' ) : V.i18n( 'Join first to send a message or funds', 'placeholder', 'message input' )
      },
      e: {
        keyup: handleKeyUp,
        keydown: handleKeyDown
      }
    } );
  }

  function messageSend() {
    return V.sN( {
      t: 'button',
      c: 'circle-1 flex justify-center items-center rounded-full border-shadow bkg-white',
      h: V.getIcon( 'send' )
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
    messageResponse: messageResponse
  };

} )();
