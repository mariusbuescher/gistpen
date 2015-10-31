(function( module, exports, require ) {
  'use strict';

  const Crypto = require('crypto');

  exports.index = {
    auth: 'github',
    handler: function( request, reply ) {

      const redirectPath = request.query.redirect || '/';

      if (!request.auth.isAuthenticated) {
        return reply('Authentication failed due to: ' + request.auth.error.message);
      }

      const sessionId = Crypto.randomBytes(16).toString('hex');
      const sessionData = {
        githubToken: request.auth.credentials.token
      };

      request.server.app.cache.set(sessionId, sessionData, 0, function(err) {

        request.auth.session.set( { sid: sessionId } );

        return reply.redirect(redirectPath);
      } );
    }
  };

  exports.logout = {
    auth: 'session',
    handler: function( request, reply ) {

       // Delete session data from cache
      request.server.app.cache.drop(request.auth.credentials.id, function(err) {
        if (err) {
          return reply(err);
        }

        request.auth.session.clear();

        return reply( 'Successfuly logged out' );
      });

    }
  }

})( module, exports, require );
