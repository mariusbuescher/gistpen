(function ( module, require ) {
  'use strict';

  const Index = require( './controllers/index' );
  const Login = require( './controllers/login' );
  const Gist = require( './controllers/gist' );

  module.exports = [
    { method: 'GET', path: '/', config: Index.index },
    { method: 'GET', path: '/login', config: Login.index },
    { method: 'GET', path: '/logout', config: Login.logout },
    { method: 'GET', path: '/gist', config: Gist.index }
  ];

})( module, require );
