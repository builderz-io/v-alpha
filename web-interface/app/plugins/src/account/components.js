const AccountComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Account Plugin
   *
   */

  'use strict';

  /* ============== user interface strings ============== */

  const
    strFrom  = 'from',
    strTo    = 'to',
    strFees    = 'fees',
    strContr    = 'contribution',
    strAmount    = 'amount',
    strPayout    = 'payout',
    strBlock = 'block',
    strDate  = 'date',
    strTime  = 'time',
    strNet  = 'Spendable',
    strGross  = 'Gross',
    strETH  = 'ETH',
    strChain = 'On Chain';

  function uiStr( string, description ) {
    return V.i18n( string, 'account components', description || 'transaction details' ) + ' ';
  }

  /* ================== event handlers ================== */

  function handleDrawUserNav() {
    if ( V.getVisibility( 'user-nav' ) ) {
      V.setState( 'active', { navItem: false } );
      Chat.drawMessageForm( 'clear' );
      Marketplace.draw();
    }
    else {
      Button.draw( 'all', { fade: 'out' } );
      V.setAnimation( 'entity-nav', 'fadeOut', { duration: 0.1 } );
      V.setAnimation( 'service-nav', 'fadeOut', { duration: 0.6 } );
      V.setAnimation( 'user-nav', 'fadeIn', { duration: 0.2 } );
    }
  }

  function handleOpenTxDetails() {
    V.setToggle( this.closest( 'li' ).querySelector( '.card__bottom-right' ) );
  }

  function handleOpenTokenAccountDetails() {
    V.setToggle( this.closest( 'div' ).querySelector( 'table' ) );
  }

  function handleProfileDraw() {
    const path = V.castPathOrId( this.innerHTML );
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( path );
    Profile.draw( path );
  }

  /* ================  public components ================ */

  function topcontent( fullId, bal ) {
    console.log( bal );
    return V.cN( {
      t: 'div',
      h: [
        {
          t: 'h1',
          c: 'font-bold txt-center pxy',
          k: handleOpenTokenAccountDetails,
          h: fullId
        },
        !bal ? { t: 'p', c: 'hidden', h: V.i18n( 'no balance details', 'app' ) } : {
          t: 'table',
          i: 'v-token-account-details',
          c: 'hidden fs-s',
          h: [
            [ uiStr( strNet ), V.setNetVAmount( bal.data[0].liveBalance ).net ],
            [ uiStr( strGross ), bal.data[0].liveBalance ],
            [ uiStr( strChain ), bal.data[0].tokenBalance ],
            [ uiStr( strETH ), bal.data[0].coinBalance ],
          ].filter( index => { return Array.isArray( index ) } ).map( row => {
            return V.cN( {
              t: 'tr',
              h: [
                {
                  t: 'td',
                  h: row[0]
                },
                {
                  t: 'td',
                  c: 'txt-right',
                  h: row[1]
                }
              ]
            } );
          } )
        }
      ]

    } );
  }

  function headerBalance( balance ) {
    balance = V.setNetVAmount( balance ).net;
    const sc = V.getState( 'screen' );
    const aA = V.getState( 'activeAddress' );
    // const initials = V.castInitials( V.getState( 'activeEntity' ).profile.title );
    const strokeColor = 'rgba(' + sc.brandPrimary + ', 1)';
    const textColor = aA ? 'txt-green' : 'txt-brand-primary';

    return V.castNode( { // #1b1aff
      tag: 'svg',
      a: {
        width: sc.width > 800 ? '66px' : '54px',
        viewBox: '0 0 36 36'
      },
      html: `<circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)" stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="white" stroke="${strokeColor}" stroke-width="2.7"></circle>
              <text class="font-medium fs-xxs ${ textColor }" x="50%" y="59%">${ balance }</text>`,
      click: handleDrawUserNav

    } );

    // <text class="font-medium fs-nano txt-brand-primary" x="50%" y="85%">${ initials }</text>
  }

  function accountBalance() {
    const sc = V.getState( 'screen' );
    const strokeColor = 'rgba(' + sc.brandPrimary + ', 1)';
    return V.castNode( {
      tag: 'li',
      class: 'txt-anchor-mid',
      html: `<svg width="74px" viewBox="0 0 36 36"> +
              <circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)" stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="white" stroke="${strokeColor}" stroke-width="2.7"></circle>
              <text class="font-medium fs-xxs txt-green" x="50%" y="59%">3129</text>
            </svg>`

    } );
  }

  function accountSmallCard( variable, accountData ) {
    return V.castNode( {
      tag: 'li',
      classes: 'pxy txt-center',
      html: `<div class="smallcard__container font-medium pxy">
              <p class="font-medium pb-xs">${variable}</p>
              <div class="flex justify-center items-center circle-2 rounded-full border-shadow font-medium no-txt-select">
                ${accountData[variable]}
              </div>
            </div>`
    } );
  }

  function accountCard( txData ) {

    let background = '';

    switch ( txData.txType ) {
    case 'in':
      background = '#B4ECB4';
      break;
    case 'out':
      background = '#FFAACC';
      break;
    case 'fee':
      background = 'lightblue';
      break;
    case 'generated':
      background = 'green';
      break;
    default:
      background = 'gray';
    }

    const $cardContentFrame = V.cN( {
      t: 'div',
      c: 'contents'
    } );

    const $topLeft = V.cN( {
      t: 'div',
      c: 'card__top-left flex justify-center items-center pxy',
      h: {
        t: 'div',
        c: 'circle-3 flex justify-center items-center rounded-full cursor-pointer',
        a: {
          style: `background:${background}`
        },
        k: handleOpenTxDetails,
        h: {
          t: 'div',
          c: 'card__initials font-medium fs-xl txt-white no-txt-select',
          h: txData.amount
        }
      }
    } );

    const $topRight = V.cN( {
      t: 'div',
      c: 'card__top-right flex items-center pxy',
      h: {
        t: 'h2',
        c: 'font-bold fs-l leading-snug cursor-pointer',
        k: handleProfileDraw,
        h: txData.title
      }
    } );

    const $bottomLeft = V.cN( {
      t: 'div',
      c: 'card__bottom-left items-center',
      h: ''
    } );

    const $bottomRight = V.cN( {
      t: 'div',
      c: 'card__bottom-right hidden fs-s pxy capitalize',
      h: {
        t: 'table',
        h: [
          txData.blockDate ? [ uiStr( strDate ), new Date( txData.blockDate * 1000 ).toString().substr( 4, 11 ) ] : undefined,
          txData.blockDate ? [ uiStr( strTime ), new Date( txData.blockDate * 1000 ).toString().substr( 15, 6 ) ] : undefined,
          [ uiStr( strAmount ), txData.amount ],
          txData.txType == 'out' ? [ uiStr( strFees ), txData.feesBurned ] : [ uiStr( strFees ), '0' ],
          txData.txType == 'out' ?  [ uiStr( strContr ), txData.contribution ] : [ uiStr( strContr ), '0' ],
          txData.block ? [ uiStr( strBlock ), txData.block ] : [ uiStr( strDate ), txData.date ],
          [ uiStr( strFrom ), txData.fromAddress != 'none' ? txData.fromEntity /* + ' ' + V.castShortAddress( txData.fromAddress, 4 ) */ : txData.from + ' ' + txData.fromTag ],
          [ uiStr( strTo ), txData.toAddress != 'none' ? txData.toEntity /* + ' ' + V.castShortAddress( txData.toAddress, 4 ) */ : txData.to + ' ' + txData.toTag ],
          [ uiStr( strPayout ), txData.payout ],
        ].filter( index => { return Array.isArray( index ) } ).map( row => {
          return V.cN( {
            t: 'tr',
            h: [
              {
                t: 'td',
                h: row[0]
              },
              {
                t: 'td',
                c: 'txt-right',
                h: row[1]
              }
            ]
          } );
        } )
      }
    } );

    V.setNode( $cardContentFrame, [ $topLeft, $topRight, $bottomLeft, $bottomRight ] );

    return $cardContentFrame;

  }

  function accountPlaceholderCard() {

    const $cardContentFrame = V.cN( {
      t: 'div',
      c: 'contents placeholder'
    } );

    const $topLeft = V.cN( {
      t: 'div',
      c: 'card__top-left flex justify-center items-center pxy',
      h: V.cN( {
        t: 'div',
        c: 'circle-3 rounded-full animated-background',
      } ),
    } );

    const $topRight = V.cN( {
      t: 'div',
      c: 'relative animated-background',
      y: {
        height: '20px',
        width: '200px',
        top: '25px',
        left: '8px'
      },
      // h: {
      //   t: 'h2',
      //   c: 'font-bold fs-l leading-snug cursor-pointer',
      //   h: 'Aname Bname #1234'
      // }
    } );

    V.setNode( $cardContentFrame, [ $topLeft, $topRight ] );

    return $cardContentFrame;

  }

  return {
    topcontent: topcontent,
    headerBalance: headerBalance,
    accountBalance: accountBalance,
    accountSmallCard: accountSmallCard,
    accountCard: accountCard,
    accountPlaceholderCard: accountPlaceholderCard
  };

} )();
