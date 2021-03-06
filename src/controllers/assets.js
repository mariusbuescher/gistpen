( function( module, exports, require ) {
  'use strict';

  const Config = require( 'config' );
  const Path = require( 'path' );
  const Fs = require( 'fs' );

  exports.css = {
    cache: {
      expiresIn: ( Config.production === true ) ? Config.assets.clientCacheTTL : 0,
    },
    handler: function( request, reply ) {
      const Sass = require( 'node-sass' );
      const sassGlobbing = require( 'node-sass-globbing' );
      const Path = require( 'path' );

      const assetName = request.params.resourceVersion + '/' + request.params.filename + '.css';

      request.server.app.assetsCache.get( assetName, function( err, result ) {
        if ( err ) {
          return reply( err );
        }

        if ( !result || Config.production === false ) {
          Sass.render( {
            importer: sassGlobbing,
            file: Path.join( __dirname, '../resources/components/sass/' + request.params.filename + '.scss' ),
            outputStyle: Config.sass.outputStyle,
            sourceComments: Config.sass.sourceComments,
          }, function( err, result ) {
            if ( err ) {
              return reply( err );
            }

            request.server.app.assetsCache.set( assetName, {
              css: result.css.toString('utf-8'),
              version: request.params.resourceVersion,
            } );
            reply( result.css )
              .type('text/css');
          } );
          return null;
        }

        return reply( result.css )
          .type('text/css');
      } );
    },
  };

  exports.js = {
    cache: {
      expiresIn: ( Config.production === true ) ? Config.assets.clientCacheTTL : 0,
    },
    handler: function( request, reply ) {
      const browserify = require( 'browserify' );
      const Path = require( 'path' );

      const assetName = request.params.resourceVersion + '/' + request.params.filename + '.js';

      request.server.app.assetsCache.get( assetName, function( err, result ) {
        if ( err ) {
          return reply( err );
        }

        if ( !result || Config.production === false ) {
          const b = browserify( Path.join( __dirname, '../resources/components/app/' + request.params.filename + '.js' ), {
            debug: !Config.production,
            standalone: 'App',
          } );

          b.bundle( function( err, js ) {
            if ( err ) {
              return reply( err );
            }

            request.server.app.assetsCache.set( assetName, {
              js: js.toString('utf-8'),
              version: request.params.resourceVersion,
            } );

            reply( js )
              .type('text/javascript');
          } );

          return null;
        }

        return reply( result.js )
          .type('text/javascript');
      } );
    },
  };

  exports.static = {
    cache: {
      expiresIn: ( Config.production === true ) ? Config.assets.clientCacheTTL : 0,
    },
    handler: function( request, reply ) {
      if ( request.params.filepath.match(/\.js$/) === null ) {
        return reply( {
          statusCode: 404,
          error: 'Not Found',
        } )
          .code(404);
      }

      const filePath = Path.join( __dirname, '../resources/components/' + request.params.filepath );

      Fs.readFile( filePath, function( err, content ) {
        if ( err ) {
          return reply( {
            statusCode: 404,
            error: 'Not Found',
          } )
            .code(404);
        }

        reply( content )
          .type( 'text/javascript' );
      } );
    },
  };
} )( module, exports, require );
