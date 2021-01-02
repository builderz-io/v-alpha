const VFirebase = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to connect to Firebase (Middleware)
   *
   */

  'use strict';

  const singleE = 'a c d m n i y { m } x { a }';
  const singleP = 'm { a b } n { a b } o { a b c }';
  const previewsE = 'a c d m n';
  const previewsP = 'm { a } n { a b } o { b }';

  /* ================== private methods ================= */

  function castActiveEntityData( E, P ) {
    const fullId = V.castFullId( E.m, E.n );
    return {
      uuidE: E.a,
      uuidP: E.d,
      fullId: fullId,
      path: V.castPathOrId( fullId ),
      evmCredentials: {
        address: E.i
      },
      properties: {
        description: P.m ? P.m.a ? P.m.a : '' : ''
      },
      relations: {
        creator: E.x ? E.x.a : E.a,
      },
      images: {
        tinyImage: P.o ? P.o.a : undefined,
        thumbnail: P.o ? P.o.b : undefined,
        mediumImage: P.o ? P.o.c : undefined
      },
      geometry: {
        type: 'Point',
        coordinates: P.n.a
      },
      profile: {
        title: E.m,
        tag: E.n,
        role: E.c
      },
      social: {
        email: P.m ? P.m.b : undefined
      },
      status: { active: E.y.m },
      // for backwards compatibility
      adminOf: [fullId],
      owners: [{ ownerName: '', ownerTag: '' }]
      // private: {
      //   uPhrase: E.f
      // },
    };
  }

  function castEntityPreviewData( E, P ) {
    const fullId = V.castFullId( E.m, E.n );
    return {
      uuidE: E.a,
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
      },
      images: {
        thumbnail: P.o ? P.o.b : undefined
      }
    };
  }

  function setNewEntity( data ) {

    const a = data.uuidE;
    const b = data.contextE;
    const c = data.typeE;
    const d = data.uuidP;
    const e = data.issuer;

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
        a, b, c, d, e, i, m, n, x, y
      }
    };

    const query = `mutation SetNewEntity( $input: InputEntity! ) {
                setEntity(input: $input) {
                  ${ singleE }
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
      a: data.tinyImageDU,
      b: data.thumbnailDU,
      c: data.mediumImageDU
    };

    const x = {
      a: data.creatorUuid ? data.creatorUuid : data.uuidE,
    };

    const y = {
      a: String( data.unix ),
    };

    const variables = {
      input: {
        a, b, d, m, n, o, x, y
      }
    };

    const query = `mutation SetNewProfile( $input: InputProfile! ) {
                setProfile(input: $input) {
                  ${ singleP }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function setProfileUpdate( data ) {
    const a = V.getLastViewed().uuidP;

    let m, n, o;

    switch ( data.field ) {
    case 'properties.description':
      m = { a: data.data };
      break;
    case 'social.email':
      m = { b: data.data };
      break;
    case 'properties.preferredLangs':
      m = { c: data.data };
      break;
    case 'properties.target':
      m = { m: Number( data.data ) };
      break;
    case 'properties.unit':
      m = { n: data.data };
      break;

    case 'properties.baseLocation':
      n = {
        a: [ Number( data.data.lng ), Number( data.data.lat ) ],
        b: data.data.value,
        z: data.data.rand
      };
      break;

    case 'images':
      o = {
        a: data.data.tiny.dataUrl,
        b: data.data.thumb.dataUrl,
        c: data.data.medium.dataUrl
      };
      break;
    }

    const variables = {
      input: {
        a, m, n, o
      }
    };

    const query = `mutation SetProfileUpdate( $input: InputProfile! ) {
                setProfile(input: $input) {
                  ${ /* singleP */ 'a m { a b }' }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function getFirebaseEntities( data, whichEndpoint ) {
    let queryE;

    if ( 'entity by role' == whichEndpoint ) {
      console.log( 111, 'by Role' );
      queryE = `query EntityByRole {
           getEntity { ${ previewsE } }
         }`;
    }
    else if ( 'entity by evmAddress' == whichEndpoint ) {
      console.log( 222, 'by EVM Address' );
      queryE = `query EntityByEvmAddress {
        getEntity (i:"${ data }") { ${ singleE } }
      }`;
    }
    else if ( 'entity by fullId' == whichEndpoint ) {
      const tT = V.castFullId( data );
      console.log( 333, 'by FullId' );
      queryE = `query EntityByFullId {
        getEntity (m:"${ tT.title }",n:"${ tT.tag }") { ${ singleE } }
      }`;
    }
    return fetchFirebase( queryE );
  }

  function getFirebaseProfiles( array ) {
    const uuidEs = array.map( item => item.d );
    const queryP = `query Profiles {
         getProfile (a: ${ V.castJson( uuidEs ) }) { ${ array.length == 1 ? singleP : previewsP } }
       }`;
    return fetchFirebase( queryP );
  }

  function getFirebaseAuth( data ) {
    const queryA = `query EntityByUphrase {
          getAuth (f:"${ data }") { f }
        }`;

    return fetchFirebase( queryA );
  }

  function fetchFirebase( query, variables ) {
    return fetch( 'http://localhost:5001/entity-namespace/us-central1/api/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': V.getCookie( 'last-active-uphrase' )
          ? V.getCookie( 'last-active-uphrase' ).replace( /"/g, '' )
          : ''
      },
      body: JSON.stringify( {
        query,
        variables: variables,
      } )
    } )
      .then( r => r.json() );
  }

  /* ================== public methods ================== */

  async function getFirebase( data, whichEndpoint ) {

    if ( 'entity by uPhrase' == whichEndpoint ) {
      const auth = await getFirebaseAuth( data );
      if ( !auth.errors && auth.data.getAuth[0] != null ) {
        return {
          success: true,
          status: 'fetched firebase auth doc',
          data: [{ private: { uPhrase: auth.data.getAuth[0].f } }]
        };
      }
      else {
        return {
          success: false,
          message: 'could not fetch firebase auth doc'
        };
      }
    }

    /** Query entities */

    const entities = await getFirebaseEntities( data, whichEndpoint );

    /** Query profiles for entities fetched */

    if ( !entities.errors && entities.data.getEntity[0] != null ) {
      const profiles = await getFirebaseProfiles( entities.data.getEntity );

      /** Combine profile and entity data */

      if ( !profiles.errors && profiles.data.getProfile[0] != null ) {
        const combined = entities.data.getEntity.map( ( item, i ) => {
          if ( 'entity by role' == whichEndpoint ) {
            return castEntityPreviewData( item, profiles.data.getProfile[i] );
          }
          else {
            return castActiveEntityData( item, profiles.data.getProfile[i] );
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
          message: 'could not fetch firebase profiles'
        };
      }
    }
    else {
      return {
        success: false,
        message: 'could not fetch firebase entities'
      };
    }
  }

  function setFirebase( data, whichEndpoint  ) {
    if ( 'entity' == whichEndpoint ) {
      return setNewEntity( data )
        .then( async E => {
          const P = await setNewProfile( data );
          const entityData = castActiveEntityData( E.data.setEntity, P.data.setProfile );
          return {
            success: true,
            status: 'firebase entity set',
            data: [ entityData ]
          };
        } )
        .catch( err => ( {
          success: false,
          message: 'error with setting Firebase: ' + err
        } ) );
    }
    else if ( 'entity update' == whichEndpoint ) {
      return setProfileUpdate( data )
        .then( P => ( {
          success: true,
          status: 'firebase entity updated',
          data: [ P.data.setProfile ]
        } ) )
        .catch( err => ( {
          success: false,
          message: 'error with updating Firebase: ' + err
        } ) );
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
