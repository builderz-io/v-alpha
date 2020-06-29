const MarketplaceComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Marketplace Plugin
   *
   */

  'use strict';

  function handleProfileDraw() {
    const path = this;
    V.setState( 'active', { navItem: path } );
    V.setBrowserHistory( path );
    Profile.draw( path );
  }

  const background = ( cardData ) => {
    const sc = V.getState( 'screen' );
    const palette = ['rgba(' + sc.brandSecondary + ', 1)'];

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

  function castCircle( circleData ) {
    const backgr = background( circleData );
    return V.cN( {
      t: 'div',
      c: 'circle-3 flex justify-center items-center rounded-full cursor-pointer',
      a: {
        style: `background:${backgr}; background-position: center center; background-size: cover;margin: 0 auto;`
      },
      h: {
        t: 'div',
        c: 'card__initials font-bold fs-xl txt-white',
        h: backgr.includes( 'url' ) ? '' : V.castInitials( circleData.profile.title )
      },
      e: {
        click: handleProfileDraw.bind( circleData.path )
      }
    } );
  }

  function entitiesSmallCard( cardData ) {
    return V.cN( {
      t: 'li',
      c: 'pxy',
      h: {
        t: 'smallcard',
        c: 'smallcard__container txt-center rounded bkg-white',
        h: castCircle( cardData )
      }
    } );
  }

  function entitiesPlaceholder() {
    return V.cN( {
      t: 'li',
      c: 'pxy',
      h: {
        t: 'smallcard',
        c: 'smallcard__container txt-center rounded bkg-white',
        h: V.cN( {
          t: 'div',
          c: 'circle-3 rounded-full animated-background',
          // a: {
          //   style: `background:${backgr}; background-position: center center; background-size: cover;margin: 0 auto;`
          // },
        } )
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
      h: castCircle( cardData ),
      k: handleProfileDraw.bind( cardData.path )
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
          k: handleProfileDraw.bind( cardData.path )
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
        { t: 'p', c: 'capitalize', h: cardData.profile.role },
        { t: 'p', h: cardData.properties && cardData.properties.description ? cardData.properties.description.substr( 0, 160 ) : '' },
        { t: 'p', h: cardData.properties && cardData.properties.baseLocation ? cardData.properties.baseLocation : '' }
      ],
      k: handleProfileDraw.bind( cardData.path )
    } );

    V.setNode( $cardContentFrame, [ $topLeft, $topRight, $bottomLeft, $bottomRight ] );

    return $cardContentFrame;

  }

  return {
    castCircle: castCircle,
    entitiesSmallCard: entitiesSmallCard,
    entitiesPlaceholder: entitiesPlaceholder,
    cardContent: cardContent,
  };

} )();
