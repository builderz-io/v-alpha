const MarketplaceComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Marketplace Plugin
   *
   */

  'use strict';

  function handleProfileDraw() {
    const path = this;
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( { path: path } );
    Profile.draw( path );
  }

  const palette = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc']; // https://colorhunt.co/palette/167860
  // const palette = ['#d1d2da', '#3a0088', '#930077', '#e61c5d', '#ffbd39']; // https://colorhunt.co/palette/108152

  const background = ( cardData ) => {
    if ( cardData.thumbnail ) {
      const url = V.castEntityThumbnail( cardData.thumbnail ).src;
      return 'url(\'' + url + '\')';
    }

    switch ( '2' /* cardData.profile.tag.charAt( 1 ) */ ) {
    // case '1': return palette[0];
    case '2': return palette[0];
    case '3': return palette[1];
    // case '4': return palette[1];
    case '5': return palette[0];
    case '6': return palette[2];
    // case '7': return palette[2];
    case '8': return palette[0];
    case '9': return palette[3];
    }
  };

  const initials = ( cardData ) => {
    if ( cardData.image != undefined ) {
      return '';
    }
    return V.castInitials( cardData.profile.title );
  };

  function entitiesSmallCard( cardData ) {
    return V.cN( {
      t: 'li',
      c: 'pxy',
      h: {
        t: 'smallcard',
        c: 'smallcard__container txt-center rounded bkg-white',
        h: [
          {
            t: 'div',
            c: 'circle-3 rounded-full flex justify-center items-center cursor-pointer',
            a: {
              style: `background:${background( cardData )}; background-position: center center; background-size: cover;`
            },
            h: {
              t: 'div',
              c: 'card__initials font-bold fs-xl txt-white', // txt-shadow
              h: background( cardData ).includes( 'url' ) ? '' : initials( cardData )
            },
            e: {
              click: handleProfileDraw.bind( cardData.path )
            }
          },
          // V.cN( {
          //   t: 'p',
          //   c: 'fs-s',
          //   h: cardData.profile.title
          // } )
        ]
      }
    } );
  }

  function cardContent( cardData ) {
    cardData.properties ? null : cardData.properties = {};
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
          style: `background:${background( cardData )}; background-position: center center; background-size: cover;`
        },
        h: {
          t: 'div',
          c: 'card__initials font-bold fs-xl txt-white',
          h: background( cardData ).includes( 'url' ) ? '' : initials( cardData )
        },
        e: {
          click: handleProfileDraw.bind( cardData.path )
        }
      }
    } );

    const $topRight = V.cN( {
      t: 'div',
      c: 'card__top-right flex items-center pxy',
      h: {
        t: 'h2',
        c: 'font-bold fs-l leading-snug cursor-pointer',
        h: cardData.fullId,
        k: handleProfileDraw.bind( cardData.path )
      }
    } );

    const $bottomLeft = V.cN( {
      t: 'div',
      c: 'card__bottom-left items-center pxy',
      h: cardData.properties && cardData.properties.target ? [
        {
          t: 'div',
          c: 'circle-2 flex justify-center items-center rounded-full border-shadow font-medium no-txt-select',
          h: cardData.properties && cardData.properties.target ? cardData.properties.target : '',
        },
        {
          t: 'p',
          c: 'card__unit fs-xxs',
          h: cardData.properties && cardData.properties.unit ? cardData.properties.unit : '',
        }
      ] : ''
    } );

    const $bottomRight = V.cN( {
      t: 'div',
      c: 'card__bottom-right pxy',
      h: [
        { t: 'p', h: cardData.properties && cardData.properties.description ? cardData.properties.description : '' },
        { t: 'p', h: cardData.properties && cardData.properties.baseLocation ? cardData.properties.baseLocation : '' }
      ]
    } );

    V.setNode( $cardContentFrame, [ $topLeft, $topRight, $bottomLeft, $bottomRight ] );

    return $cardContentFrame;

  }

  return {
    entitiesSmallCard: entitiesSmallCard,
    cardContent: cardContent,
  };

} )();
