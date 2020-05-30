const AccountComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Account Plugin
   *
   */

  'use strict';

  function handleDrawUserNav() {
    if ( V.getVisibility( 'user-nav' ) ) {
      V.setState( 'active', { navItem: false } );
      // Navigation.draw();
      // Page.draw( { reset: false } );
      Marketplace.draw();
    }
    else {
      Button.draw( 'all', { fade: 'out' } );
      V.setAnimation( 'entity-nav', 'fadeOut', { duration: 0.1 } );
      V.setAnimation( 'service-nav', 'fadeOut', { duration: 0.6 } );
      V.setAnimation( 'user-nav', 'fadeIn', { duration: 0.2 } );
    }
  }

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

    return V.castNode( {
      tag: 'svg',
      a: {
        width: sc.width > 800 ? '66px' : '54px',
        viewBox: '0 0 36 36'
      },
      html: `<circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)" stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="white" stroke="#1b1aff" stroke-width="2.7"></circle>
              <text class="font-medium fs-xxs txt-green" x="50%" y="59%">${ balance }</text>`,
      click: handleDrawUserNav

    } );
  }

  function accountBalance() {
    return V.castNode( {
      tag: 'li',
      class: 'txt-anchor-mid',
      html: `<svg width="74px" viewBox="0 0 36 36"> +
              <circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)" stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="white" stroke="#1b1aff" stroke-width="2.7"></circle>
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

    return V.castNode( {
      tag: 'div',
      c: 'contents',
      html: `<div class="circle-3 pxy rounded-full flex justify-center items-center" style="background:${background};">
                  <div class="card__initials font-medium fs-xl txt-white">${txData.amount}</div>
                </div>
              <div class="pxy">
                <h2 class="font-bold fs-l leading-snug">${txData.title}</h2>
                <p>From ${V.castShortAddress( txData.fromAddress )}</p>
                 <p>To ${V.castShortAddress( txData.toAddress )}</p>
                 <p>Block ${txData.block}</p>
              </div>`
    } );
  }

  return {
    topcontent: topcontent,
    headerBalance: headerBalance,
    accountBalance: accountBalance,
    accountSmallCard: accountSmallCard,
    accountCard: accountCard,
  };

} )();
