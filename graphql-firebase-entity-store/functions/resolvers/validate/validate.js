
/* eslint global-require: "off" */

module.exports = async ( context, data, objToUpdate ) => {
  console.log( 'data to validate:', data );

  if ( !objToUpdate && data.profileInputServerSide ) {

    /** Check whether the role is valid. */

    require( './role' )( data );

    /** Check whether the title is valid. */

    require( './title' )( data );

    /** Check whether the location is valid. */

    if ( data.profileInputServerSide.loc ) {
      data.profileInputServerSide.loc = require( '../../resources/max-chars' )( data.profileInputServerSide.loc, 200 );
      require( './location' )( data.profileInputServerSide.loc, data.profileInputServerSide.lngLat );
    }

    /**
     * Check whether both target and unit are provided and valid,
     * if one of them is present in data.
     */

    if ( data.profileInputServerSide.target || data.profileInputServerSide.unit ) {
      require( './target' )( data );
    }

    /** Check whether the image is valid. */

    if ( data.profileInputServerSide.thumb ) {
      await require( './image' )( data.profileInputServerSide.thumb );
      await require( './image' )( data.profileInputServerSide.medImg );
    }

    /**
     * Cast a tag and check whether combination of tile and tag exists.
     */

    await require( './tag' )( context, data );

    /** Check whether the description is valid. */

    if ( data.profileInputServerSide.descr ) {
      await require( './description' )( data );
    }
  }
  else if ( !objToUpdate && data.b.includes( '/e' ) ) {
    console.log( 'todo: validate client side entity data' );
  }
  else if ( !objToUpdate && data.b.includes( '/p' ) ) {
    console.log( 'todo: validate client side profile data' );
  }
  else if ( objToUpdate && objToUpdate.b.includes( '/e' ) ) {

    if ( data.m ) {
      require( './title' )( data );
    }

    if ( data.j ) {
      require( './receiving-address' )( data.j );
    }

    if ( data.y && data.y.m ) {
      require( './status' )( data.y.m );
    }

  }
  else if ( objToUpdate && objToUpdate.b.includes( '/p' ) ) {

    if ( data.m ) {

      if ( data.m.a ) {

        /** Allow max chars. */
        data.m.a = require( '../../resources/max-chars' )( data.m.a, 2200 );

        /** Check for spammy links. */
        const filteredText = await require( './utils/link-blocker' )( data.m.a );

        /**
         * If links were blocked, also store a filtered version of the description,
         * or remove the filtered version on correction
         */

        data.m.r = filteredText;
      }

      if ( data.m.b ) {
        require( './email' )( data.m.b );
      }

      if ( data.m.c ) {
        data.m.c = require( '../../resources/max-chars' )( data.m.c, 100 );
        require( './preferred-langs' )( data.m.c );
      }

      /**
       * data.m.m
       * - is converted to 0 when entering nothing (''), which bypasses the validation
       * - is converted to null in frontend when entering a string, which hits the error in validation
       */

      if ( data.m.m || data.m.m === null ) {
        console.log( 'we are here' );
        require( './target' )( {
          profileInputServerSide: {
            target: data.m.m,
            unit: 'mocked', // mocked unit
          },
        } );
      }

      if ( data.m.n ) {
        require( './target' )( {
          profileInputServerSide: {
            unit: data.m.n,
            target: 111, // mocked target
          },
        } );
      }

    }

    if ( data.n && data.n.b ) {
      data.n.b = require( '../../resources/max-chars' )( data.n.b, 200 );

      require( './location' )( data.n.b, data.n.a );
    }

    if ( data.o ) {
      await require( './image' )( data.o.b );
      await require( './image' )( data.o.c );
    }

    if ( data.q ) {
      const checkLinks = require( './utils/link-blocker' );
      for ( const question in data.q ) {
        if ( data.q.hasOwnProperty( question ) ) {
          const checked = await checkLinks( data.q[question] );
          checked ? data.q[question] = checked : null;
        }
      }
    }

  }

  /**
   * At this point the validation has passed.
   */

  return true;

};
