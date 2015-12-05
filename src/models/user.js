(function( module, require ) {
  'use strict';

  const mongoose = require( 'mongoose' );
  const Schema = mongoose.Schema;

  const User = new Schema({
    username: String,
  });

  module.exports = mongoose.model( 'User', User );
})( module, require );
