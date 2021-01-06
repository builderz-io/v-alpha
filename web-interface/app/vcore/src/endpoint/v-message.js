const VMessage = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage messaging
   *
   */

  'use strict';

  const blackList = ['porn', 'sex', 'xxx', 'bit.ly', 'goo.gl', 'tinyurl', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'bit.do', 'mcaf.ee', 'su.pr'];

  const triggers = {
    // NOTE: Adding request and transfer commands requires updating the backend language files also

    forbiddenFirstNamesEN: ['to', 'and'],
    forbiddenFirstNamesDE: ['an', 'und'],

    commandsHelp: ['help', 'hilfe', '도움'],

    commandsSearch: ['search', 'suche', 'find', 'finde', 'fx', 'f!', 'view'],

    commands: ['nukeme', 'crashapp', 'verify', 'disable', 'enable', 'makeadmin', 'revokeadmin', 'analyse', 'a!', 'payouttokennow'],
    commandsEN: ['+', '-', 'pay', 'send', 'request', 'transfer', 'sx', 's!', 'rx', 'r!', 'tx', 't!'],
    commandsDE: ['zahle', 'sende', 'empfange', 'leite', 'zahlen', 'senden', 'empfangen', 'leiten'],
    commandsKO: ['더하기', '지불하다', '전송', '요청'], // TODO: add 'transfer' and check sychronicity of 'request' and 'transfer' with backend translation file

    misspellingsEN: ['sent', 'sned', 'sedn', 'semd', 'sen ', 'snd ', 'sed '],
    misspellingsDE: [ 'TODO' ],
  };

  /* ================== private methods ================= */

  function checkForTriggers( text ) {
    const triggersConcat = triggers.commands.concat( triggers.commandsHelp, triggers.commandsSearch, triggers.commandsEN, triggers.commandsDE, triggers.commandsKO );

    const checkParts = text.trim().split( ' ' );

    // in case user misses a blank, insert it // TODO: simplify and rework this functionality, also to work for all languages
    if ( checkParts[0].charAt( 0 ) === '+' || checkParts[0].charAt( 0 ) === '-' ) { checkParts.splice( 1, 0, checkParts[0].slice( 1 ) ); checkParts.splice( 0, 1, checkParts[0].charAt( 0 ) ) }
    // if (checkParts[0].substring(0,3) === 'pay') { checkParts.splice(0,0,checkParts[0].substring(0,3)); checkParts.splice(1,1,checkParts[1].substring(3,checkParts[1].length)); }
    // if (checkParts[0].substring(0,7) === 'request') { checkParts.splice(0,0,checkParts[0].substring(0,7)); checkParts.splice(1,1,checkParts[1].substring(7,checkParts[1].length)); }
    // // BUG: this is incompatible between German ("sende") and English ("send"): if (checkParts[0].substring(0,4) === 'send' || checkParts[0].substring(0,4) === 'plus' || checkParts[0].substring(0,4) === 'sned' || checkParts[0].substring(0,4) === 'sent' ) { checkParts.splice(0,0,checkParts[0].substring(0,4)); checkParts.splice(1,1,checkParts[1].substring(4,checkParts[1].length)); }

    if ( triggersConcat.indexOf( checkParts[0].toLowerCase() ) != -1 ) {
      checkParts[0] = checkParts[0].toLowerCase();
      return checkParts;
    }
    else {
      return false;
    }
  }

  function sanitize( input ) {
    return input.trim().replace( /(?:\r\n|\r|\n)/g, ' ' ).replace( /<[^>]+>/g, '' );
  }

  /* ================== public methods ================== */

  async function setMessageBot( message ) {

    const text = sanitize( message );

    const spam = blackList.some( v => text.toLowerCase().includes( v ) );

    if ( text.indexOf( 'vx' ) > -1 ) {
      return Promise.resolve( { success: false, endpoint: 'message', status: 'unique phrase entered?' } );
    }

    else if ( spam ) {
      return Promise.resolve( { success: false, endpoint: 'message', status: 'sorry, message content may contain spam' } );
    }

    else if ( text.match( /[a-zA-Z0-9+]/ ) === null ) {
      return Promise.resolve( { success: false, endpoint: 'message', status: 'invalid message' } );
    }

    else if ( triggers.misspellingsEN.concat( triggers.misspellingsDE ).indexOf( text.substr( 0, 4 ) ) >= 0 ) {
      return Promise.resolve( { success: false, endpoint: 'message', status: 'misspelled trigger' } );
    }

    else {

      /**
       * does message include trigger words?
       */

      const caseArray = checkForTriggers( text );

      if ( !caseArray ) {

        /**
        * if message is good and no trigger word was detected just send a message
        *
        */

        return V.setMessage( text );
      }
      else {

        if ( triggers.commandsHelp.indexOf( caseArray[0] ) != -1 ) {   // does message include trigger word "help"?
          $( '.notification-container' ).remove();
          $( '#messages-ul' ).append( '<li class="notification-container highlight" onclick="$(this).slideUp( 100, function() {})">' + str10110 + '<span class="close-x"><i class="fas fa-times-circle close-x"></i></span></li>' );
          autoScroll();
        }
        else if ( triggers.commandsSearch.indexOf( caseArray[0] ) != -1 ) {   // does message include trigger word "search"?
          findAndDisplayEntity( message );
        }
        else if ( caseArray[0] === 'nukeme' ) {
          return V.setData( 'nukeme' );
        }
        else if ( caseArray[0] === 'crashapp' ) {
          return V.setData( 'crash-app' );
        }
        // TODO:
        // else if ( caseArray[0] === 'analyse' ||  caseArray[0] === 'a!' ) {
        //   socket.emit( 'analyse', [caseArray, Cookies.get( 'uPhrase' )], function( callback ) {
        //
        //     displayAnalysis( callback );
        //
        //   } );
        //
        // }
        else if ( caseArray[0] === 'verify' ) {

          caseArray.shift();

          // const adminPass = caseArray.pop();
          // entityToVerify = { fullId: caseArray.join( ' ' ), adminPass: adminPass };

          return V.setEntity( caseArray.join( ' ' ), {
            field: 'status.verified',
            data: true,
          } ).then( res => {
            console.log( 'verification success:', res.data[0].fullId );
            return {
              success: true,
              status: 'entity verified',
            };
          } );

          /*
           * The above now triggers the autoFloat (and verify) in the entity store,
           * hence the below is not required
           *
           */

          // if ( V.getSetting( 'transactionLedger' ) == 'EVM' ) {
          //   let entityToVerify;
          //   if ( caseArray[0].substr( 0, 2 ) == '0x' ) {
          //     entityToVerify = caseArray[0];
          //   }
          //   else {
          //     const entity = await V.getEntity( caseArray.join( ' ' ) );
          //     entityToVerify = entity.data[0].evmCredentials ? entity.data[0].evmCredentials.address : undefined;
          //     if ( !entityToVerify ) {
          //       return {
          //         success: false,
          //         status: 'could not find address of entity'
          //       };
          //     }
          //   }
          //   V.setEntity( entityToVerify, 'verification' );
          // }

        }
        // else if ( caseArray[0] === 'makeadmin' ) {
        //   socket.emit( 'makeadmin', [caseArray, Cookies.get( 'uPhrase' )] );
        //
        // }
        // else if ( caseArray[0] === 'revokeadmin' ) {
        //   socket.emit( 'revokeadmin', [caseArray, Cookies.get( 'uPhrase' )] );
        //
        // }
        // else if ( caseArray[0] === 'disable' ) {
        //   socket.emit( 'disable', [caseArray, Cookies.get( 'uPhrase' )] );
        //
        // }
        // else if ( caseArray[0] === 'enable' ) {
        //   socket.emit( 'enable', [caseArray, Cookies.get( 'uPhrase' )] );
        //
        // }
        // else if ( caseArray[0] === 'payouttokennow' ) {
        //   socket.emit( 'payout tokens now', [caseArray, Cookies.get( 'uPhrase' )] );
        //
        // }
        else { // command can only be "send" or "request" at this point
          return V.setTransactionConfirmation( caseArray );
        }
      }
    }
  }

  function getMessage(
    which = 'all',
  ) {
    return V.getData( which, 'message', V.getSetting( 'chatLedger' ) );
  }

  function setMessage(
    whichMessage,
  ) {
    const msgData = {};
    msgData.message = whichMessage;

    if ( V.aE() ) {
      msgData.sender = V.aE().fullId;
      return V.setData( msgData, 'message', V.getSetting( 'chatLedger' ) );
    }
    else {
      return Promise.resolve( {
        success: false,
        endpoint: 'message',
        status: 'not joined',
      } );
    }
  }

  /* ====================== export ====================== */

  V.checkForTriggers = checkForTriggers;
  V.getMessage = getMessage;
  V.setMessage = setMessage;
  V.setMessageBot = setMessageBot;

  return {
    checkForTriggers: checkForTriggers,
    getMessage: getMessage,
    setMessage: setMessage,
    setMessageBot: setMessageBot,
  };

} )();
