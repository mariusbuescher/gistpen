(function( module, require ) {
  'use strict';

  const Config = require('config');

  module.exports = function( file ) {
    return '/assets/' + Config.assets.version + '/' + file;
  };
})( module, require );
