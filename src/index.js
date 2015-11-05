(function( module, require ) {
  'use strict';

  const Config = require( 'config' );
  const Hapi = require( 'hapi' );
  const Path = require( 'path' );

  const Nunjucks = require( './utils/nunjucks' );

  const mongoose = require( 'mongoose' );
  mongoose.connect( Config.mongodb.url );

  const server = new Hapi.Server({
    cache: {
      engine: require('catbox-redis'),
      host: Config.redis.host,
      port: Config.redis.port,
      password: Config.redis.password
    }
  });

  server.connection( {
    host: Config.server.host,
    port: Number( process.env.PORT ) || Config.server.port
  } );

  server.register( [
    require('hapi-auth-cookie'),
    require( 'bell' ),
    require( 'vision' )
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

    server.auth.strategy('session', 'cookie', {
      password: Config.session.encryptionPassword,
      cookie: Config.session.cookie,
      redirectTo: '/login',
      isSecure: false,
      validateFunc: function(request, session, callback) {

        request.server.app.cache.get(session.sid, function(err, value, cached, report) {
          var creds = {
            id: session.sid,
            token: value.githubToken,
            username: value.githubUsername
          };

          if (err) {
            return callback(err, false);
          }

          if (!cached) {
            return callback(null, false);
          }

          return callback(null, true, creds);
        });
      },
    });

    const viewPath = Path.join( __dirname, 'views' );
    const nunjucksEnv = Nunjucks.configure( viewPath );

    server.views( {
      engines: {
        njs: Nunjucks
      },
      path: Path.join( viewPath, 'templates' )
    } );

    server.app.cache = server.cache({
      segment: 'sessions',
      expiresIn: Config.session.expires
    });

    const routes = require( './routes' );

    server.route( routes );
    server.start( function () {
      console.log( 'Server running at:', server.info.uri );
    } );
  } );

  module.exports = server;
})( module, require );
