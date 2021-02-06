const VAuth = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to manage auth
   *
   */

  'use strict';

  const settings = {
    // firebaseEndpoint: 'https://us-central1-entity-namespace.cloudfunctions.net/api/getSessionToken',
    firebaseEndpoint: 'http://localhost:5001/entity-namespace/us-central1/api/v1',
  };

  let uPhrase;

  /* ================== private methods ================= */

  function fetchAuth() {
    const queryA = `mutation SetEntityAuth {
            setAuth { success message uuidE exp jwt }
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
      },
      body: JSON.stringify( {
        query,
        variables: variables,
      } ),
      credentials: 'include',
    } )
      .then( r => r.json() );
  }

  /* ================== public methods ================== */

  function setDisconnect() {
    console.log( 777, 'setDisconnect' );

    const queryD = `mutation SetDisconnect {
            setDisconnect { success }
          }`;

    return fetchFirebase( queryD );
  }

  async function setAuth( whichUphrase ) {
    console.log( 888, 'setAuth' );

    uPhrase = whichUphrase;

    const data = await fetchAuth().then( res => {
      if ( res.data.setAuth.success ) {

        /** Set JWT for Authorization header */
        V.setJwt( res.data.setAuth.jwt );

        /** Renew JWT before expiration */
        setTimeout( setAuth, ( res.data.setAuth.exp * 0.95 ) * 1000 );

        /** return the setAuth object (mainly to get uuidE) */
        return V.successTrue( 'set auth', res.data.setAuth );
      }
      else {
        return V.successFalse( 'set auth', res.data.setAuth.message );
      }
    } );

    return data;
  }

  /* ====================== export ====================== */

  V.setAuth = setAuth;
  V.setDisconnect = setDisconnect;

  return {
    setAuth: setAuth,
    setDisconnect: setDisconnect,
  };

} )();
