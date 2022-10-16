/* eslint global-require: "off" */

module.exports = {
  Query: {
    getEntities: ( parent, args, { context } ) => {
      if ( args.where.m && args.where.n ) {
        return require( './find-by-fullid' )( context, args.where.m, args.where.n );
      }
      else if ( args.where.i ) {
        return require( './find-by-evmaddress' )( context, args.where.i );
      }
      else if ( args.where.a ) {
        return require( './find-by-uuide' )( context, args.where.a );
      }
      else {
        return require( './get-all-entities' )( context );
      }
    },
    getProfile: ( parent, args, { context } ) => require( './get-single-profile' )( context, args.where.a ),
    getProfiles: ( parent, args, { context } ) => require( './get-profiles' )( context, args.array ),
    getEntityQuery: ( parent, args, { context } ) => require( './filter-entities' )( context, args.filter ),
    getEmphasis: ( parent, args, { context } ) => require( './get-emphasis' )( context, args.where.emphasis ),
    getPoints: ( parent, args, { context } ) => require( './get-points' )( context, args.where ),
    getImage: ( parent, args, { context } ) => require( './get-image' )( context, args.where.a ),
  },
  Mutation: {
    setAuth: ( parent, __, { context, res } ) => require( './set-auth' )( context, res ),
    setDisconnect: ( parent, __, { context, res } ) => require( './set-disconnect' )( context, res ),
    setTransaction: ( parent, { tx }, { context } ) => require( './set-transaction' )( context, tx, 'managed' ),
    setEntity: ( parent, { input }, { context } ) => require( './set-namespace' )( context, input, 'entity' ),
    setProfile: ( parent, { input }, { context } ) => require( './set-namespace' )( context, input, 'profile' ),
    setImage: ( parent, { input }, { context } ) => require( './set-namespace' )( context, input, 'image' ),
    setHighlight: ( parent, { input }, { context } ) => require( './set-highlight' )( context, input ),
  },
};

// function setNewExpiryDate( context ) {
//   const unix = Math.floor( Date.now() / 1000 );
//   const expires = String( unix + 60 * 60 * 24 * 365 * 2 );
//   const input = { input: { a: context.m, y: { c: expires } } };
//   setNamespace( colE, input, context );
// }
