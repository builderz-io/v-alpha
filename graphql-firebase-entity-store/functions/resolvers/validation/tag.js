const { castTag } = require( '../../resources/v-core' );
const { findByFullId } = require( '../resolve/resolve' );

let tag, exists, counter = 1;

module.exports = async ( context, data, objToUpdate ) => {

  if ( !data.m ) {
    throw new Error( '-5141 ' + 'title must be present when casting tag' );
  }

  await checkTitleTagCombination( context, data, objToUpdate );

  while ( exists[0].a && counter <= 50 ) {
    counter += 1;
    await checkTitleTagCombination( context, data, objToUpdate );
  }

  if ( exists[0].a ) {
    throw new Error( '-5140 ' + 'combination of title and tag already exists' );
  }
  else {
    data.n = tag;
  }

  return true;

};

async function checkTitleTagCombination( context, data, objToUpdate ) {
  tag = objToUpdate ? objToUpdate.n : castTag();
  exists = await findByFullId( context, data.m, tag );
}
