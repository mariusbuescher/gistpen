(function( module, exports, require ) {
  'use strict';

  const github = require( '../utils/github' );

  exports.index = {
    auth: {
      mode: 'required',
      strategy: 'session',
    },
    handler: function( request, reply ) {

      github.authenticate({
        type: 'oauth',
        token: request.auth.credentials.token
      });

      const user = github.user.get({}, function ( err, user ) {

        if ( err ) {
          return reply( err );
        }

        reply( 'Hello ' + ( user.name || user.login ) );

      });
    }
  }

})( module, exports, require );
