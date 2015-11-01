(function ( module, exports, require ) {
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

      github.gists.getFromUser({
        user: request.auth.credentials.username
      }, function ( err, gists ) {

        if ( err ) {
          return reply( err );
        }

        const gistsArray = gists.map(function( gist ) {
          return gist.id;
        });

        reply( 'Your gists: ' + gistsArray.join(', ') );

      });
    }
  };
})( module, exports, require );
