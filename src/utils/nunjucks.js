( function( module, require ) {
  'use strict';

  const Nunjucks = require( 'nunjucks' );
  let env;

  module.exports.compile = function( template, options, callback ) {
    const async = ( typeof callback === 'function' );

    if ( async ) {
      let err = null;

      if ( env === undefined ) {
        err = {
          message: 'You did not call the configure method. Please call it to generate a nunjucks environment',
        };
      }

      callback( err, function( context, options, next ) {
        env.renderString( template, context, next );
      } );
    } else {
      return function( context ) {
        if ( env === undefined ) {
          const err = { message: 'You did not call the configure method. Please call it to generate a nunjucks environment' };
          throw err;
        }
        return env.renderString( template, context );
      };
    }
  };

  module.exports.configure = function( path, options ) {
    env = Nunjucks.configure( path, options );
    return env;
  };
} )( module, require );
