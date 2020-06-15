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
    strDate  = 'date';

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

  /* ================  public components ================ */

  function topcontent( fullId ) {
    return V.cN( {
      t: 'div',
      h: V.cN( {
        tag: 'h1',
        class: 'font-bold txt-center pxy',
        html: fullId
      } )

    } );
  }

  function headerBalance( balance ) {
    const sc = V.getState( 'screen' );
    const strokeColor = 'rgba(' + sc.brandPrimary + ', 1)';

    return V.castNode( { // #1b1aff
      tag: 'svg',
      a: {
        width: sc.width > 800 ? '66px' : '54px',
        viewBox: '0 0 36 36'
      },
      html: `<circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)" stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="white" stroke="${strokeColor}" stroke-width="2.7"></circle>
              <text class="font-medium fs-xxs txt-green" x="50%" y="59%">${ balance }</text>`,
      click: handleDrawUserNav

    } );
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
        h: {
          t: 'div',
          c: 'card__initials font-medium fs-xl txt-white',
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
        h: txData.title
      }
    } );

    const $bottomLeft = V.cN( {
      t: 'div',
      c: 'card__bottom-left items-center pxy',
      h: ''
    } );

    const $bottomRight = V.cN( {
      t: 'div',
      c: 'card__bottom-right pxy capitalize',
      h: [
        txData.fromAddress != 'none' ? { t: 'p', h: uiStr( strFrom ) + V.castShortAddress( txData.fromAddress ) } : { t: 'p', h: uiStr( strFrom ) + txData.from + ' ' + txData.fromTag },
        txData.toAddress != 'none' ? { t: 'p', h: uiStr( strTo ) + V.castShortAddress( txData.toAddress ) } : { t: 'p', h: uiStr( strTo ) + txData.to + ' ' + txData.toTag },
        { t: 'p', h: uiStr( strAmount ) + txData.amount },
        { t: 'p', h: uiStr( strPayout ) + txData.payout },
        txData.txType == 'out' ? { t: 'p', h: uiStr( strFees ) + txData.feesBurned } : { t: 'p' },
        txData.txType == 'out' ? { t: 'p', h: uiStr( strContr ) + txData.contribution } : { t: 'p' },
        txData.block ? { t: 'p', h: uiStr( strBlock ) + txData.block } : { t: 'p', h: uiStr( strDate ) + txData.date },
        txData.blockDate ? { t: 'p', h: uiStr( strDate ) + new Date( txData.blockDate * 1000 ) } : { t: 'p' },
      ]
    } );

    V.setNode( $cardContentFrame, [ $topLeft, $topRight, $bottomLeft, $bottomRight ] );

    return $cardContentFrame;

  }

  function accountPlaceholderCard() {

    const $cardContentFrame = V.cN( {
      t: 'div',
      c: 'contents'
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
