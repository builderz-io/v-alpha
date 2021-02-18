
var Jimp = require( 'jimp' );

module.exports = async base64ImgString => {

  const base64Img = base64ImgString.split( ',' )[1];
  const buffer = new Buffer.from( base64Img, 'base64' );

  const check = await Jimp.read( buffer )
    .then( img => {
      if ( img.bitmap.width > 0 && img.bitmap.height > 0 ) {
        return true;
      }
      else {
        return false;
      }
    } )
    .catch( function( err ) {
      console.log( err );
    } );

  if ( check == false ) {
    throw new Error( '-5160 invalid image' );
  }
  // showMemoryUsage();

  return true;
};
//
// function showMemoryUsage() {
//   console.log( 'Process: %s - %s MB ', new Date(), process.memoryUsage().rss / 1048576, process.memoryUsage() );
// }
