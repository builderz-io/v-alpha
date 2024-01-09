const VAuth = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage auth
   *
   */

  'use strict';

  const settings = {
    namespaceEndpoint: V.getSetting( 'namespaceEndpoint' ),
  };

  /* ================== private methods ================= */

  function fetchAuth( uPhrase, creatorUPhrase ) {
    const queryA = `mutation SetEntityAuth {
            setAuth { success message uuidE uuidP exp jwt tempRefresh }
          }`;

    const lastCA = V.getLocal( 'last-connected-address' )
      ? V.getLocal( 'last-connected-address' ).replace( /"/g, '' )
      : undefined;

    const tempRefr = getTempRefreshToken();

    return fetchFirebase( queryA, undefined, uPhrase, creatorUPhrase, lastCA, tempRefr );
  }

  function fetchFirebase( query, variables, uPhrase, creatorUPhrase, lastCA, tempRefr ) {
    return fetch( settings.namespaceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': uPhrase ? 'uPhrase ' + uPhrase : '',
        'Creator-UPhrase': creatorUPhrase ? creatorUPhrase : 'not set',
        'Last-Connected-Address': lastCA ? lastCA : 'not set',
        'Temp-Refresh': tempRefr ? tempRefr : 'not set',
        'Browser-ID': V.getLocal( 'browser-id' ).replace( /"/g, '' ),
      },
      body: JSON.stringify( {
        query,
        variables: variables,
      } ),
      credentials: 'include',
    } )
      .then( r => r.json() );
  }

  function setTempRefreshToken( token ) {
    V.setLocal( 'temp-refresh', token || 'clear' );
  }

  function getTempRefreshToken() {
    const x = V.getLocal( 'temp-refresh' );
    return x ? x.replace( /"/g, '' ) : undefined;
  }

  /* ================== public methods ================== */

  function setDisconnect() {
    console.log( 777, 'setDisconnect' );

    // tempRefresh = getTempRefreshToken();

    const queryD = `mutation SetDisconnect {
            setDisconnect { success }
          }`;

    return fetchFirebase( queryD ).then( () => {
      // if ( res.data.setDisconnect.success ) {
      setTempRefreshToken(); // clears temp_refresh
      V.setLocal( 'last-connected-address', 'clear' );
      V.setLocal( 'welcome-modal', 1 );
      // V.setState( 'activeEntity', 'clear' );
      window.location.href = '/';
      // }
    } );
  }

  async function setAuth( uPhrase, creatorUPhrase ) {
    console.log( 888, 'setAuth' );

    const data = await fetchAuth( uPhrase, creatorUPhrase ).then( res => {

      if ( !res.errors ) {

        /** Set temp refresh token */
        // setTempRefreshToken(); // clears temp_refresh
        setTempRefreshToken( res.data.setAuth.jwt );
        // document.cookie = 'temp_refresh=' + res.data.setAuth.tempRefresh;

        /** Set JWT for Authorization header */
        V.setJwt( res.data.setAuth.jwt );

        /** Renew JWT before expiration */
        // setTimeout( setAuth, /* ( res.data.setAuth.exp * 0.95 ) * 1000 */ 15000 );

        /** return the setAuth object (mainly to get uuidE) */
        return V.successTrue( 'set auth', res.data.setAuth );
      }
      else {
        setTempRefreshToken(); // clears temp_refresh

        return V.successFalse( 'set auth', res.errors[0].message );
      }
    } );

    return data;
  }

  /* ====================== export ====================== */

  V.setAuth = setAuth;
  V.setDisconnect = setDisconnect;
  V.setTempRefreshToken = setTempRefreshToken;

  return {
    setAuth: setAuth,
    setDisconnect: setDisconnect,
    setTempRefreshToken: setTempRefreshToken,
  };

} )();
