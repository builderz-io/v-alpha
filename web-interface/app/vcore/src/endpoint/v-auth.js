const VAuth = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage auth
   *
   */

  'use strict';

  const settings = {
    // firebaseEndpoint: 'http://localhost:5001/entity-namespace/us-central1/api/v1',
    firebaseEndpoint: 'https://us-central1-entity-namespace.cloudfunctions.net/api/v1',
  };

  let uPhrase, lastActiveAddress, tempRefresh;

  /* ================== private methods ================= */

  function fetchAuth() {
    const queryA = `mutation SetEntityAuth {
            setAuth { success message uuidE exp jwt tempRefresh }
          }`;

    return fetchFirebase( queryA );
  }

  function fetchFirebase( query, variables ) {
    return fetch( settings.firebaseEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': uPhrase ? 'uPhrase ' + uPhrase : '',
        'Last-Active-Address': lastActiveAddress ? lastActiveAddress : 'not set',
        'Temp-Refresh': tempRefresh ? tempRefresh : 'not set',
        'Browser-ID': V.getCookie( 'browser-id' ).replace( /"/g, '' ),
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
    V.setCookie( 'temp-refresh', token || 'clear' );
  }

  function getTempRefreshToken() {
    const x = V.getCookie( 'temp-refresh' );
    return x ? x.replace( /"/g, '' ) : undefined;
  }

  /* ================== public methods ================== */

  function setDisconnect() {
    console.log( 777, 'setDisconnect' );

    tempRefresh = getTempRefreshToken();

    const queryD = `mutation SetDisconnect {
            setDisconnect { success }
          }`;

    return fetchFirebase( queryD ).then( () => {
      // if ( res.data.setDisconnect.success ) {
      setTempRefreshToken(); // clears temp_refresh
      V.setCookie( 'last-active-address', 'clear' );
      V.setCookie( 'welcome-modal', 1 );
      // V.setState( 'activeEntity', 'clear' );
      window.location.href = '/';
      // }
    } );
  }

  async function setAuth( whichUphrase ) {
    console.log( 888, 'setAuth' );

    uPhrase = whichUphrase;
    lastActiveAddress = V.getCookie( 'last-active-address' ) ? V.getCookie( 'last-active-address' ).replace( /"/g, '' ) : undefined;
    tempRefresh = getTempRefreshToken();

    const data = await fetchAuth().then( res => {

      if ( !res.errors ) {

        /** Set temp refresh token */
        // setTempRefreshToken(); // clears temp_refresh
        setTempRefreshToken( res.data.setAuth.tempRefresh );
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
