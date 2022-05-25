const VNamespace = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Core Module to connect to the V Namespace (Middleware)
   *
   */

  'use strict';

  const settings = {
    useClientData: false,
    namespaceEndpoint: V.getSetting( 'namespaceEndpoint' ),
  };

  /** In-memory jwt */

  let jwt;

  /**
   * Single Entity View returns all relevant fields.
   * Fields may be undefined.
   */

  const singleE = 'a c d i j m n y { a b m } holders holderOf { fullId } auth { f i j }';
  const singleP = 'm { a b c m n r } n { a c z } o { a z } p { z } q { q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 }';

  /**
   * Preview View returns only a few fields:
   * UuidE, Type, UuidP, Title and Tag (from Entity)
   * Description, Lng/Lat, Thumbnail image (from Profile)
   */

  const previewE = 'a c d m n';
  const previewP = 'm { a r } n { a c z } o { a b z }';

  /* ================== private methods ================= */

  function castNewEntityData( data ) {

    /**
    * casts a full set of entity data, to be used when
    * server-side initialisation of entity is disabled.
    * Some of this data is also used for server side initialisation (e.g. title).
    *
    */

    const a = data.uuidE;
    const b = data.contextE;
    const c = V.castRole( data.typeE );
    const d = data.uuidP;
    const e = data.uuidA;
    const g = data.issuer;

    const i = data.evmCredentials.address;
    const j = data.receivingAddresses.evm;

    const m = data.title;
    const n = data.tag;

    const x = {
      a: data.creatorUuid,
      m: data.heldBy,
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
      emailPrivate: data.props.emailPrivate,
      target: data.props.target,
      unit: data.props.unit,
      continent: data.continent,
      avatar: data.avatar,
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
      c: data.geometry.baseLocation,
    };
    const o = {
      a: data.tinyImageDU,
      b: data.thumbnailDU,
      c: data.mediumImageDU,
      n: data.imageName,
    };

    const x = {
      a: data.creatorUuid,
      m: data.heldBy,
    };

    const y = {
      a: String( data.unix ),
    };

    return { a, b, d, m, n, o, x, y };
  }

  function castNewTransferData( array ) {
    return array.map( tx => ( {
      a: tx.txType,
      b: tx.title,
      // c: tx.message,

      g: tx.amount,
      h: tx.feeAmount,
      i: tx.contribution,
      j: tx.payout,

      m: tx.fromAddress,
      n: tx.fromUuidE,
      o: tx.fromEntity,

      p: tx.toAddress,
      q: tx.toUuidE,
      r: tx.toEntity,

      s: tx.hash,
      t: tx.block,
      u: tx.blockDate,
      v: tx.logIndex,
    } ) );
  }

  function castReturnedEntityAndProfileData( E, P, I ) {

    /** cast a fullId, e.g. "Peter #3454" */
    const fullId = V.castFullId( E.m, E.n );

    /** cast some random geometry */
    const geo = V.castRandLatLng();

    return {
      uuidE: E.a || P.d,
      uuidP: E.d || P.a,
      role: V.castRole( E.c ),
      roleCode: E.c,
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
        filteredDescription: P.m ? P.m.r : undefined,
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
        mediumImage: I && I.o ? I.o.c : undefined,
        avatar: P.o ? P.o.z : undefined,
      },
      geometry: {
        coordinates: P.n ? P.n.a : [ geo.lng, geo.lat ],
        baseLocation: P.n ? P.n.c : undefined,
        type: 'Point',
        continent: P.n ? P.n.z : undefined,
      },
      type: 'Feature', // needed to create a valid GeoJSON object for leaflet.js
      status: { active: E.y ? E.y.m : undefined },
      holders: E.holders,
      holderOf: E.holderOf ? E.holderOf.map( item => item.fullId ) : undefined,
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
      transactions: {
        lastBlock: P.p ? P.p.z : undefined,
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

  function castReturnedTransferData( tx ) {
    return {
      txType: tx.a,     // txType: "out"
      title: tx.b,     // title: "0x7dce ... d1eb2d"
      // message: tx.c,     // message: "n/a"

      amount: tx.g,     // amount: "27"
      feeAmount: tx.h,    // feeAmount: "8.10"
      contribution: tx.i,     // contribution: "0.90"
      payout: tx.j,    // payout: "160"

      fromAddress: tx.m,    // fromAddress: "0xac6d20f6da9edc85647c8608cb6064794e20ca26"
      fromUuidE: tx.n,    // fromUuidE: "Account One #9383"
      fromEntity: tx.o,    // fromEntity: "Account One #9383"

      toAddress: tx.p,     // toAddress: "0x7dce8dd8a0dd6fe300beda9f1f8f87ecc3d1eb2d"
      toUuidE: tx.q,     // toUuidE: "0x7dce ... d1eb2d"
      toEntity: tx.r,     // toEntity: "0x7dce ... d1eb2d"

      hash: tx.s,    // hash: "0xfd5b20bc5acdb7bb02f415562c847eb7b1bb961f81b405576be2a42ba3177b0f"
      block: tx.t,    // block: 7587068
      blockDate: tx.u,    // blockDate: 1605964950
      logIndex: tx.v,  // logIndex: 40
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

    return fetchEndpoint( query, variables );
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

    return fetchEndpoint( query, variables );
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

    /*
    if ( m || m == '' ) {
      const title = V.castEntityTitle( m );
      if ( !title.success ) {
        return Promise.resolve( {
          data: {
            setEntity: { a: a },
          },
        } );
      }
    }
    */

    const variables = {
      input: { a, c, j, m, y },
    };

    const query = `mutation SetEntityUpdate( $input: ${ settings.useClientData ? 'InputEntity' : 'EntityInputServerSide' }! ) {
                setEntity(input: $input) {
                  ${ 'a' /* a confirms successful response */ }
                }
              }
            `;

    return fetchEndpoint( query, variables );
  }

  function setProfileField( data ) {
    console.log( 'UPDATING PROFILE: ', data );
    const a = data.activeProfile || V.getState( 'active' ).lastViewedUuidP;

    let m, n, o, p, q;
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
      n = data.data.value ? {
        a: [ Number( data.data.lng ), Number( data.data.lat ) ],
        c: data.data.value,
      } : null;
      returnFields = 'n { a c }';
      break;

    case 'images':
      o = {
        a: data.data.tiny.dataUrl,
        b: data.data.thumb.dataUrl,
        // c: data.data.medium.dataUrl,
        // n: data.data.thumb.originalName,
      };
      break;

    case 'transaction.log':
      p = {
        a: castNewTransferData( data.data ),
        z: data.lastBlock, // 7530929, //
      };
      returnFields = 'p { z }'; // p { a { a b g h i j m n o p s t } z }
      break;
    }

    const variables = {
      input: { a, m, n, o, p, q },
    };

    const query = `mutation SetProfileUpdate( $input: ${ settings.useClientData ? 'InputProfile' : 'ProfileInputServerSide' }! ) {
                setProfile(input: $input) {
                  ${ 'a ' + returnFields  /* a confirms successful response */ }
                }
              }
            `;

    return fetchEndpoint( query, variables );
  }

  function setImageField( data ) {
    console.log( 'UPDATING IMAGE: ', data );
    const a = data.activeProfile || V.getState( 'active' ).lastViewedUuidP;

    let o;

    switch ( data.field ) {

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
      input: { a, o },
    };

    const query = `mutation SetImageUpdate( $input: ImageInputServerSide! ) {
                setImage(input: $input) {
                  ${ 'a' /* a confirms successful response */ }
                }
              }
            `;

    return fetchEndpoint( query, variables );
  }

  function getEntities( data, whichEndpoint ) {
    let where;

    let queryE = `query GetEntities ( $where: WhereEntity ) {
        getEntities(where: $where) { ${ typeof data == 'string' ? singleE : previewE } }
      }`;

    if ( 'entity by role' == whichEndpoint ) {
      console.log( 777, 'by Role' );
      where = {};
      queryE = `query GetEntitiesByRole ( $where: WhereEntity ) {
             getEntities(where: $where) { ${ previewE } }
           }`;
    }
    else if ( 'entity by uuidE' == whichEndpoint ) {
      console.log( 333, 'by uuidE:', data );
      where = { a: typeof data == 'string' ? [data] : data };
    }
    else if ( 'entity by evmAddress' == whichEndpoint ) {
      console.log( 444, 'by EVM Address:', data );
      where = { i: data };
    }
    else if ( 'entity by fullId' == whichEndpoint ) {
      const tT = V.castFullId( data );
      console.log( 555, 'by FullId:', tT.title, tT.tag );
      where = { m: tT.title, n: tT.tag };
    }
    const variables = {
      where: where,
    };
    return fetchEndpoint( queryE, variables );

  }

  function getProfiles( array ) {
    const uuidPs = array.map( item => item.d );
    const queryP = `query GetProfiles {
           getProfiles (array: ${ V.castJson( uuidPs ) }) { ${ previewP } }
         }`;
    return fetchEndpoint( queryP );
  }

  function getEntity( data ) {

    const queryE = `query GetEntity ( $where: WhereEntity ){
        getEntities(where: $where) { ${ data.isMapPopUp ? previewE : singleE } }
      }`;

    const variables = {
      where: { a: [data.uuidE] },
    };

    return fetchEndpoint( queryE, variables );
  }

  function getProfile( data ) {

    const queryP = `query GetProfile ( $where: WhereProfile ){
           getProfile(where: $where) { ${ data.isMapPopUp ? previewP : singleP } }
         }`;

    const variables = {
      where: { a: data.uuidP },
    };

    return fetchEndpoint( queryP, variables );
  }

  function getImage( data ) {

    const queryI = `query GetImage ( $where: WhereProfile ){
           getImage(where: $where) { a o { c } }
         }`;

    const variables = {
      where: { a: data.uuidP },
    };

    return fetchEndpoint( queryI, variables );
  }

  function getEntityQuery( data ) {
    console.log( 888, 'by query' );

    data.role = V.castRole( data.role );

    const queryS = `query GetEntitiesByQuery( $filter: Filter! ) {
      getEntityQuery(filter: $filter) {
        ${ previewE }
      }
    }
    `;

    const variables = {
      filter: data,
    };

    return fetchEndpoint( queryS, variables );
  }

  function getTransactionLog( uuidP ) {
    const queryT = `query GetTransactionLog {
           getProfiles (array: ${ V.castJson( [uuidP] ) }) {
             p { a { a b c g h i j m n o p q r s t u v } z }
           }
         }`;
    return fetchEndpoint( queryT );
  }

  function getPoints() {
    console.log( 111, 'by point' );

    const query = `query GetEntitiesByPoint ( $where: WhereGeo ){
                 getPoints(where: $where) { a c d zz { i m } }
               }`;

    const variables = {
      where: {},
    };
    return fetchEndpoint( query, variables );
  }

  function getHighlights() {
    console.log( 222, 'by highlight' );

    const queryH = `query GetHighlights {
                      getHighlights {
                        a
                      }
                    }
                  `;

    return fetchEndpoint( queryH );
  }

  function setHighlight( which, whichEndpoint ) {
    const query = `mutation SetHighlight( $input: InputHighlight! ) {
                setHighlight(input: $input) {
                  a
                }
              }
            `;

    const expiry = whichEndpoint == 'highlight'
      ? V.castUnix() + 60 * 60 * 24 * 60
      : V.castUnix() - 1;

    const variables = {
      input: { a: which, y: { c: expiry } },
    };

    return fetchEndpoint( query, variables );
  }

  function setManagedTransaction( data ) {
    console.log( 'send managed transaction' );

    const queryS = `mutation SetTransaction( $tx: InputTransaction! ) {
                      setTransaction(tx: $tx) {
                        success error data { blockNumber transactionHash }
                      }
                    }
                  `;

    const variables = {
      tx: {
        initiatorAddress: data.initiatorAddress,
        recipientAddress: data.recipientAddress,
        txTotal: String( data.txTotal ),
      },
    };
    return fetchEndpoint( queryS, variables );
  }

  function setChatMessage( data ) {
    return new Promise( resolve => {
      NetworkMainRoom.child( data.time ).update( {
        a: data.time,
        i: data.uuidE,
        j: data.sender,
        m: data.message,
      }, () => { resolve( { success: true } ) } );
    } );
  }

  function fetchEndpoint( query, variables ) {
    return fetch( settings.namespaceEndpoint, {
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

  async function getNamespace( data, whichEndpoint ) {

    /** Query a single entity and its profile using Promise.all */

    if (
      data.isMapPopUp
      || data.isDisplay
      || data.isReturningUser
    ) {

      console.log( 'GET SINGLE ENTITY: ', data );

      const all = await Promise.all( [
        getEntity( data ),
        getProfile( data ),
        data.isDisplay ? getImage( data ) : { data: { getImage: [false] } },
      ] );

      if (
        all[0].errors
        || all[1].errors
        || all[2].errors
        || all[0].data.getEntities[0] === null
        || all[1].data.getProfile[0] === null
        || all[2].data.getImage[0] === null
      ) {
        return V.successFalse( 'get entity and profile' );
      }
      else {
        const combined = castReturnedEntityAndProfileData(
          all[0].data.getEntities[0],
          all[1].data.getProfile[0],
          all[2].data.getImage[0],
        );
        return V.successTrue( 'got entity and profile', combined );
      }
    }

    console.log( 'GET ENTITIE(S): ', data );

    /** Query multiple entities and profiles in sequence (arrays) */

    let E;

    if ( 'entity by point' == whichEndpoint ) {
      const points = await getPoints( data );
      if ( !points.errors && points.data.getPoints[0] != null ) {
        return V.successTrue( 'got points', points.data.getPoints );
      }
      else {
        return V.successFalse( 'get entities by point' );
      }
    }
    else if ( 'entity by highlight' == whichEndpoint ) {

      // uncomment to not load highlights
      // return V.successFalse( 'get entities by highlight' );

      const highlightedE = await getHighlights();
      const mixin = V.getCache( 'mixin-highlights' ); // from points

      if ( !highlightedE.errors && highlightedE.data.getHighlights[0] != null ) {
        let highlights = highlightedE.data.getHighlights.map( item => item.a );

        if ( mixin ) {
          highlights = [...new Set( highlights.concat( mixin.data ) )];
        }

        E = await getEntities( highlights, 'entity by uuidE' );

      }
      else if ( mixin ) {
        E = await getEntities( mixin.data, 'entity by uuidE' );
      }
      else {
        return V.successFalse( 'get entities by highlight' );
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
    else if ( 'transaction log' == whichEndpoint ) {
      const transactionLog = await getTransactionLog( data ); // data is uuidP
      if ( !transactionLog.errors
        && transactionLog.data.getProfiles[0].p != null
        && transactionLog.data.getProfiles[0].p.a != null
      ) {
        const castTx = transactionLog.data.getProfiles[0].p.a.map(
          tx => castReturnedTransferData( tx ),
        );
        return V.successTrue( 'got transfer log', castTx );
      }
      else {
        return V.successFalse( 'get transfer log' );
      }
    }
    else {
      E = await getEntities( data, whichEndpoint );
    }

    /** Query profiles for E fetched regularly or by query */

    if (
      !E.errors
      && (
        ( E.data.getEntities && E.data.getEntities[0] != null )
        || ( E.data.getEntityQuery && E.data.getEntityQuery[0] != null )
      )
    ) {
      const entitiesArray = E.data.getEntities || E.data.getEntityQuery;

      if ( data.isAutofill ) {
        const titles = entitiesArray.map(
          item => castReturnedEntityAndProfileData( item, {} ),
        );
        return V.successTrue( 'got entity titles for autofill', titles );
      }

      if ( entitiesArray.length == 1 ) {

        /** Run fetch again for a single entity */
        const singleEntity = {
          isDisplay: true,
          uuidE: entitiesArray[0].a,
          uuidP: entitiesArray[0].d,
        };
        return getNamespace( singleEntity );
      }
      else {

        /** Get Profiles for all entities in array ... */
        const P = await getProfiles( entitiesArray );

        /** ... then combine entity with profile data */
        if ( !P.errors && P.data.getProfiles[0] != null ) {
          const combined = entitiesArray.map(
            ( item, i ) => castReturnedEntityAndProfileData( item, P.data.getProfiles[i] ),
          );
          return V.successTrue( 'got entities and profiles', combined );
        }
        else {
          return V.successFalse( 'get profiles' );
        }
      }
    }
    else {
      return V.successFalse( 'get Entities' );
    }
  }

  async function setNamespace( data, whichEndpoint  ) {
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
            if ( !E.errors ) {
              return V.successTrue( 'updated entity', E.data.setEntity );
            }
            else {
              return V.successFalse( 'update entity', E.errors[0].message, E.data.setEntity );
            }
          } )
          .catch( err => V.successFalse( 'update entity', err ) );
      }
      if ( 'images' == data.field ) {
        return setImageField( data )
          .then( I => {
            if ( !I.errors ) {
              return V.successTrue( 'updated image', I.data.setImage );
            }
            else {
              return V.successFalse( 'update image', I.errors[0].message, I.data.setImage );
            }
          } )
          .catch( err => V.successFalse( 'update image', err ) );
      }
      else {
        return setProfileField( data )
          .then( P => {
            if ( !P.errors ) {
              return V.successTrue( 'updated profile', P.data.setProfile );
            }
            else {
              return V.successFalse( 'update profile', P.errors[0].message, P.data.setProfile );
            }
          } )
          .catch( err => V.successFalse( 'update profile', err ) );
      }
    }
    else if ( 'message' == whichEndpoint ) {
      return setChatMessage( data );
    }
    else if ( whichEndpoint.includes( 'highlight' ) ) {
      return setHighlight( data, whichEndpoint );
    }
    else if ( 'managed transaction' == whichEndpoint ) {
      return setManagedTransaction( data );
    }
  }

  function setJwt( whichJwt ) {
    jwt = whichJwt;
  }

  /* ====================== export ====================== */

  V.getNamespace = getNamespace;
  V.setNamespace = setNamespace;
  V.setJwt = setJwt;

  return {
    getNamespace: getNamespace,
    setNamespace: setNamespace,
    setJwt: setJwt,
  };

} )();
