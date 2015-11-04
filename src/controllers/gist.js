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

        reply.view( 'gist/index', {
          gists: gists
        } );

      });
    }
  };

  exports.show = {
    auth: {
      mode: 'required',
      strategy: 'session',
    },
    handler: function( request, reply ) {
      github.authenticate({
        type: 'oauth',
        token: request.auth.credentials.token
      });

      github.gists.get({
        id: request.params.id
      }, function( err, gist ) {

        if ( err ) {
          reply( err )
        }

        reply.view( 'gist/show', {
          gist: gist
        } );
      })
    }
  };

})( module, exports, require );
