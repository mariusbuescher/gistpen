(function() {
  'use strict';

  const Config = require( 'config' );
  const Hapi = require( 'hapi' );

  const server = new Hapi.Server();

  server.connection( {
    port: Number( process.env.PORT ) || Config.server.port
  } );

  server.register( [], function( err ) {

    if( err ) {
        throw err;
    }

    server.route( [
      { method: 'GET', path: '/', handler: function( request, reply ) {
        reply( 'Hello World' );
      } },
    ] );
    server.start( function () {
      console.log( 'Server running at:', server.info.uri );
    } );
  } );
})();
