( function( module, exports, require ) {
  'use strict';

  exports.css = {
    handler: function( request, reply ) {
      const Sass = require( 'node-sass' );
      const Path = require( 'path' );

      Sass.render( {
        file: Path.join( __dirname, '../resources/components/sass/' + request.params.filename + '.scss' )
      }, function( err, result ) {
        reply( result.css )
          .type('text/css');
      } );
    }
  };
} )( module, exports, require );
