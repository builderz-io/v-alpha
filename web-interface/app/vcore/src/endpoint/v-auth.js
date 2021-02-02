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
    console.log( 666, 'fetchAuth' );
    const queryA = `mutation SetEntityAuth {
            setAuth { jwt }
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
    } )
      .then( r => r.json() );
  }

  /* ================== public methods ================== */

  function setAuth( whichUphrase ) {

    uPhrase = whichUphrase;

    fetchAuth().then( res => {
      V.setJwt( res.data.setAuth.jwt );
    } );
  }

  /* ====================== export ====================== */

  V.setAuth = setAuth;

  return {
    setAuth: setAuth,
  };

} )();
