const VFirebase = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to connect to Firebase (Middleware)
   *
   */

  'use strict';

  const settings = {
    useClientData: false,
    firebaseEndpoint: 'http://localhost:5001/entity-namespace/us-central1/api/v1',
  };

  let jwt;

  /**
   * Single Entity View returns all relevant fields.
   * Fields may be undefined.
   */

  const singleE = 'a c d i j m n y { a b m } holders holderOf auth { f i j }';
  const singleP = 'm { a b c m n } n { a b } o { a b c } q { q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 }';

  /**
   * Preview View returns only a few fields:
   * UuidE, Type, UuidP, Title and Tag (from Entity)
   * Description, Lng/Lat, Thumbnail image (from Profile)
   */

  const previewsE = 'a c d m n';
  const previewsP = 'm { a } n { a } o { b }';

  /* ================== private methods ================= */

  function castReturnedEntityAndProfileData( E, P ) {

    /** cast a fullId, e.g. "Peter #3454" */
    const fullId = V.castFullId( E.m, E.n );

    /** cast some random geometry */
    const geo = V.castRandLatLng();

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
        coordinates: P.n ? P.n.a : [ geo.lng, geo.lat ],
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
          address: E.auth ? E.auth.i : undefined,
          privateKey: E.auth ? E.auth.j : undefined,
        },
      },
      questionnaire: {
        q1: P.q ? P.q.q1 : undefined,
        q2: P.q ? P.q.q2 : undefined,
        q3: P.q ? P.q.q3 : undefined,
        q4: P.q ? P.q.q4 : undefined,
        q5: P.q ? P.q.q5 : undefined,
        q6: P.q ? P.q.q6 : undefined,
        q7: P.q ? P.q.q7 : undefined,
        q8: P.q ? P.q.q8 : undefined,
        q9: P.q ? P.q.q9 : undefined,
        q10: P.q ? P.q.q10 : undefined,
      },
    };
  }

  function setEntity( data ) {

    const query = `mutation SetNewEntity( $input: ${ settings.useClientData ? 'InputEntity' : 'EntityInputServerSide' }! ) {
                setEntity(input: $input) {
                  ${ singleE }
                }
              }
            `;

    const variables = {
      input: castNewEntityData( data ),
    };

    return fetchFirebase( query, variables );
  }

  function setProfile( data ) {

    const query = `mutation SetNewProfile( $input: InputProfile! ) {
                setProfile(input: $input) {
                  ${ singleP }
                }
              }
            `;

    const variables = {
      input: castNewProfileData( data ),
    };

    return fetchFirebase( query, variables );
  }

  function castNewEntityData( data ) {

    /**
     * casts a full set of entity data, to be used when
     * server-side initialisation of entity is disabled.
     * Some of this data is also used for server side initialisation (e.g. title).
     *
     */

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

    /**
     * cast a full set of auth data, in case
     * server-side initialisation of entity is disabled.
     */

    const auth = {
      a: data.uuidA,
      b: data.contextA,
      d: data.uuidE,
      e: data.uuidP,
      f: data.uPhrase,
      i: data.evmCredentials.address,
      j: data.evmCredentials.privateKey || undefined,
    };

    /**
     * cast a small set of auth data (evm creds only),
     * in case server-side initialisation of entity is enabled.
     */

    const authInputServerSide = {
      i: data.evmCredentials.address,
      j: data.evmCredentials.privateKey || undefined,
    };

    /**
     * cast the user-defined parts of the profile data,
     * in case server-side initialisation of entity is enabled.
     */

    const profileInputServerSide = {
      descr: data.props.descr,
      email: data.props.email,
      target: data.props.target,
      unit: data.props.unit,
      lngLat: data.geometry.coordinates,
      loc: data.geometry.baseLocation,
      tinyImg: data.tinyImageDU,
      thumb: data.thumbnailDU,
      medImg: data.mediumImageDU,
      imgName: data.imageName,
      evmIssuer: data.evmIssuer,
    };

    return settings.useClientData
      ? { a, b, c, d, e, g, i, j, m, n, x, y, auth }
      : { a: '-', c, i, j, m, authInputServerSide, profileInputServerSide }; // a is required, but flags "none"

  }

  function castNewProfileData( data ) {

    /**
     * casts a full set of profile data, to be used when
     * server-side initialisation of entity is disabled.
     */

    const a = data.uuidP;
    const b = data.contextP;
    const d = data.uuidE; // note that this is NOT creatorUuid

    const m = {
      a: data.props.descr,
      b: data.props.email,
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
      a: data.creatorUuid,
      b: data.heldBy,
    };

    const y = {
      a: String( data.unix ),
    };

    return { a, b, d, m, n, o, x, y };
  }

  function setEntityField( data ) {
    console.log( 'UPDATING ENTITY: ', data );
    const a = V.getState( 'active' ).lastViewedUuidE;

    let c, j, m, y;

    switch ( data.field ) {
    case 'profile.title':
      c = V.getLastViewed().role;
      m = data.data;
      break;
    case 'receivingAddresses.evm':
      j = data.data;
      break;
    case 'status.active':
      y = { m: data.data };
      break;
    }

    /**
     *  Run a title validation check already in frontend.
     *  Mimics the server response on unsuccessful validation.
     */

    if ( m || m == '' ) {
      const title = V.castEntityTitle( m );
      if ( !title.success ) {
        return Promise.resolve( {
          data: {
            setEntity: { a: a, error: '-5003 ' + title.message },
          },
        } );
      }
    }

    const variables = {
      input: { a, c, j, m, y },
    };

    const query = `mutation SetEntityUpdate( $input: ${ settings.useClientData ? 'InputEntity' : 'EntityInputServerSide' }! ) {
                setEntity(input: $input) {
                  ${ 'a error' /* a confirms successful response */ }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function setProfileField( data ) {
    console.log( 'UPDATING PROFILE: ', data );
    const a = V.getState( 'active' ).lastViewedUuidP;

    let m, n, o, q;
    let returnFields = '';

    if ( data.field.includes( 'questionnaire' ) ) {
      const n = data.field.replace( 'questionnaire.q', '' );
      q = {};
      for ( let i = 1; i <= 10; i++ ) {
        n == i ? q['q' + n] = data.data : null;
      }
    }

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
      returnFields = 'n { a b z }';
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
      input: { a, m, n, o, q },
    };

    const query = `mutation SetProfileUpdate( $input: ${ settings.useClientData ? 'InputProfile' : 'ProfileInputServerSide' }! ) {
                setProfile(input: $input) {
                  ${ 'a ' + returnFields + ' error'  /* a confirms successful response */ }
                }
              }
            `;

    return fetchFirebase( query, variables );
  }

  function getEntities( data, whichEndpoint ) {
    let where;

    let queryE = `query GetEntity ( $where: WhereEntity ){
        getEntity(where: $where) { ${ singleE } }
      }`;

    if ( 'entity by role' == whichEndpoint ) {
      console.log( 111, 'by Role' );
      where = {};
      queryE = `query GetEntitiesByRole ( $where: WhereEntity ){
             getEntity(where: $where) { ${ previewsE } }
           }`;
    }
    else if ( 'entity by evmAddress' == whichEndpoint ) {
      console.log( 222, 'by EVM Address:', data );
      where = { i: data };
    }
    else if ( 'entity by fullId' == whichEndpoint ) {
      const tT = V.castFullId( data );
      console.log( 333, 'by FullId:', tT.title, tT.tag );
      where = { m: tT.title, n: tT.tag };
    }
    else if ( 'entity by uuidE' == whichEndpoint ) {
      console.log( 444, 'by uuidE:', data );
      where = { a: data };
    }
    const variables = {
      where: where,
    };
    return fetchFirebase( queryE, variables );
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

    const queryS = `query GetEntitiesByQuery( $filter: Filter! ) {
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
    return fetch( settings.firebaseEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': jwt ? 'Bearer ' + jwt : '',
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

    /** Query entities */

    let E;

    if ( 'entity by uPhrase' == whichEndpoint ) {
      const auth = await getAuth( data );
      if ( !auth.errors && auth.data.getAuth[0] != null ) {
        return V.successTrue( 'got auth doc', auth.data.getAuth[0] );
      }
      else {
        return V.successFalse( 'get auth doc' );
      }
    }
    else if ( 'entity by query' == whichEndpoint ) {
      const search = await getEntityQuery( data );

      if ( !search.errors && search.data.getEntityQuery[0] != null ) {
        E = search;
      }
      else {
        return V.successFalse( 'get entities by query' );
      }
    }
    else {
      E = await getEntities( data, whichEndpoint );
    }

    /** Query profiles for E fetched regularly or by query */

    if (
      !E.errors &&
      (
        ( E.data.getEntity && E.data.getEntity[0] != null ) ||
        ( E.data.getEntityQuery && E.data.getEntityQuery[0] != null )
      )
    ) {
      const entitiesArray = E.data.getEntity || E.data.getEntityQuery;

      const P = await getProfiles( entitiesArray );

      /** Combine profile and entity data */

      if ( !P.errors && P.data.getProfiles[0] != null ) {
        const combined = entitiesArray.map(
          ( item, i ) => castReturnedEntityAndProfileData( item, P.data.getProfiles[i] )
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

  async function setFirebase( data, whichEndpoint  ) {
    if ( 'entity' == whichEndpoint ) {

      /** initializes a new namespace */
      return setEntity( data )
        .then( async E => {
          if ( E.errors ) {
            throw new Error( E.errors[0].message );
          }
          let combined;
          if ( settings.useClientData ) {

            /** If client data is used, set the profile */
            const P = await setProfile( data );
            combined = castReturnedEntityAndProfileData( E.data.setEntity, P.data.setProfile );
          }
          else {

            /** If server is used, get the profile */
            const P = await getProfiles( [ E.data.setEntity ] );
            combined = castReturnedEntityAndProfileData( E.data.setEntity, P.data.getProfiles[0] );
          }
          return V.successTrue( 'set entity', combined );
        } )
        .catch( err => V.successFalse( 'set entity', err ) );
    }
    else if ( 'entity update' == whichEndpoint ) {

      /** Updates an existing namespace */
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

  function setJwt( whichJwt ) {
    jwt = whichJwt;
  }

  /* ====================== export ====================== */

  V.getFirebase = getFirebase;
  V.setFirebase = setFirebase;
  V.setJwt = setJwt;

  return {
    getFirebase: getFirebase,
    setFirebase: setFirebase,
    setJwt: setJwt,
  };

} )();
