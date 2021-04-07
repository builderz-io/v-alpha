
/**

Uncomment STEP A and run,
then comment STEP A and uncomment STEP B and run

*/

const fs = require( 'fs' );
const sourceFile = fs.readFileSync( './source/trinity-entities-mongo.json', ( err, data ) => data );
const sourceData = JSON.parse( sourceFile );

const namespaceInit = require( '../functions/resolvers/resolve/namespace-init' );
const findByFullId = require( '../functions/resolvers/resolve/find-by-fullid' );

/** STEP A */
// runBaseImport();

/** STEP B */
// updateFieldsInX();

async function runBaseImport() {

  for ( let i = 0; i < sourceData.length; i++ ) {
    const x = sourceData[i];
    switch ( x.profile.role ) {
    case 'member':
      x.profile.role = 'Person';
      break;
    case 'network':
      x.profile.role = 'Network';
      break;
    case 'business':
      x.profile.role = 'Business';
      break;
    case 'nonprofit':
      x.profile.role = 'NGO';
      break;
    }

    const compatibleData = {
      b: '', // added to pass validation
      c: x.profile.role,
      gImporter: 'faithfinance.app',
      i: x.private.evmCredentials.address,
      j: x.receivingAddresses ? x.receivingAddresses.evm : null,
      m: x.profile.title,
      nImporter: x.profile.tag,
      profileInputServerSide: {
        descr: x.properties ? x.properties.description : null,
        email: x.social ? x.social.email : null,
        // target: x.properties ? x.properties.target ? Number( x.properties.target ) : null : null,
        // unit: x.properties ? x.properties.unit : null,
        lngLat: x.geometry ? x.geometry.coordinates : null,
        loc: x.properties ? x.properties.baseLocation : null,
        tinyImg: x.tinyImage ? 'data:image/jpeg;base64,' + x.tinyImage.blob.$binary.base64 : null,
        thumb: x.thumbnail ? 'data:image/jpeg;base64,' + x.thumbnail.blob.$binary.base64 : null,
        medImg: x.mediumImage ? 'data:image/jpeg;base64,' + x.mediumImage.blob.$binary.base64 : null,
        imgName: x.tinyImage ? x.tinyImage.originalName : null,
      },
      authInputServerSide: {
        fImporter: x.private.uPhrase,
        i: x.private.evmCredentials.address,
        j: x.private.evmCredentials.privateKey || null,
      },
    };

    await namespaceInit( {}, compatibleData );

  }
  console.log( 'DONE importing' );
}

async function updateFieldsInX() {

  // Connect to firebase database
  const { namespaceDb } = require( '../functions/resources/databases-setup' );
  const { profileDb } = require( '../functions/resources/databases-setup' );

  const colE = namespaceDb.database().ref( 'entities' );
  const colP = profileDb.database().ref( 'profiles' );

  for ( let i = 0; i < sourceData.length; i++ ) { // sourceData.length
    if ( sourceData[i].adminOf.length > 1 ) {
      console.log( sourceData[i].adminOf.length, sourceData[i].adminOf[0], sourceData[i].adminOf[1] );

      const creatorTitle = sourceData[i].adminOf[0].split( ' #' )[0];
      const creatorTag = '#' + sourceData[i].adminOf[0].split( ' #' )[1];
      const creator = await findByFullId( {}, creatorTitle, creatorTag );

      // console.log( creator );
      // Kevin's uuidE: wrTDuhrDosOyVEtNwqbCkc
      // Kevin's address: 0xea9e36a86d4df56ccc0eb202ff69f64a3f00a4a2

      for ( let j = 1; j < sourceData[i].adminOf.length; j++ ) { // sourceData[i].adminOf.length
        if ( !sourceData[i].adminOf[j] ) { continue }
        const targetEntityTitle = sourceData[i].adminOf[j].split( ' #' )[0];
        const targetEntityTag = '#' + sourceData[i].adminOf[j].split( ' #' )[1];
        const targetEntity = await findByFullId( {}, targetEntityTitle, targetEntityTag );
        // console.log( targetEntity[0], JSON.stringify( targetEntity[0].x.b ) );
        const newArrayP = [targetEntity[0].d, creator[0].a];
        const newArrayE = [targetEntity[0].a, creator[0].a];
        await new Promise( resolve => {
          colP.child( targetEntity[0].d ).update( { 'x/a': creator[0].a, 'x/b': newArrayP }, () => {
            colE.child( targetEntity[0].a ).update( { 'x/a': creator[0].a, 'x/b': newArrayE }, () => resolve( 'updated targetEntity' ) );
          } );
        } );
        const newTargetEntity = await findByFullId( {}, targetEntityTitle, targetEntityTag );
        console.log( newTargetEntity );
      }
    }
  }

  console.log( 'DONE updating' );
}
