module.exports = ( data ) => {

  /**
   * Cast Firebase-compatible object with paths, e.g.
   *      {'m': {'a': 'hello world'}}
   *   => {'m/a': 'hello world'}
   */

  const newObj = {};
  for ( const k in data ) {
    if ( data.hasOwnProperty( k ) ) {
      if ( typeof data[k] == 'object' && data[k] != null ) {
        for ( const k2 in data[k] ) {
          if ( data[k].hasOwnProperty( k2 ) ) {
            if ( typeof data[k][k2] == 'object' && data[k][k2] != null ) {
              for ( const k3 in data[k][k2] ) {
                if ( data[k][k2].hasOwnProperty( k3 ) ) {
                  data[k][k2][k3] !== undefined ? newObj[k + '/' + k2 + '/' + k3] = data[k][k2][k3] : null;
                }
              }
            }
            else {
              data[k][k2] !== undefined ? newObj[k + '/' + k2] = data[k][k2] : null;
            }
          }
        }
      }
      else {
        data[k] !== undefined ? newObj[k] = data[k] : null;
      }
    }
  }

  return newObj;
};
