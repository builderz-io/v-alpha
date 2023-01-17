const JoinRoutine = ( function() { // eslint-disable-line no-unused-vars
  /**
     * V Theme Module for join routine
     *
     */

  'use strict';

  const settings = {
    defaultSet: 2,
    defaultPrivacy: V.getSetting( 'defaultPrivacy' ),
  };

  const devModeNames = ['Pat', 'Peter', 'Paul', 'Mary', 'Jane', 'Chris', 'Alex', 'Otto', 'Miranda', 'Sunak'];

  let entityData = {};

  let cardSet, fourDigitString, newEntity, uPhrase, address, privKey, fullId, role, cardIndex = 0;

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {
      isConfirmCode: 'is the confirmation code',
      download: 'Download',
      downloadAgain: 'Download again',
      callToAction: '🎉  Ready! Go create!',
      authFail: 'Auth failed. Copy the key shown hidden above, reload and join manually.',
      startAgain: 'Please reload and join again.',

      joinSuccessTop: 'Done! The identity was successfully set up.',
      joinSuccessBottom: 'Please download the access key.',
      joinFailTop: 'Eeeeek, problem.',

      joinResLoc: 'Please add the continent at least',
      joinResNoLat: 'We couldn\'t find this location. Please select from the list or clear the entry to continue',
      joinResNoLatPick: 'Please pick the location',
      joinResImg: 'Please choose an avatar at least',
      joinResEmail: 'Please add a valid email address',
      joinResEmailConfirm: 'Please enter the 4-digit code we sent',
      joinResEmailConfirmFalse: '4-digit code does not match',
    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ============= card sets ============= */

  const x = JoinComponents;

  const cardSets = {
    set1: [
      x.joinName,
      undefined,
      undefined,
      x.joinLocation,
      undefined,
      undefined,
      x.joinImage,
      x.joinEmail,
      x.joinAwaitKey,
    ],
    set2: [
      x.joinTitle,
      x.joinDescription,
      x.joinTarget,
      x.joinLocation,
      undefined,
      undefined,
      x.joinImage,
      undefined,
      x.joinAwaitKey,
    ],
    set3: [
      x.joinTitle,
      x.joinDescription,
      x.joinTarget,
      x.joinLocation,
      undefined,
      x.joinDateTime,
      x.joinImage,
      undefined,
      x.joinAwaitKey,
    ],
    set4: [
      x.joinTitle,
      undefined,
      undefined,
      undefined,
      x.joinLocationPicker,
      undefined,
      undefined,
      undefined,
      x.joinAwaitKey,
    ],
    set5: [
      x.joinTitle,
      x.joinDescription,
      undefined,
      x.joinLocation,
      undefined,
      undefined,
      x.joinImage,
      undefined,
      x.joinAwaitKey,
    ],
  };

  /* ================== event handlers ================== */

  function handleNext() {
    // console.log( cardIndex, entityData.role, cardSets[cardSet][cardIndex] );

    /**
     * return early if cardIndex == 8 (join routine finished successfully)
     * OR validaton in advanceCard failed
     */

    if (
      cardIndex == 9
    ) {
      V.sN( 'joinoverlay', 'clear' );
      return;
    }

    if (
      !advanceCard()
    ) {
      return;
    }

    /* advance card index */
    cardIndex += 1;

    /* skip undefined cards */
    if ( !cardSets[cardSet][cardIndex] ) {
      handleNext();
      return;
    }

    /**
     * skip email by bumping up the cardIndex
     * if askforEmail is set to false OR entity is not a person
     */

    if (
      cardIndex == 7
      && ( !V.getSetting( 'askforEmail' )
       || entityData.role != 'Person' )
    ) {
      cardIndex += 1;
    }

    /* draw new card */
    V.gN( '.join-card' ).classList.remove( 'join-card-extended' );
    V.sN( '.join-card-inner-wrapper', 'clear' );
    V.sN( '.join-card', drawOverlayContent() );

    /* add Google Places API to location card */
    if ( cardIndex == 3 ) {
      Google.initAutocomplete( 'join-form' );
    }

    /* add picker to location-picker card */
    if ( cardIndex == 4 ) {
      V.gN( '.join-card' ).classList.add( 'join-card-extended' );
      setTimeout( function delayedDrawLocPicker() {
        $( '.join-loc-picker__input' ).leafletLocationPicker( {
          alwaysOpen: true,
          mapContainer: '.join-loc-picker__map',
          height: Math.floor( V.getState( 'screen' ).height * 0.5 ),
          map: {
            zoom: 4,
            center: L.latLng( [ 51.376067, 9.84375 ] ),
            zoomControl: false,
            attributionControl: false,
          },
          onChangeLocation: function pickedLocation( data ) {
            setResponse( '', 'setAsIs' );

            entityData.location = 'picked location';
            entityData.lat = data.latlng.lat;
            entityData.lng = data.latlng.lng;
          },
        } );
      }, 350 );
    }

    /* set the new human entity on "download key" card */
    else if ( cardIndex == 8 ) {
      if ( !V.getSetting( 'devMode' ) ) {
        V.gN( 'joinoverlay' ).removeEventListener( 'click', JoinComponents.handleJoinOverlayClick );
      }
      drawAltSubmitBtn( 'call-to-action' );
      setNewEntity();
    }
  }

  function handleSaveKey() {
    const text = `
Key: ${ this.uPhrase }\n\n
EVM Address: ${ this.address }\n\n
EVM key: ${ this.privKey || 'SELF' }\n\n
Title: ${ this.fullId }\n\n
Role: ${ this.role }\n\n
Joined: ${ new Date().toString().substr( 4, 17 ) }\n\n
Initialized by: ${ window.location.host }
`;

    const blob = new Blob( [text], { type: 'text/plain' } );

    const $a = document.createElement( 'a' );
    $a.download = this.fullId + ' __key.txt'; // + window.location.hostname
    $a.href = window.URL.createObjectURL( blob );
    $a.click();

    V.setNode( '.join-download__btn', InteractionComponents.confirmClickSpinner() );

    setTimeout( delayCallToActionBtn.bind( { fullId: this.fullId } ), 1200 );
  }

  function delayCallToActionBtn() {
    V.gN( '.join-download__btn' ).innerText = V.getString( ui.downloadAgain );
    V.gN( '.join-submit__btn' ).classList.remove( 'hidden' );
    V.gN( '.join-submit__btn' ).addEventListener( 'click', reloadOnCallToActionBtn.bind( { fullId: this.fullId } ) );
  }

  function reloadOnCallToActionBtn() {
    // location = window.location.origin + V.castPathOrId( this.fullId );
  }

  /* ================== private methods ================= */

  function advanceCard() {

    /**
     * For each card: validate user input, then either
     * a) set user's choices into entityData object for use in setNewEntity and
     *    return true to advance to the next card OR
     * b) give feedback to user and return false to stop advancing to the next card
     *
     */

    /* validate undefined cards as true (skip) */
    if ( !cardSets[cardSet][cardIndex] ) {
      return true;
    }

    /* name */
    if ( cardIndex == 0 ) {
      const input = V.getNode( '.join-form__input' ).value;
      const title = V.castEntityTitle( input, 'Person' ); // validation of the title

      if ( title.success ) {
        entityData.title = title.data[0];
        return true;
      }
      else if ( V.getSetting( 'devMode' ) ) {
        V.getNode( '.join-form__input' ).value = devModeNames[V.castRandomInt( 0, devModeNames.length - 1 )];
      }
      else {
        setResponse( title.message, 'setAsIs' );
        return false;
      }
    }

    /* description */
    else if ( cardIndex == 1 ) {
      const descr = V.getNode( '.join-form__descr' ).value;
      if ( descr ) {
        entityData.description = V.getNode( '.join-form__descr' ).value;
      }
      return true;
    }

    /* target & unit */
    else if ( cardIndex == 2 ) {
      const trgt = V.getNode( '.join-form__input' ).value;
      const unit = V.getNode( '.join-form__input-unit' ).value;

      const target = V.castTarget( trgt, unit, entityData.role );

      if ( target.success ) {
        entityData.target = trgt;
        entityData.unit = unit;
        return true;
      }
      else {
        setResponse( target.message, 'setAsIs' );
        return false;
      }
    }

    /* location */
    else if ( cardIndex == 3 ) {
      const $location = V.getNode( '.join-form__loc' );
      const hasLoc = $location.getAttribute( 'loc' );
      const hasLat = $location.getAttribute( 'lat' );
      const hasLng = $location.getAttribute( 'lng' );
      const hasRadio = getRadioIndex( 'continent' );

      if (
        hasLat
        && $location.value
      ) {
        entityData.location = hasLoc;
        entityData.lat = hasLat;
        entityData.lng = hasLng;

        return true;
      }
      else if ( hasRadio ) {
        entityData.continent = hasRadio;
        return true;
      }
      else if ( $location.value ) {
        setResponse( 'joinResNoLat' );
        return false;
      }
      else if ( V.getNode( '.join-selectors' ).style.display == 'block' ) {
        const int = V.getSetting( 'devMode' ) ? 3 : V.castRandomInt( 0, 6 );
        document.getElementById( 'join-selector__cont' + int ).checked = true;
      }
      else {
        setResponse( 'joinResLoc' );
        setSelectors();
        return false;
      }
    }

    /* location picker */
    else if ( cardIndex == 4 ) {
      if (
        entityData.lat
      ) {
        return true;
      }
      else {
        setResponse( 'joinResNoLatPick' );
        return false;
      }
    }

    /* date & time */
    else if ( cardIndex == 5 ) {
      return true;
    }

    /* image */
    else if ( cardIndex == 6 ) {
      const hasImage = V.getState( 'mediumImageUpload' );

      if ( hasImage ) {

        /**
         * the image and its sizes are taken from
         * the app state directly in castEntity in v-entity.js,
         * no need to add them to the entityData object
         */
        return true;
      }
      else if (
        V.getVisibility( '.join-selectors' )
      ) {
        entityData.avatar = getRadioIndex( 'avatar' );
        return true;
      }
      else {
        setResponse( 'joinResImg' );
        setSelectors();
        return false;
      }
    }

    /* email */
    else if ( cardIndex == 7 ) {
      const confirm = V.getNode( '.join-form__input-confirm' ).value;

      if ( confirm ) {
        if ( confirm == fourDigitString ) {
          return true;
        }
        else {
          setResponse( 'joinResEmailConfirmFalse' );
          return false;
        }
      }

      const input = V.getNode( '.join-form__input' ).value;

      /* basic validation of the email syntax */
      const email = V.isEmail( input );

      if ( input ) {
        if( email && V.getSetting( 'confirmEmail' ) ) {
          entityData.emailPrivate = input;
          confirmEmail();
          return false;
        }
        else if ( email ) {
          entityData.emailPrivate = input;
          return true;
        }
        else {
          setResponse( 'joinResEmail' );
          return false;
        }
      }
      else {
        if( V.getSetting( 'requireEmail' ) ) {
          setResponse( 'joinResEmail' );
          return false;
        }
        else {
          return true;
        }
      }
    }

    /* call to action */
    else if ( cardIndex == 8 ) {
      return true;
    }
  }

  function setResponse( which, setAsIs ) {
    V.getNode( '.join-submit__response' ).innerText = V.getString( setAsIs ? which : ui[which] );
  }

  function setSelectors() {
    V.getNode( '.join-selectors' ).style.display = 'block';
  }

  function getRadioIndex( whichForm ) {
    return Number( document.forms[ whichForm + 's'].elements[ whichForm ].value );
  }

  function confirmEmail() {
    setResponse( '', 'setAsIs' );
    V.getNode( '.join-submit__btn' ).append( InteractionComponents.confirmClickSpinner() );

    fourDigitString = V.castTag().replace( '#', '' );

    if ( V.getSetting( 'devMode' ) ) {
      setTimeout( function devModeConfirm() {
        V.getNode( '.join-form__confirm' ).style.display = 'block';
        V.setNode( '.confirm-click-spinner', 'clear' );
        setResponse( 'this is devMode: use ' + fourDigitString, 'setAsIs' );
      }, 2000 );
    }
    else {
      V.setEmailNotification( {
        recipient: entityData.emailPrivate,
        subject: window.location.hostname + ': '  + fourDigitString + ' ' + V.getString( ui.isConfirmCode ),
        msg: window.location.hostname + ': '  + fourDigitString + ' ' + V.getString( ui.isConfirmCode ),
      } )
        .then( res => {
          console.log( res );
          V.setNode( '.confirm-click-spinner', 'clear' );
          if (
            res.success
            && res.data[0].accepted
          ) {
            V.getNode( '.join-form__confirm' ).style.display = 'block';
            setResponse( 'joinResEmailConfirm' );
          }
          else {
            setResponse( res.data[0].response, 'setAsIs' );
          }
        } );
    }
  }

  function setNewEntity() {
    // entityData.title = '1234'; // uncomment for testing a server error

    // if (
    //   'Person' == entityData.role
    //   && V.cA()
    // ) {
    //
    //   /*
    //    * user has own wallet,
    //    * also used in v-entity to detect need for private key creation
    //    */
    //   entityData.evmAddress = V.cA();
    // }

    V.setEntity( entityData )
      .then( res => {
        if ( res.success ) {
          console.log( 'successfully set entity: ', res );

          newEntity = res.data[0];
          uPhrase = newEntity.auth.uPhrase;
          address = newEntity.auth.evmCredentials.address;
          privKey = newEntity.auth.evmCredentials.privateKey;
          fullId = newEntity.fullId;
          role = newEntity.role;

          /** Clear cache to force reload users profile */
          V.setCache( 'viewed', 'clear' );

          /** Prepare map position & draw map */
          V.setState( 'active', {
            lastLngLat: newEntity.geometry.coordinates,
          } );
          VMap.draw( res.data, { isJoin: true } );

          /** Place navigation pill */
          Navigation.drawEntityNavPill( newEntity );

          if ( role != 'Person' ) {
            drawSuccess();
            notifySuccess( fullId, role );
            setDownloadKeyBtn();
            return;
          }

          /** Automatically join */
          V.setAuth( uPhrase )
            .then( data => {
              console.log( data );
              if ( data.success ) {
                console.log( 'auth success' );

                /** Set active entity state for user */
                V.setActiveEntity( newEntity );
                Join.draw( 'new entity was set up' );

                drawSuccess();
                notifySuccess( fullId, role );
                setDownloadKeyBtn();
              }
              else {
                throw new Error( 'could not set auth after setting new entity' );
              }
            } )
            .catch( err => {
              console.log( err );
              notifyError( err.message || err );
              setResponse( 'authFail' );
              drawUphraseDisplay( uPhrase );
            } );
        }
        else {
          throw new Error( res.message );
        }
      } )
      .catch( res => {
        console.log( 'could not set entity: ', res );
        notifyError( res.message || res );
        setResponse( ( res.message || res ) + ' ' + V.getString( ui.startAgain ), 'setAsIs' );
        drawError();
      } );
  }

  function setDownloadKeyBtn() {
    const $btn = V.gN( '.join-download__btn' );
    $btn.innerText = V.getString( ui.download );
    $btn.addEventListener( 'click', handleSaveKey.bind( {
      uPhrase: uPhrase,
      address: address,
      privKey: privKey,
      fullId: fullId,
      role: role,
    } ) );
  }

  function drawUphraseDisplay( uPhrase ) {
    V.sN( '.join-download__btn', 'clear' );
    V.sN( '.join-header__top', V.getString( ui.joinFailTop ) );
    V.sN( '.join-header__bottom', V.cN( {
      t: 'input',
      a: {
        value: uPhrase,
        type: 'password',
      },
      e: {
        focus: Join.handleViewFirstKeyFocus,
        blur: Join.handleViewFirstKeyFocus,
      },
    } ) );
  }

  function drawSuccess() {
    V.sN( '.join-header__top', V.getString( ui.joinSuccessTop ) );
    V.sN( '.join-header__bottom', V.getString( ui.joinSuccessBottom ) );
  }

  function drawError() {
    V.sN( '.join-header__top', V.getString( ui.joinFailTop ) );
    V.sN( '.join-download__btn', 'clear' );
  }

  function drawAltSubmitBtn( which ) {
    const $submitBtn = V.gN( '.join-submit__btn' );
    // const $submitSkip = V.gN( '.join-submit__skip' );
    if ( 'call-to-action' == which ) {
      $submitBtn.classList.add( 'hidden', 'bkg-brand-secondary', 'txt-offblack' );
      // $submitSkip.classList.add( 'hidden' );
      $submitBtn.innerText = V.getString( ui.callToAction );
    }
  }

  function notifySuccess( fullId, role ) {
    const data = {
      act: 'New join',
      msg: 'The '
        + role.toLowerCase()
        + ' '
        + fullId
        + ( role == 'Person' ? ' just joined.' : ' was just created.' ),
    };
    V.setEmailNotification( data );
    V.setTelegramNotification( data );
  }

  function notifyError( error ) {
    const data = {
      act: 'New join [ERROR]',
      msg: typeof error == 'object' ? JSON.stringify( error ) : error,
    };
    V.setEmailNotification( data );
    V.setTelegramNotification( data );
  }

  function drawOverlay( use ) {
    if ( !use ) { return }

    if (
      use.role != 'Person'
      && !V.aE()
    ) {
      Modal.draw( 'join first' );
      return;
    }

    cardSet = 'set' + ( use.join || settings.defaultSet );
    cardIndex = 0;

    entityData.role = use.role;
    entityData.privacy = ( use.privacy == 0 ? undefined : use.privacy )
                         || ( settings.defaultPrivacy == 0 ? undefined : settings.defaultPrivacy );

    /* Launch Google Places API */
    Google.launch();

    /* Return overlay with correct card */
    return JoinComponents.joinOverlay( cardSets[cardSet][cardIndex] );
  }

  function drawOverlayContent() {

    /* Return overlay with correct card */
    return JoinComponents.joinOverlayContent( cardSets[cardSet][cardIndex] );
  }

  /* ================  public methods ================ */

  function draw( use ) {
    return drawOverlay( use );
  }

  function reset() {
    cardIndex = 0;
    entityData = {};
  }

  /* ====================== export ====================== */

  return {
    draw: draw,
    reset: reset,

    handleNext: handleNext,
  };
} )();
