const VFirebase = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to connect to Firebase (Middleware)
   *
   */

  'use strict';

  const activeE = 'a m n f i';
  const activeP = 'a';
  const previewsE = 'a c m n';
  const previewsP = 'a m { a } n { a b }';

  /* ================== private methods ================= */

  function castActiveEntityData( E, P ) {
    const fullId = V.castFullId( E.m, E.n );
    return {
      uuidE: E.a,
      uuidP: P.a,
      fullId: fullId,
      path: V.castPathOrId( fullId ),
      private: {
        uPhrase: E.f
      },
      evmCredentials: {
        address: E.i
      },
      // for backwards compatibility
      profile: {
        title: E.m,
        tag: E.n
      }
    };
  }

  function castEntityPreviewData( E, P ) {
    const fullId = V.castFullId( E.m, E.n );
    return {
      uuidE: E.a,
      uuidP: P.a,
      fullId: fullId,
      path: V.castPathOrId( fullId ),
      properties: {
        description: P.m ? P.m.a ? P.m.a : '' : ''
      },
      profile: {
        role: E.c
      },
      geometry: {
        type: 'Point',
        coordinates: P.n.a
      }
    };
  }

  function setNewEntityNamespace( data ) {

    const a = data.uuidE;
    const b = data.contextE;
    const c = data.typeE;
    const d = data.uuidP;
    const e = data.issuer;
    const f = data.auth;

    const i = data.evmCredentials.address;

    const m = data.title;
    const n = data.tag;

    const x = {
      a: data.creatorUuid,
    };

    const y = {
      a: String( data.unix ),
      c: String( data.expires ),
      m: data.active,
      z: data.statusCode,
    };

    const variables = {
      input: {
        a, b, c, d, e, f, i, m, n, x, y
      }
    };

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
    const d = data.uuidE; // note that this is NOT creatorUuid

    const m = {
      a: data.props.descr,
      b: data.props.email,
      c: data.props.prefLangs,
      m: data.props.target,
      n: data.props.unit
    };
    const n = {
      a: data.geometry.coordinates,
      b: data.props.baseLocation,
      z: data.geometry.rand
    };
    const o = {
      a: 'some image data string',
      b: 'some image data string',
      c: 'some image data string'
    };

    const y = {
      a: String( data.unix ),
    };
    console.log( a, b, d, m, n, o, y );
    const variables = {
      input: {
        a, b, d, m, n, o, y
      }
    };

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
        getEntity (i:"${ data }") { ${ activeE } }
        getProfile { ${ activeP } }
      }`;
    }
    else if ( 'entity by fullId' == whichEndpoint ) {
      const tT = V.castFullId( data );
      query = `query EntityByFullId {
        getEntity (m:"${ tT.title }",n:"${ tT.tag }") { ${ activeE } }
        getProfile { ${ activeP } }
      }`;
    }
    return fetchFirebase( query )
      .then( data => {
        console.log( data );
        if ( !data.errors && data.data.getEntity[0] != null ) {
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
