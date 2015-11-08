(function( module, exports, require ) {
  'use strict';

  const github = require( '../utils/github' );

  exports.index = {
    handler: function( request, reply ) {

      request.server.auth.test( 'session', request, function( err, credentials ) {

        if ( err ) {
          return reply.view( 'index/index', {
            authentication: {
              authenticated: false
            }
          });
        }

        reply.view( 'index/index', {
          authentication: {
            authenticated: true,
            username: credentials.username
          }
        });

      });
    }
  }

})( module, exports, require );
