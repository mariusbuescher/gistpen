(function( require ) {
  'use strict';

  const Config = require( 'config' );
  const Hapi = require( 'hapi' );

  const server = new Hapi.Server();

  server.connection( {
    port: Number( process.env.PORT ) || Config.server.port
  } );

  server.register( [
    require( 'bell' )
  ], function( err ) {

    if( err ) {
        throw err;
    }

    server.auth.strategy('github', 'bell', {
        provider: 'github',
        password: Config.github.encryptionPassword,
        clientId: Config.github.clientId,
        clientSecret: Config.github.clientSecret,
        scope: [ 'user:email', 'gist' ],
        isSecure: false     // Terrible idea but required if not using HTTPS
    });

    server.route( [
      { method: 'GET', path: '/', config: {
          auth: 'github',
          handler: function( request, reply ) {

            if (!request.auth.isAuthenticated) {
              return reply('Authentication failed due to: ' + request.auth.error.message);
            }

            return reply( 'Authentication successful' );
          }
        }
      }
    ] );
    server.start( function () {
      console.log( 'Server running at:', server.info.uri );
    } );
  } );
})( require );
