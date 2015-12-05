(function( module, exports ) {
  'use strict';

  exports.index = {
    handler: function( request, reply ) {
      request.server.auth.test( 'session', request, function( err, credentials ) {
        if ( err ) {
          return reply.view( 'index/index', {
            path: request.path,
            authentication: {
              authenticated: false,
            },
          });
        }

        reply.view( 'index/index', {
          path: request.path,
          authentication: {
            authenticated: true,
            username: credentials.username,
          },
        });
      });
    },
  };
})( module, exports );
