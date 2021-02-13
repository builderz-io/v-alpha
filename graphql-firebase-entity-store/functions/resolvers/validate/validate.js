
/* eslint global-require: "off" */

const validator = require( 'validator' );

module.exports = async ( context, data, objToUpdate ) => {
  console.log( 'data to validate:', data, objToUpdate );

  if ( !objToUpdate ) {

    /** Check whether the role is valid. */

    require( './role' )( data );

    /** Check whether the title is valid. */

    require( './title' )( data );

    /** Check whether the location is valid. */

    require( './location' )( data, validator );

    /**
     * Check whether both target and unit are provided and valid,
     * if one of them is present in data.
     */

    require( './target' )( data, validator );

    /** Check whether the image is valid. */

    // TODO
    // require( './image' )( data );

    /**
     * Cast a tag and check whether combination of tile and tag exists.
     */

    await require( './tag' )( context, data );

    /** Check whether the description is valid. */

    // TODO
    // require( './description' )( data );

  }
  else if ( objToUpdate && objToUpdate.b.includes( '/e' ) ) {
    console.log( 'objToUpdate E', objToUpdate );
    // TODO
    // title
    // receivingAddress
    // status

  }
  else if ( objToUpdate && objToUpdate.b.includes( '/p' ) ) {
    console.log( 'objToUpdate P', objToUpdate );
    // TODO
    // descr
    // questionnaire
    // email
    // preferredLangs
    // target (whereas the other is already stored)
    // unit (whereas the other is already stored)
    // location
    // images

  }

  /**
   * At this point the validation has passed.
   */

  return true;

};
