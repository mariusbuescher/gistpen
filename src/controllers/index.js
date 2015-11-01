(function( module, exports, require ) {
  'use strict';

  const Config = require( 'config' );
  const GitHubApi = require( 'github' );

  const github = new GitHubApi({
    // required
    version: '3.0.0',
    protocol: 'https',
    host: 'api.github.com', // should be api.github.com for GitHub
    timeout: 5000,
    headers: {
        'user-agent': Config.github.userAgent
    }
  });

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
