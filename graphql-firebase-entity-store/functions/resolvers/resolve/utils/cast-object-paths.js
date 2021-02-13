module.exports = ( data ) => {

  /**
   * Cast Firebase-compatible object with paths, e.g.
   *      {'m': {'a': 'hello world'}}
   *   => {'m/a': 'hello world'}
   */

  const newObj = {};
  for ( const k in data ) {
    if ( typeof data[k] == 'object' ) {
      for ( const k2 in data[k] ) {
        if ( typeof data[k][k2] == 'object' ) {
          for ( const k3 in data[k][k2] ) {
            data[k][k2][k3] != undefined ? newObj[k + '/' + k2 + '/' + k3] = data[k][k2][k3] : null;
          }
        }
        else {
          data[k][k2] != undefined ? newObj[k + '/' + k2] = data[k][k2] : null;
        }
      }
    }
    else {
      data[k] != undefined ? newObj[k] = data[k] : null;
    }
  }

  return newObj;
};
