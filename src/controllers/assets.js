( function( module, exports, require ) {
  'use strict';

  const Config = require( 'config' );

  exports.css = {
    handler: function( request, reply ) {
      const Sass = require( 'node-sass' );
      const Path = require( 'path' );

      request.server.app.assetsCache.get(request.params.filename + '.css', function( err, result ) {

        if ( err ) {
          return reply( err );
        }

        if ( !result || Config.production === false ) {
          Sass.render( {
            file: Path.join( __dirname, '../resources/components/sass/' + request.params.filename + '.scss' ),
            outputStyle: Config.sass.outputStyle,
            sourceComments: Config.sass.sourceComments
          }, function( err, result ) {
            request.server.app.assetsCache.set( request.params.filename + '.css', {
              css: result.css.toString('utf-8')
            } );
            reply( result.css )
              .type('text/css');
          } );
          return;
        }

        return reply( result.css )
          .type('text/css');

      } );


    }
  };
} )( module, exports, require );
