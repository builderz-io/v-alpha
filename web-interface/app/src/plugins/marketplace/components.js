const MarketplaceComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for Marketplace Plugin
   *
   */

  'use strict';

  // const palette = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc']; // https://colorhunt.co/palette/167860
  const palette = ['#d1d2da', '#3a0088', '#930077', '#e61c5d', '#ffbd39']; // https://colorhunt.co/palette/108152

  const background = ( cardData ) => {
    if ( cardData.image != undefined ) {
      return 'url(\'' + cardData.image + '\')';
    }

    switch ( cardData.profile.tag.charAt( 1 ) ) {
    // case '1': return palette[0];
    case '2': return palette[0];
    case '3': return palette[0];
    // case '4': return palette[1];
    case '5': return palette[0];
    case '6': return palette[0];
    // case '7': return palette[2];
    case '8': return palette[0];
    case '9': return palette[0];
    }
  };

  const initials = ( cardData ) => {
    if ( cardData.image != undefined ) {
      return '';
    }
    return V.castInitials( cardData.profile.title );
  };

  function entitiesSmallCard( cardData ) {
    return V.castNode( {
      tag: 'li',
      classes: 'pxy',
      html: `<smallcard class="smallcard__container flex rounded bkg-white pxy">
              <a href="#" target="_blank">
                <div class="circle-3 rounded-full flex justify-center items-center" style="background:${background( cardData )}; background-position: center center; background-size: cover;">
                  <div class="card__initials font-bold fs-xxl txt-white">${initials( cardData ) }</div>
                </div>
              </a>
            </smallcard>`
    } );
  }

  function cardContent( cardData ) {
    return V.castNode( {
      tag: 'div',
      c: 'contents',
      html: `<div class="card__top-left flex justify-center items-center pxy">
                <div class="circle-3 flex justify-center items-center rounded-full"
                     style="background: ${background( cardData )}; background-position: center center; background-size: cover;">
                  <div class="card__initials font-bold fs-xxl txt-white">${initials( cardData )}</div>
                </div>
              </div>
              <div class="card__top-right flex items-center pxy">
                <h2 class="font-bold fs-l leading-snug">${cardData.fullId}</h2>
              </div>
              <div class="card__bottom-left items-center pxy">
                <div class="circle-2 flex justify-center items-center rounded-full border-blackalpha font-medium no-txt-select">${( cardData.properties.target == 0 ? 'free' : cardData.properties.target )}</div>
                <p class="card__unit fs-xxs"> V per ${( cardData.properties.unit == 'free' ? '' : cardData.properties.unit )}</p>
              </div>
              <div class="card__bottom-right pxy">
                <p>${cardData.properties.description}</p>
                <p>in ${cardData.properties.location}</p>
              </div>`
    } );
  }

  return {
    entitiesSmallCard: entitiesSmallCard,
    cardContent: cardContent,
  };

} )();
