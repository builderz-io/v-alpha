const DataComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * Components for V Data Plugin
   *
   */

  'use strict';

  function weatherCard( cardData, forecastData ) {

    const cardLeftWidth = 25;

    return V.setNode( {
      tag: 'div',
      classes: 'contents',
      setStyle: {
        icon: {
          height: '80px',
          position: 'relative',
          bottom: '3px',
          left: '2px',
        },
        forecast: {
          'width': '57px',
          'text-align': '-moz-center',
        },
      },
      html: '<div class="card__top-left flex justify-center items-center">' +
                '<div class="circle-3 flex justify-center items-center rounded-full" style="background: antiquewhite; background-position: center center; background-size: cover;">' +
                  '<div class="card__initials font-bold fs-xxl txt-white"><img src="' + cardData.iconUrl + '"></div>' +
                '</div>' +
              '</div>' +
              '<div class="card__top-right flex items-center pxy">' +
                '<h2 class="font-bold fs-l leading-snug">' + cardData.place + '</h2>' +
              '</div>' +
              '<div class="card__bottom-left items-center">' +
                '<div class="circle-2 flex justify-center items-center rounded-full border-shadow font-medium no-txt-select">' + cardData.tempC + '</div>' +
                '<p class="card__unit fs-xxs">' + 'Now' + '</p>' +
              '</div>' +
              '<div class="card__bottom-right pxy">' +
                '<div class="flex justify-center items-center">' +
                  '<div class="forecast">' +
                    '<div style="background: antiquewhite;" class="circle-2 flex justify-center items-center rounded-full">' +
                      '<div><img class="icon" src="' + forecastData.iconUrl.hr24  + '"></div>' +
                    '</div>' +
                    '<p class="card__unit fs-xxs">' + forecastData.tempC.hr24 + '</p>' +
                    '<p class="card__unit fs-xxs">' + 'Tomorrow' + '</p>' +
                  '</div>' +
                  '<div class="forecast">' +
                    '<div style="background: antiquewhite;" class="circle-2 flex justify-center items-center rounded-full">' +
                      '<div><img class="icon" src="' + forecastData.iconUrl.hr48  + '"></div>' +
                    '</div>' +
                    '<p class="card__unit fs-xxs">' + forecastData.tempC.hr48 + '</p>' +
                    '<p class="card__unit fs-xxs">' + forecastData.date.hr48 + '</p>' +
                  '</div>' +
                  '<div class="forecast">' +
                    '<div style="background: antiquewhite;" class="circle-2 flex justify-center items-center rounded-full">' +
                      '<div><img class="icon" src="' + forecastData.iconUrl.hr72  + '"></div>' +
                    '</div>' +
                    '<p class="card__unit fs-xxs">' + forecastData.tempC.hr72 + '</p>' +
                    '<p class="card__unit fs-xxs">' + forecastData.date.hr72 + '</p>' +
                  '</div>' +
                  '<div class="forecast">' +
                    '<div style="background: antiquewhite;" class="circle-2 flex justify-center items-center rounded-full">' +
                      '<div><img class="icon" src="' + forecastData.iconUrl.hr96  + '"></div>' +
                    '</div>' +
                    '<p class="card__unit fs-xxs">' + forecastData.tempC.hr96 + '</p>' +
                    '<p class="card__unit fs-xxs">' + forecastData.date.hr96 + '</p>' +
                  '</div>' +
                '</div>' +
      // '<p>' + cardData.sunrise + '<br/>' + cardData.sunset + '</p>' +
              '</div>',
    } );
  }

  function airCard( cardData ) {

    const aColors = {
      green: '#00E400',
      yellow: '#FFFF00',
      orange: '#FF7E00',
      red: '#FF0000',
      purple: 'rgb(143, 63, 151)',
      maroon: '#7E0023',
    };

    const aConcern = {
      m50: 'Good',
      m100: 'Moderate',
      m150: 'Unhealthy for Sensitive Groups',
      m200: 'Unhealthy',
      m300: 'Very Unhealthy',
      m500: 'Hazardous',
    };

    const level = ( value ) => {
      if ( value <= 50 ) {
        return { c: aColors.green, h: aConcern.m50 };
      }
      else if ( value <= 100 ) {
        return { c: aColors.yellow, h: aConcern.m100 };
      }
      else if ( value <= 150 ) {
        return { c: aColors.orange, h: aConcern.m150 };
      }
      else if ( value <= 200 ) {
        return { c: aColors.red, h: aConcern.m200 };
      }
      else if ( value <= 300 ) {
        return { c: aColors.purple, h: aConcern.m300 };
      }
      else if ( value <= 500 ) {
        return { c: aColors.maroon, h: aConcern.m500 };
      }
    };

    const cardLeftWidth = 25;

    return V.setNode( {
      tag: 'div',
      classes: 'contents',
      setStyle: {
        icon: {
          height: '80px',
          position: 'relative',
          bottom: '3px',
          left: '2px',
        },
        forecast: {
          'width': '57px',
          'text-align': '-moz-center',
        },
      },
      html: '<div class="card__top-left flex justify-center items-center">' +
                '<div class="circle-2 flex justify-center items-center rounded-full" style="background-color: ' + level( cardData.pollution.aqius ).c + ';background-position: center center; background-size: cover;">' +
                '</div>' +
              '</div>' +
              '<div class="card__top-right flex items-center pxy">' +
                '<h2 class="font-bold fs-l leading-snug">' + cardData.city + '</h2>' +
              '</div>' +
              '<div class="card__bottom-left items-center">' +
                '<div class="circle-2 flex justify-center items-center rounded-full border-shadow font-medium no-txt-select">' + cardData.pollution.aqius + '</div>' +
                '<p class="card__unit fs-xxs">' + 'US AQI' + '</p>' +
              '</div>' +
              '<div class="card__bottom-right pxy">' +
                '<p>' + level( cardData.pollution.aqius ).h + '</p>' +
              '</div>',
    } );
  }

  return {
    weatherCard: weatherCard,
    airCard: airCard,
  };

} )();
