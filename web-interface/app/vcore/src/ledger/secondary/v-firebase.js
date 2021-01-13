const VFirebase = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to connect to Firebase (Middleware)
   *
   */

  'use strict';

  /**
   * Single Entity View returns all relevant fields.
   * Fields may be undefined.
   */

  const singleE = 'a c d i j m n y { a b m } holders holderOf auth { f j }';
  const singleP = 'm { a b c m n } n { a b } o { a b c }';

  /**
   * Preview View returns only a few fields:
   * UuidE, Type, UuidP, Title and Tag (from Entity)
   * Description, Location name, Thumbnail image (from Profile)
   */

  const previewsE = 'a c d m n';
  const previewsP = 'm { a } n { a } o { b }';

  /* ================== private methods ================= */

  function castEntityData( E, P ) {

    /** cast a fullId, e.g. "Peter #3454" */
    const fullId = V.castFullId( E.m, E.n );

    return {
      uuidE: E.a || P.d,
      uuidP: E.d || P.a,
      role: E.c,
      title: E.m,
      tag: E.n,
      profile: { // placed here also for UI compatibility
        title: E.m,
        tag: E.n,
      },
      fullId: fullId,
      path: V.castPathOrId( fullId ),
      properties: {
        description: P.m ? P.m.a : undefined,
        preferredLangs: P.m ? P.m.c : undefined,
        target: P.m ? P.m.m : undefined,
        unit: P.m ? P.m.n : undefined,
        // baseLocation: P.n ? P.n.b : undefined, // placed here also for UI compatibility
        email: P.m ? P.m.b : undefined,
      },
      // social: {
      //   email: P.m ? P.m.b : undefined, // placed here also for UI compatibility
      // },
      images: {
        tinyImage: P.o ? P.o.a : undefined,
        thumbnail: P.o ? P.o.b : undefined,
        mediumImage: P.o ? P.o.c : undefined,
      },
      geometry: {
        coordinates: P.n ? P.n.a : undefined,
        baseLocation: P.n ? P.n.b : undefined,
        type: 'Point',
      },
      type: 'Feature', // needed to create a valid GeoJSON object for leaflet.js
      status: { active: E.y ? E.y.m : undefined },
      holders: E.holders,
      holderOf: E.holderOf,
      evmCredentials: {
        address: E.i,
      },
      receivingAddresses: {
        evm: E.j,
      },
      auth: {
        uPhrase: E.auth ? E.auth.f : undefined,
        evmCredentials: {
          privateKey: E.auth ? E.auth.j : undefined,
        },
      },
    };
  }

  function setEntity( data ) {

    const a = data.uuidE;
    const b = data.contextE;
    const c = data.typeE;
    const d = data.uuidP;
    const e = data.uuidA;
    const g = data.issuer;

    const i = data.evmCredentials.address;
    const j = data.receivingAddresses.evm;

    const m = data.title;
    const n = data.tag;

    const x = {
      a: data.creatorUuid,
      b: data.heldBy,
    };

    const y = {
      a: String( data.unix ),
      c: String( data.expires ),
      m: data.active,
      z: data.statusCode,
    };

    const auth = {
      a: data.uuidA,
      b: data.contextA,
      d: data.uuidE,
      e: data.uuidP,
      f: data.uPhrase,
      i: data.evmCredentials.privateKey ? data.evmCredentials.address : undefined,
      j: data.evmCredentials.privateKey,
    };

    const variables = {
      input: { a, b, c, d, e, g, i, j, m, n, x, y, auth },
    };

    const query = `mutation SetNewEntity( $input: InputEntity! ) {
                setEntity(input: $input) {
                  ${ singleE }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function setProfile( data ) {
    const a = data.uuidP;
    const b = data.contextP;
    const d = data.uuidE; // note that this is NOT creatorUuid

    const m = {
      a: data.props.descr,
      b: data.props.email,
      c: data.props.prefLangs,
      m: data.props.target,
      n: data.props.unit,
    };
    const n = {
      a: data.geometry.coordinates,
      b: data.geometry.baseLocation,
      z: data.geometry.rand,
    };
    const o = {
      a: data.tinyImageDU,
      b: data.thumbnailDU,
      c: data.mediumImageDU,
      n: data.imageName,
    };

    const x = {
      a: data.creatorUuid ? data.creatorUuid : data.uuidE,
      b: data.heldBy,
    };

    const y = {
      a: String( data.unix ),
    };

    const variables = {
      input: { a, b, d, m, n, o, x, y },
    };

    const query = `mutation SetNewProfile( $input: InputProfile! ) {
                setProfile(input: $input) {
                  ${ singleP }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function setEntityField( data ) {
    console.log( 'UPDATING ENTITY: ', data );
    const a = V.getState( 'active' ).lastViewedUuidE;

    let j, m, y;

    switch ( data.field ) {
    case 'profile.title':
      m = data.data;
      break;
    case 'receivingAddresses.evm':
      j = data.data;
      break;
    case 'status.active':
      y = { m: data.data };
      break;
    }

    const variables = {
      input: { a, j, m, y },
    };

    const query = `mutation SetEntityUpdate( $input: InputEntity! ) {
                setEntity(input: $input) {
                  ${ 'a error' }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function setProfileField( data ) {
    console.log( 'UPDATING PROFILE: ', data );
    const a = V.getState( 'active' ).lastViewedUuidP;

    let m, n, o;

    switch ( data.field ) {
    case 'properties.description':
      m = { a: data.data };
      break;
    case 'properties.email':
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

    case 'geometry.baseLocation':
      n = {
        a: [ Number( data.data.lng ), Number( data.data.lat ) ],
        b: data.data.value,
        z: data.data.rand,
      };
      break;

    case 'images':
      o = {
        a: data.data.tiny.dataUrl,
        b: data.data.thumb.dataUrl,
        c: data.data.medium.dataUrl,
        n: data.data.thumb.originalName,
      };
      break;
    }

    const variables = {
      input: { a, m, n, o },
    };

    const query = `mutation SetProfileUpdate( $input: InputProfile! ) {
                setProfile(input: $input) {
                  ${ 'a error' }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function getEntities( data, whichEndpoint ) {
    let queryE;

    if ( 'entity by role' == whichEndpoint ) {
      console.log( 111, 'by Role' );
      queryE = `query GetEntitiesByRole {
             getEntity { ${ previewsE } }
           }`;
    }
    else if ( 'entity by evmAddress' == whichEndpoint ) {
      console.log( 222, 'by EVM Address' );
      queryE = `query GetEntityByEvmAddress {
          getEntity (i:"${ data }") { ${ singleE } }
        }`;
    }
    else if ( 'entity by fullId' == whichEndpoint ) {
      const tT = V.castFullId( data );
      console.log( 333, 'by FullId' );
      queryE = `query GetEntityByFullId {
          getEntity (m:"${ tT.title }",n:"${ tT.tag }") { ${ singleE } }
        }`;
    }
    else if ( 'entity by uuidE' == whichEndpoint ) {
      console.log( 444, 'by uuidE' );
      queryE = `query GetEntityByUuidE {
          getEntity (a:"${ data }") { ${ singleE } }
        }`;
    }
    return fetchFirebase( queryE );
    // .then( res => {
    //   console.log( res );
    //   return res;
    // } );
  }

  function getProfiles( array ) {
    const uuidEs = array.map( item => item.d );
    const queryP = `query GetProfiles {
           getProfiles (array: ${ V.castJson( uuidEs ) }) { ${ array.length == 1 ? singleP : previewsP } }
         }`;
    return fetchFirebase( queryP );
  }

  function getAuth( data ) {
    console.log( 555, 'by uPhrase / get auth Doc only' );
    const queryA = `query GetEntityAuth {
            getAuth (token:"${ data }") { f i j }
          }`;

    return fetchFirebase( queryA );
  }

  function getEntityQuery( data ) {
    console.log( 100, 'by query' );

    const queryS = `query GetEntitiesByQuery( $filter: TitleFilter! ) {
                      getEntityQuery(filter: $filter) {
                        ${ previewsE }
                      }
                    }
                  `;

    const variables = {
      filter: data,
    };

    return fetchFirebase( queryS, variables );
  }

  function fetchFirebase( query, variables ) {
    return fetch( 'http://localhost:5001/entity-namespace/us-central1/api/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': V.getCookie( 'last-active-uphrase' )
          ? V.getCookie( 'last-active-uphrase' ).replace( /"/g, '' )
          : '',
      },
      body: JSON.stringify( {
        query,
        variables: variables,
      } ),
    } )
      .then( r => r.json() );
  }

  /* ================== public methods ================== */

  async function getFirebase( data, whichEndpoint ) {

    if ( 'entity by uPhrase' == whichEndpoint ) {
      const auth = await getAuth( data );
      if ( !auth.errors && auth.data.getAuth[0] != null ) {
        return V.successTrue( 'got auth doc', auth.data.getAuth[0] );
      }
      else {
        return V.successFalse( 'get auth doc' );
      }
    }
    if ( 'entity by query' == whichEndpoint ) {
      const search = await getEntityQuery( data );
      console.log( search );
      if ( !search.errors && search.data.getEntityQuery[0] != null ) {
        return V.successTrue( 'got entities by query', search.data.getEntityQuery );
      }
      else {
        return V.successFalse( 'get entities by query' );
      }
    }

    /** Query entities */

    const entities = await getEntities( data, whichEndpoint );

    /** Query profiles for entities fetched */

    if ( !entities.errors && entities.data.getEntity[0] != null ) {
      const profiles = await getProfiles( entities.data.getEntity );

      /** Combine profile and entity data */

      if ( !profiles.errors && profiles.data.getProfiles[0] != null ) {
        const combined = entities.data.getEntity.map(
          ( item, i ) => castEntityData( item, profiles.data.getProfiles[i] )
        );
        return V.successTrue( 'got entities and profiles', combined );
      }
      else {
        return V.successFalse( 'get profiles' );
      }
    }
    else {
      return V.successFalse( 'get Entities' );
    }
  }

  function setFirebase( data, whichEndpoint  ) {
    if ( 'entity' == whichEndpoint ) {
      return setEntity( data )
        .then( async E => {
          const P = await setProfile( data );
          const entityData = castEntityData( E.data.setEntity, P.data.setProfile );
          return V.successTrue( 'set entity', entityData );
        } )
        .catch( err => V.successFalse( 'set entity', err ) );
    }
    else if ( 'entity update' == whichEndpoint ) {
      if ( ['profile.title', 'receivingAddresses.evm', 'status.active'].includes( data.field ) ) {
        return setEntityField( data )
          .then( E => {
            E = E.data.setEntity;
            if ( !E.error ) {
              return V.successTrue( 'updated entity', E );
            }
            else {
              return V.successFalse( 'update entity', E.error, E );
            }
          } )
          .catch( err => V.successFalse( 'update entity', err ) );
      }
      else {
        return setProfileField( data )
          .then( P => {
            P = P.data.setProfile;
            if ( !P.error ) {
              return V.successTrue( 'updated profile', P );
            }
            else {
              return V.successFalse( 'update profile', P.error, P );
            }
          } )
          .catch( err => V.successFalse( 'update profile', err ) );
      }
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
