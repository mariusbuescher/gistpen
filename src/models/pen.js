(function( module, require ) {
  'use strict';

  const mongoose = require( 'mongoose' );
  const Schema = mongoose.Schema;

  const Pen = new Schema({
    id: Schema.ObjectId,
    user: String,
    gist: String,
  });

  module.exports = mongoose.model( 'Pen', Pen );
})( module, require );
