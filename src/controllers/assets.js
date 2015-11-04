( function( module, exports, require ) {
  'use strict';

  const Config = require( 'config' );

  exports.css = {
    handler: function( request, reply ) {
      const Sass = require( 'node-sass' );
      const Path = require( 'path' );

      Sass.render( {
        file: Path.join( __dirname, '../resources/components/sass/' + request.params.filename + '.scss' ),
        outputStyle: Config.sass.outputStyle,
        sourceComments: Config.sass.sourceComments
      }, function( err, result ) {
        reply( result.css )
          .type('text/css');
      } );
    }
  };
} )( module, exports, require );
