const { castEntityTitle } = require( '../../resources/v-core' );
const findByFullId = require( '../resolve/find-by-fullid' );

let exists;

module.exports = async ( data, objToUpdate ) => {

  if ( !data.c ) {
    throw new Error( '-5121 ' + 'role must be present when validating title' );
  }

  if ( data.m == '' || data.m ) {
    const title = castEntityTitle( data.m, data.c );

    if ( !title.success ) {
      throw new Error( '-5120 ' + title.message );
    }

    /** Check whether title and tag combination exists when user updates title */
    if (
      objToUpdate
      && objToUpdate.b.includes( '/e' )
    ) {
      exists = await findByFullId( { /* no need for context object */ }, title.data[0], objToUpdate.n );
    }

    if ( exists && exists[0].a ) {
      throw new Error( '-5130 ' + 'Title and tag combination exists' );
    }
    else {
      data.m = title.data[0];
    }
  }

  return true;
};
