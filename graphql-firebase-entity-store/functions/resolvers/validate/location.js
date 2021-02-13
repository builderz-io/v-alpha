
module.exports = ( data, validator ) => {

  const loc = data.profileInputServerSide.loc;
  const lngLat = data.profileInputServerSide.lngLat;

  if ( loc ) {
    if ( !lngLat || lngLat.length != 2 ) {
      throw new Error( 'geoData is incomplete - select from suggestions' );
    }
    else if( loc.length > 200 ) {
      throw new Error( 'location max chars 200' );
    }
  }

  if ( lngLat ) {
    if(
      !validator.isNumeric( lngLat[0] + '' ) ||
      !validator.isNumeric( lngLat[1] + '' )
    ) {
      throw new Error( 'lat and long must be numeric' );
    }
    else if( lngLat[0] < -180 || lngLat[0] > 180 ) {
      throw new Error( 'Long geoData out of range' );
    }
    else if( lngLat[1] < -90 || lngLat[1] > 90 ) {
      throw new Error( 'Lat geoData out of range' );
    }
  }

  return true;
};
