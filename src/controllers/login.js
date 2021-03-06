(function( module, exports, require ) {
  'use strict';

  const Crypto = require('crypto');

  const User = require( '../models/user' );

  const github = require( '../utils/github' );

  exports.index = {
    auth: 'github',
    handler: function( request, reply ) {
      const redirectPath = request.query.redirect || '/';

      if (!request.auth.isAuthenticated) {
        return reply('Authentication failed due to: ' + request.auth.error.message);
      }

      github.authenticate({
        type: 'oauth',
        token: request.auth.credentials.token,
      });

      github.user.get({}, function( err, user ) {
        if ( err ) {
          return reply( err );
        }

        const sessionId = Crypto.randomBytes(16).toString('hex');
        const sessionData = {
          githubToken: request.auth.credentials.token,
          githubUsername: user.login,
        };

        User.find( {
          username: user.login,
        }).exec( function( err, user ) {
          if ( err ) {
            return reply( err );
          }

          if (user.length === 0) {
            const newUser = new User({
              username: sessionData.githubUsername,
            });

            newUser.save();
          }

          request.server.app.cache.set(sessionId, sessionData, 0, function(err) {
            if (err) {
              return reply(err);
            }

            request.auth.session.set( { sid: sessionId } );

            return reply.redirect(redirectPath);
          } );
        } );
      } );
    },
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

        return reply.view( 'login/logout', {
          authentication: {
            authenticated: false,
          },
        } );
      });
    },
  };
})( module, exports, require );
