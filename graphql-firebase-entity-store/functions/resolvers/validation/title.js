const { castEntityTitle } = require( '../v-core' );

module.exports = data => {

  if ( !data.c ) {
    throw new Error( '-5121 ' + 'role must be present when validating title' );
  }

  if ( data.m == '' || data.m ) {
    const title = castEntityTitle( data.m, data.c );

    if ( !title.success ) {
      throw new Error( '-5120 ' + title.message );
    }
    else {
      data.m = title.data[0];
    }
  }

  return true;
};
