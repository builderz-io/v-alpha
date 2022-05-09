const AccountComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Account Plugin
   *
   */

  'use strict';

  V.setStyle( {
    'chain-status': {
      'max-width': '180px',
      'margin': '0 auto',
      'padding': '20px 0px',
    },
  } );

  /* ============== user interface strings ============== */

  const ui = {
    from: 'from',
    to: 'to',
    fees: 'fee',
    contr: 'contribution',
    amount: 'amount',
    total: 'total',
    payout: 'payout',
    block: 'block',
    date: 'date',
    time: 'time',
    net: 'Spendable',
    gross: 'Gross',
    eth: 'ETH',
    chain: 'On Chain',
    noBal: 'no balance details',
    lastBlock: 'last block',
    zeroBlock: 'zero block',
    currentBlock: 'now block',
    currentDate: 'now date',
  };

  function getString( string, scope ) {
    return V.i18n( string, 'account', scope || 'account components' ) + ' ';
  }

  /* ================== event handlers ================== */

  function handleOpenTxDetails() {
    V.setToggle( this.closest( 'li' ).querySelector( '.card__bottom-right' ) );
  }

  function handleOpenTokenAccountDetails() {
    V.setToggle( this.closest( 'div' ).querySelector( 'table' ) );
  }

  function handleProfileDraw() {
    const path = V.castPathOrId( this.textContent );
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( path );
    Profile.draw( path );
  }

  /* ================  public components ================ */

  function topcontent( fullId, bal ) {
    return V.cN( {
      h: [
        {
          t: 'h1',
          c: 'font-bold txt-center pxy',
          k: handleOpenTokenAccountDetails,
          h: fullId,
        },
        !bal
          ? {
            t: 'p',
            c: 'hidden',
            h: getString( ui.noBal ),
          }
          : {
            h: {
              t: 'table',
              i: 'v-token-account-details',
              c: 'chain-status hidden fs-s',
              h: [
                [ getString( ui.net ), V.getNetVAmount( bal.data[0].liveBalance ).net ],
                [ getString( ui.gross ), bal.data[0].liveBalance ],
                [ getString( ui.chain ), bal.data[0].tokenBalance ],
                [ getString( ui.eth ), bal.data[0].coinBalance ],
                [ getString( ui.lastBlock ), bal.data[0].lastBlock ],
                [ getString( ui.zeroBlock ), bal.data[0].zeroBlock ],
                [ getString( ui.currentBlock ), bal.data[0].currentBlock  ],
                [ getString( ui.currentDate ), new Date().toString().substr( 4, 17 ) ],
              ].filter( index => Array.isArray( index ) ).map( row => V.cN( {
                t: 'tr',
                h: [
                  {
                    t: 'td',
                    h: row[0],
                  },
                  {
                    t: 'td',
                    c: 'txt-right',
                    h: row[1],
                  },
                ],
              } ) ),
            },
          },
      ],

    } );
  }

  function headerBalance( balance ) {
    if ( balance === -1 ) {
      balance = '..';
    }
    else {
      balance = V.getNetVAmount( balance ).net;
      balance = isNaN( balance ) ? '😷' : String( balance );
    }
    const sc = V.getState( 'screen' );
    const strokeColor = 'rgba(' + sc.brandPrimary + ', 1)';
    const textColor = V.cA() ? 'txt-green' : 'txt-brand-primary';

    return V.cN( { // #1b1aff
      svg: true,
      a: {
        style: 'filter: drop-shadow(0px 2px 1px rgba(var(--black), .18))',
        width: sc.width > 800 ? '66px' : '54px',
        viewBox: '0 0 36 36',
      },
      k: Navigation.drawUserNav,
      h: [
        {
          t: 'circle',
          a: {
            // todo   stroke-dasharray   should be in circle for lifetime display
            'cx': '18',
            'cy': '18',
            'r': '15.91549430918954',
            'fill': 'white',
            'stroke': strokeColor,
            'stroke-width': '2.7',
            'transform': 'rotate(-90, 18, 18) translate(0, 36) scale(1, -1)',
            'stroke-dashoffset': '-200',
          },
        },
        {
          t: 'text',
          c: `font-medium fs-xxs ${ textColor } no-txt-select`,
          a: {
            x: '50%',
            y: '59%',
          },
          h: balance,
        },
      ],
    } );
  }

  function accountBalance() {
    const sc = V.getState( 'screen' );
    const strokeColor = 'rgba(' + sc.brandPrimary + ', 1)';
    return V.cN( {
      t: 'li',
      c: 'txt-anchor-mid',
      h: {
        svg: true,
        a: {
          width: '74px',
          viewBox: '0 0 36 37',
        },
        h: [
          {
            t: 'circle',
            a: {
              'stroke-dasharray': '100',
              'transform': 'rotate(-90, 18, 18) translate(0, 36) scale(1, -1)',
              'stroke-dashoffset': '-200',
              'cx': '18',
              'cy': '18',
              'r': '15.91549430918954',
              'fill': 'white',
              'stroke': strokeColor,
              'stroke-width': '2.7',
            },
          },
          {
            t: 'text',
            c: 'font-medium fs-xxs ${ textColor } no-txt-select',
            a: {
              x: '50%',
              y: '59%',
            },
            h: 1234, // TODO: get balance
          },
        ],
      },
      // html: `<svg width="74px" viewBox="0 0 36 36"> +
      //         <circle stroke-dasharray="100" transform ="rotate(-90, 18, 18) translate(0, 36) scale(1, -1)" stroke-dashoffset="-200" cx="18" cy="18" r="15.91549430918954" fill="white" stroke="${strokeColor}" stroke-width="2.7"></circle>
      //         <text class="font-medium fs-xxs txt-green no-txt-select" x="50%" y="59%">3129</text>
      //       </svg>`,

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
            </div>`,
    } );
  }

  function accountCard( txData ) {

    let background = '';

    switch ( txData.txType ) {
    case 'in':
      background = '#4bd25b'; // '#B4ECB4';
      break;
    case 'out':
      background = '#cc3e58'; // '#FFAACC';
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
      c: 'contents',
    } );

    const $topLeft = V.cN( {
      c: 'card__top-left flex justify-center items-center pxy',
      h: {
        c: 'circle-3 flex justify-center items-center rounded-full cursor-pointer',
        a: {
          style: `background:${background}`,
        },
        k: handleOpenTxDetails,
        h: {
          c: 'card__initials font-medium fs-xl txt-white no-txt-select',
          h: txData.amount,
        },
      },
    } );

    const $topRight = V.cN( {
      c: 'card__top-right flex items-center pxy',
      h: {
        t: 'h2',
        c: 'font-bold fs-l leading-snug cursor-pointer',
        k: handleOpenTxDetails, // handleProfileDraw,
        h: txData.title,
      },
    } );

    const $bottomLeft = V.cN( {
      c: 'card__bottom-left items-center',
      h: '',
    } );

    const $bottomRight = V.cN( {
      c: 'card__bottom-right hidden fs-s pxy capitalize',
      h: {
        t: 'table',
        h: [
          txData.txType == 'in'
            ? [
              getString( ui.from ),
              txData.fromAddress != 'none'
                ? txData.fromEntity /* + ' ' + V.castShortAddress( txData.fromAddress, 4 ) */
                : txData.from + ' ' + txData.fromTag,
              handleProfileDraw,
            ]
            : [
              getString( ui.to ),
              txData.toAddress != 'none'
                ? txData.toEntity /* + ' ' + V.castShortAddress( txData.toAddress, 4 ) */
                : txData.to + ' ' + txData.toTag,
              handleProfileDraw,
            ],

          txData.blockDate
            ? [ getString( ui.date ), new Date( txData.blockDate * 1000 ).toString().substr( 4, 11 ) ]
            : undefined,

          txData.blockDate
            ? [ getString( ui.time ), new Date( txData.blockDate * 1000 ).toString().substr( 15, 6 ) ]
            : undefined,

          txData.block
            ? [ getString( ui.block ), txData.block ]
            : [ getString( ui.date ), txData.date.substr( 4, 11 ) + ' ' + txData.date.substr( 15, 6 ) ],

          [
            getString( ui.amount ),
            txData.txType == 'out'
              ? '-' + txData.amount
              : txData.amount,
          ],

          txData.txType == 'out'
            ? undefined
            : [ getString( ui.net ), V.getNetVAmount( txData.amount ).net ],

          txData.txType == 'out'
            ? [ getString( ui.fees ), '-' + txData.feeAmount ]
            : [ getString( ui.fees ), '0' ],

          txData.txType == 'out'
            ? [ getString( ui.contr ), '-' + txData.contribution ]
            : [ getString( ui.contr ), '0' ],

          txData.txType == 'out'
            ? [ getString( ui.total ),
              '-' + (
                Number( txData.amount )
                + Number( txData.feeAmount )
                + Number( txData.contribution )
              ) ]
            : undefined,

          // txData.payout
          //   ? [ getString( ui.payout ), txData.payout ]
          //   : undefined,

        ].filter( index => Array.isArray( index ) ).map( row => V.cN( {
          t: 'tr',
          h: [
            {
              t: 'td',
              h: row[0],
            },
            {
              t: 'td',
              c: 'txt-right' + ( row[2] ? ' cursor-pointer' : '' ),
              h: row[1],
              k: row[2],
            },
          ],
        } ) ),
      },
    } );

    V.setNode( $cardContentFrame, [ $topLeft, $topRight, $bottomLeft, $bottomRight ] );

    return $cardContentFrame;

  }

  function accountPlaceholderCard() {

    const $cardContentFrame = V.cN( {
      c: 'contents placeholder',
    } );

    const $topLeft = V.cN( {
      c: 'card__top-left flex justify-center items-center pxy',
      h: V.cN( {
        c: 'circle-3 rounded-full animated-background',
      } ),
    } );

    const $topRight = V.cN( {
      c: 'relative animated-background',
      y: {
        'height': '20px',
        'width': '200px',
        'top': '25px',
        'left': '8px',
        'border-radius': '4px',
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

  /* ====================== export ====================== */

  return {
    topcontent: topcontent,
    headerBalance: headerBalance,
    accountBalance: accountBalance,
    accountSmallCard: accountSmallCard,
    accountCard: accountCard,
    accountPlaceholderCard: accountPlaceholderCard,
  };

} )();
