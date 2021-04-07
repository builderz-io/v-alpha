const VDescription = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to create an "intelligent description"
   *
   */

  'use strict';

  const settings = {
    maxTextLength: 2000, // including links
    maxIntroLength: 200, // including links
    maxLinkCount: 12,
    maxVideoIframeCount: 3, // including featured
    maxPodcastIframeCount: 2,
    videoMatches: 'youtu|vimeo',
    socialMatches: 'facebook|twitter|linkedin|t.me|medium|instagram|tiktok',
  };

  let items;

  let feature,
    charCount,
    linkCount,
    videoIframeCount,
    podcastIframeCount;

  let $intro,
    $description,
    $paragraph,
    $socialUl,
    $feature;

  /* ================== private methods ================= */

  function setupModule() {
    items = [];

    feature = false;
    charCount = 0;
    linkCount = 0;
    videoIframeCount = 0;
    podcastIframeCount = 0;

    $intro = V.cN( {
      t: 'div',
      c: 'intro',
    } );

    $description = V.cN( {
      t: 'div',
      c: 'description',
    } );

    $paragraph = V.cN( {
      t: 'p',
      c: 'paragraph pb-r',
    } );

    $socialUl = V.cN( {
      t: 'ul',
      c: 'social-links flex overflow-x-scroll list-none pt-rr pb-rr',
    } );

    $feature = undefined;
  }

  function castItemsArray( which ) {

    const text = ( ' ' + which ).slice( 1 );

    /**
     * Find links and ignore some common sentence endings
     * TODO: ignore "." here also and not in for loop
     */

    const linksFound = text.match( /(?:www|https?)[^\s!?,]+/gi );

    /**  If no links were found, just add paragraphs */

    if ( !linksFound ) {
      addParagraphEnds( text );
      items.push( 'pEnd' );
      return;
    }

    /**
     * If links were found, split text into "items"
     * (text parts, links and paragraph-end flags)
     */

    let arrayBuffer;

    for ( let i = 0; i < linksFound.length; i++ ) {

      /** ignore "." and "..." sentence ending */
      if ( linksFound[i].substr( -1 ) == '.' ) {
        linksFound[i] = linksFound[i].slice( 0, -1 ).replace( '..', '' );
      }

      if ( i == 0 ) {
        arrayBuffer = text.split( linksFound[i] );
      }
      else {
        const last = arrayBuffer.pop();
        arrayBuffer = last.split( linksFound[i] );
      }

      addParagraphEnds( arrayBuffer[0] );

      items.push( linksFound[i] );

    }

    addParagraphEnds( arrayBuffer[1] );

    items.push( 'pEnd' );

  // console.log('items', items);

  }

  function castFromItemsArray( items ) {
    for ( let i = 0; i < items.length; i++ ) {

      if ( items[i] == '' || items[i] > settings.maxTextLength ) {
        continue;
      }
      else if ( items[i] == 'pEnd' || charCount > settings.maxTextLength ) {
        if ( charCount > settings.maxTextLength ) {
          $paragraph.appendChild( castSpan( '*text shortened*' ) );
        }
        if ( $paragraph.childNodes.length ) {

          /** append the paragraph to description and reset the paragraph */
          $description.appendChild( $paragraph );
          $paragraph = V.cN( {
            t: 'p',
            c: 'paragraph pb-r',
          } );
        }
        if ( charCount > settings.maxTextLength ) {
          break;
        }
        else {
          continue;
        }
      }
      placeNodes( items[i] );
      charCount += items[i].length;
    }
  }

  function castIntroFromItemsArray( items ) {

    /** reset */
    charCount = 0;
    $paragraph = V.cN( {
      t: 'p',
      c: 'paragraph pb-r',
    } );

    for ( let i = 0; i < items.length; i++ ) {
      if ( items[i] == 'pEnd' || charCount > settings.maxIntroLength ) {
        break;
      }
      if ( items[i] == '' || items[i] > settings.maxIntroLength ) {
        continue;
      }
      placeNodes( items[i], 'isIntro' );
      charCount += items[i].length;
    }

    $intro.appendChild( $paragraph );

  }

  function placeNodes( item, isIntro ) {

    /** append nodes to paragraph, feature or social ul as per item type */

    if ( !['http', 'www.'].includes( item.toLowerCase().substr( 0, 4 ) ) ) {
      const $span = castSpan( item );
      $span ? $paragraph.appendChild( $span ) : null;
      return;
    }

    linkCount += 1;

    if ( linkCount > settings.maxLinkCount ) {
      $paragraph.appendChild( castSpan( '*link omitted (max links)*' ) );
      return;
    }

    const link = item.toLowerCase().substr( 0, 4 ) == 'www.' ? 'https://' + item : item;

    let host = link.split( '/' )[2];
    host = host.replace( 'www.', '' );

    if ( isIntro ) {
      $paragraph.appendChild( castRegularLink( link, host ) );
    }
    else if ( host.match( new RegExp( settings.socialMatches ) ) ) {
      $socialUl.appendChild( castSocialLinkImg( link, host ) );
    }
    else if ( host.match( new RegExp( settings.videoMatches ) ) ) {

      videoIframeCount += 1;

      const $iframe = host.includes( 'youtu' )
        ? castYouTubeIframe( link )
        : castVimeoIframe( link );

      if ( videoIframeCount <= settings.maxVideoIframeCount ) {
        setFeature( $iframe, link, host );
      }
      else {
        $paragraph.appendChild( castRegularLink( link, host ) );
      }
    }
    else if ( host.match( /soundcloud/ ) ) {
      const scId = link.split( '/' ).pop(); // example 933028357
      if ( isNaN( scId ) || podcastIframeCount >= settings.maxPodcastIframeCount ) {
        $paragraph.appendChild( castRegularLink( link, host ) );
      }
      else {
        podcastIframeCount += 1;

        const $iframe = castSoundcloudIframe( scId );
        setFeature( $iframe, link, host );
      }
    }
    else {
      $paragraph.appendChild( castRegularLink( link, host ) );
    }
  }

  function addParagraphEnds( item ) {
    if ( item.includes( '\n\n' ) ) {
      const split = item.split( '\n\n' );
      for ( let i = 0; i < split.length; i++ ) {
        items.push( split[i] );
        if ( i != split.length - 1 ) {
          items.push( 'pEnd' );
        }
      }
    }
    else {
      items.push( item );
    }
  }

  function setFeature( $iframe, link, host ) {
    if ( !feature ) {
      feature = true;
      $feature = $iframe;
      $paragraph.appendChild( castRegularLink( link, host ) );
      $paragraph.appendChild( castSpan( ' *featured above*' ) );
    }
    else {
      $paragraph.appendChild( $iframe );
    }
  }

  function castSpan( text ) {
    if ( text.match( /^\s{2,}$/ ) ) {
      return false;
    }
    return V.cN( {
      t: 'span',
      h: text,
    } );
  }

  function castRegularLink( link, host ) {
    return V.cN( {
      t: 'a',
      f: link,
      h: host,
    } );
  }

  function castSocialLinkImg( link, host ) {
    // const anchorText = link.split( '/' ).pop();
    return V.cN( {
      t: 'li',
      c: 'mr-s',
      h: {
        t: 'a',
        f: link,
        h: V.getIcon( host.match( new RegExp( settings.socialMatches ) )[0] ),
      },
    } );
  }

  function castYouTubeIframe( link ) {
  // fluid width video: https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
    const youtubeId = link.split( '/' ).pop();
    return V.cN( {
      t: 'div',
      c: 'iframe-wrapper w-full',
      h: {
        t: 'iframe',
        r: 'https://www.youtube.com/embed/' + youtubeId,
        a: {
          frameborder: '0',
          allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen;',
          allowfullscreen: 'allowfullscreen',
        },
      },
    } );
  }

  function castVimeoIframe( link ) {
    const vimeoId = link.split( '/' ).pop();
    return V.cN( {
      t: 'div',
      c: 'iframe-wrapper w-full',
      h: {
        t: 'iframe',
        r: 'https://player.vimeo.com/video/' + vimeoId + '?color=ffffff&title=0&byline=0&portrait=0',
        a: {
          frameborder: '0',
          allow: 'autoplay; fullscreen',
          allowfullscreen: 'allowfullscreen',
        },
      },
    } );
  }

  function castSoundcloudIframe( scId ) {
    return V.cN( {
      t: 'div',
      c: 'iframe-wrapper w-full',
      h: {
        t: 'iframe',
        r: `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${ scId }&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`,
        a: {
          width: '100%',
          height: '166',
          scrolling: 'no',
          frameborder: 'no',
          allow: 'autoplay',
        },
      },
    } );
  }

  /* ================== public methods ================== */

  function castDescription( whichText ) {
    setupModule();
    castItemsArray( whichText );
    castFromItemsArray( items );
    castIntroFromItemsArray( items );

    return {
      $feature: $feature || false,
      $description: $description,
      $socialUl: $socialUl,
      $intro: $intro,
    };

  }

  /* ====================== export ====================== */

  V.castDescription = castDescription;

  return {
    castDescription: castDescription,
  };

} )();
