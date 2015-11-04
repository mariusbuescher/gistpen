(function ( module, require ) {
  'use strict';

  const Index = require( './controllers/index' );
  const Login = require( './controllers/login' );
  const Gist = require( './controllers/gist' );

  const Assets = require( './controllers/assets' );

  module.exports = [
    { method: 'GET', path: '/', config: Index.index },
    { method: 'GET', path: '/login', config: Login.index },
    { method: 'GET', path: '/logout', config: Login.logout },
    { method: 'GET', path: '/gist', config: Gist.index },
    { method: 'GET', path: '/gist/{id}', config: Gist.show },

    { method: 'GET', path: '/assets/{filename}.css', config: Assets.css }
  ];

})( module, require );
