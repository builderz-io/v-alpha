const VFirebase = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to connect to Firebase (Middleware)
   *
   */

  'use strict';

  const activeE = 'a u v e n';
  const activeP = 'a';
  const previewsE = 'a c u v';
  const previewsP = 'a r { a } s { a }';

  /* ================== private methods ================= */

  function setNewEntityNamespace( data ) {

    const a = data.uuidE;
    const b = data.contextE;
    const c = data.typeE;
    const d = data.issuer;
    const e = data.auth;

    const u = data.title;
    const v = data.tag;

    const m = {
      a: data.uuidE,
      m: data.uuidP
    };

    const n = data.evmCredentials.address;

    const y = {
      a: String( data.unix ),
      m: data.statusCode,
      n: data.active,
      z: String( data.expires ),
    };

    const variables = {
      input: {
        a, b, c, d, e, u, v, m, n, y
      }
    };

    /* Full entity set: a b c d e u v w m { a b m } x { a } y { a b m n z } z { a { a b c } } */

    const query = `mutation SetNewEntity( $input: InputEntity! ) {
                setEntity(input: $input) {
                  ${ activeE }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function setNewProfile( data ) {

    const a = data.uuidP;
    const b = data.contextP;

    const m = {
      a: data.uuidE,
    };

    const n = data.evmCredentials.address;

    const r = {
      a: data.props.descr,
      b: data.props.email,
      c: data.props.prefLangs,
      m: data.props.target,
      n: data.props.unit
    };
    const s = {
      a: data.geometry.coordinates,
      b: data.props.baseLocation,
      z: data.geometry.rand
    };
    const t = {
      a: 'some image data string',
      b: 'some image data string',
      c: 'some image data string'
    };

    const y = {
      a: String( data.unix ),
    };

    const variables = {
      input: {
        a, b, m, n, r, s, t, y
      }
    };

    /* Full profile set: a, b, c, d, e, m { a }, r { a b c m n }, s { a b c d z }, t { a b c }, x { a } y { a b } z { a { a b c } } */

    const query = `mutation SetNewProfile( $input: InputProfile! ) {
                setProfile(input: $input) {
                  ${ activeP }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function fetchFirebase( query, variables ) {
    return fetch( 'http://localhost:5001/entity-namespace/us-central1/api/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify( {
        query,
        variables: variables,
      } )
    } )
      .then( r => { return r.json() }
      );
  }

  function castActiveEntityData( E, P ) {
    const fullId = V.castFullId( E.u, E.v );
    return {
      uuidE: E.a,
      uuidP: P.a,
      fullId: fullId,
      path: V.castPathOrId( fullId ),
      private: {
        uPhrase: E.e
      },
      evmCredentials: {
        address: E.n
      },
      // for backwards compatibility
      profile: {
        title: E.u,
        tag: E.v
      }
    };
  }

  function castEntityPreviewData( E, P ) {
    const fullId = V.castFullId( E.u, E.v );
    return {
      uuidE: E.a,
      uuidP: P.a,
      fullId: fullId,
      path: V.castPathOrId( fullId ),
      properties: {
        description: P.r ? P.r.a ? P.r.a : '' : ''
      },
      profile: {
        role: E.c
      },
      geometry: {
        type: 'Point',
        coordinates: P.s.a
      }
    };
  }

  /* ================== public methods ================== */

  function getFirebase( data, whichEndpoint ) {
    let query;
    if ( 'entity by role' == whichEndpoint ) {
      console.log( 111 );
      query = `query EntityByRole {
           getEntity { ${ previewsE } }
           getProfile { ${ previewsP } }
         }`;
    }
    else if ( 'entity by evmAddress' == whichEndpoint ) {
      console.log( 222 );
      query = `query EntityByEvmAddress {
        getEntity (n:"${ data }") { ${ activeE } }
        getProfile { ${ activeP } }
      }`;
    }
    else if ( 'entity by fullId' == whichEndpoint ) {
      console.log( 333 );
      const tT = V.castFullId( data );
      query = `query EntityByFullId {
        getEntity (u:"${ tT.title }",v:"${ tT.tag }") { ${ activeE } }
        getProfile { ${ activeP } }
      }`;
    }
    return fetchFirebase( query )
      .then( data => {
        if ( data.data.getEntity[0] != null ) {
          const combined = data.data.getEntity.map( ( item, i ) => {
            if ( query.includes( 'EntityByRole' ) ) {
              return castEntityPreviewData( item, data.data.getProfile[i]  );
            }
            else {
              return castActiveEntityData( item, data.data.getProfile[i]  );
            }
          } );
          return {
            success: true,
            status: 'fetched firebase',
            data: combined
          };
        }
        else {
          return {
            success: false,
            status: 'could not fetch firebase',
          };
        }
      } );
  }

  function setFirebase( data, whichEndpoint  ) {
    if ( whichEndpoint == 'entity' ) {
      return setNewEntityNamespace( data )
        .then( async E => {
          const P = await setNewProfile( data );
          const entityData = castActiveEntityData( E.data.setEntity, P.data.setProfile );
          return {
            success: true,
            status: 'firebase entity set',
            data: [ entityData ]
          };
        } )
        .catch( err => {
          return {
            success: false,
            message: 'error with setting Firebase: ' + err
          };
        } );
    }
  }

  /* ====================== export ====================== */

  V.getFirebase = getFirebase;
  V.setFirebase = setFirebase;

  return {
    getFirebase: getFirebase,
    setFirebase: setFirebase,
  };

} )();
