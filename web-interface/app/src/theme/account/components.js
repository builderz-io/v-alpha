const AccountComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for Marketplace Plugin
   *
   */

  'use strict';

  function headerBalance( balance ) {

    return V.castNode( {
      tag: 'svg',
      html: `<svg width="54px" viewBox="0 0 36 36">
              <circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)" stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="white" stroke="#1b1aff" stroke-width="2.7"></circle>
              <text class="font-medium fs-xxs txt-green" x="50%" y="59%">${ balance }</text>
            </svg>`,
      click: function() {
        Account.draw();
      }

    } );
  }

  function accountBalance() {
    return V.castNode( {
      tag: 'li',
      class: 'txt-anchor-mid',
      html: '<svg width="74px" viewBox="0 0 36 36">' +
              '<circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)" stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="white" stroke="#1b1aff" stroke-width="2.7"></circle>' +
              '<text class="font-medium fs-xxs txt-green" x="50%" y="59%">3129</text>' +
            '</svg>'

    } );
  }

  function accountSmallCard( variable, accountData ) {
    return V.castNode( {
      tag: 'li',
      setStyle: {
        'circle-2': {
          width: '3.5rem',
          height: '3.5rem'
        }
      },
      classes: 'pxy txt-center',
      html: '<div class="smallcard__container font-medium pxy">' +
              '<p class="font-medium pb-xs">' + variable + '</p>' +
              '<div class="flex justify-center items-center circle-2 rounded-full border-blackalpha font-medium no-txt-select">' +
                accountData[variable] +
              '</div>' +
            '</div>'
    } );
  }

  // accountCard using Demo Data
  // function accountCard( txData ) {
  //   const background = txData.type == 'in' ? '#B4ECB4' : '#FFAACC';
  //   return V.castNode( {
  //     tag: 'li',
  //     setStyle: {
  //       'circle-3': {
  //         width: '4.5rem',
  //         height: '4.5rem'
  //       }
  //     },
  //     classes: 'pxy w-screen',
  //     html: '<card class="flex card-shadow rounded bkg-white pxy">' +
  //
  //               '<div class="circle-3 pxy rounded-full flex justify-center items-center" style="background: ' + background + ';">' + // ' + background + '
  //                 '<div class="card__initials font-medium fs-xl txt-white">' + txData.amount * txData.price + '</div>' +
  //               '</div>' +
  //
  //             '<div class="pxy">' +
  //               '<h2 class="font-bold fs-l leading-snug">' + txData.title + '</h2>' +
  //               '<p>' + 'For ' + txData.for + '</p>' +
  //     '<p>' + 'Price was ' + ( txData.price == 0 ? 'free' : txData.price + ' ' + txData.unit ) + '</p>' +
  //     // '<p>' + 'Booked ' + txData.amount + ' times' + '</p>' +
  //             '</div>' +
  //           '</card>'
  //   } );
  // }

  // accountCard using Web3 Data
  function accountCard( txData ) {

    let background = '';

    switch ( txData.txType ) {
    case 'in':
      background = '#B4ECB4';
      break;
    case 'out':
      background = '#ffa41b'; // '#FFAACC';
      break;
    case 'burned':
      background = 'lightblue';
      break;
    case 'generated':
      background = 'green';
      break;
    default:
      background = 'gray';
    }

    return V.castNode( {
      tag: 'li',
      setStyle: {
        'circle-3': {
          width: '4.5rem',
          height: '4.5rem'
        }
      },
      classes: 'pxy w-screen',
      html: '<card class="flex card-shadow rounded bkg-white pxy">' +

                '<div class="circle-3 pxy rounded-full flex justify-center items-center" style="background: ' + background + ';">' + // ' + background + '
                  '<div class="card__initials font-medium fs-xl txt-white">' + txData.amount + '</div>' +
                '</div>' +

              '<div class="pxy">' +
                '<h2 class="font-bold fs-l leading-snug">' + txData.title + '</h2>' +
                '<p>' + 'From ' + V.castShortAddress( txData.fromAddress ) + '</p>' +
                 '<p>' + 'To ' + V.castShortAddress( txData.toAddress ) + '</p>' +
                 '<p>' + 'Block ' + txData.block + '</p>' +
      // '<p>' + 'Log Index ' + txData.logIndex + '</p>' +
      //  '<p>' + 'Price was ' + ( txData.price == 0 ? 'free' : txData.price + ' ' + txData.unit ) + '</p>' +
      // '<p>' + 'Booked ' + txData.amount + ' times' + '</p>' +
              '</div>' +
            '</card>'
    } );
  }

  function topSliderUl() {
    return V.castNode( {
      tag: 'ul',
      classes: 'flex overflow-x-scroll'
    } );
  }
  function listingsUl() {
    return V.castNode( {
      tag: 'ul',
      classes: 'listings__ul flex flex-wrap justify-evenly overflow-y-scroll content-start',
      setStyle: {
        listings__ul: {
          height: '530px'
        }
      },
    } );
  }

  return {
    headerBalance: headerBalance,
    accountBalance: accountBalance,
    accountSmallCard: accountSmallCard,
    accountCard: accountCard,
    topSliderUl: topSliderUl,
    listingsUl: listingsUl
  };

} )();
