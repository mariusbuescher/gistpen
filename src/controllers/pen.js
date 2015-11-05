(function ( module, exports, require ) {
  'use strict';

  const github = require( '../utils/github' );
  const Pen = require( '../models/pen' );

  exports.index = {
    auth: {
      mode: 'optional',
      strategy: 'session',
    },
    handler: function( request, reply ) {
      const pens = Pen.find().exec();
      pens.then(function( pens ) {
        reply.view( 'pen/index', {
          pens
        } );
      });
    }
  };

  exports.new = {
    auth: {
      mode: 'required',
      strategy: 'session',
    },
    handler: function( request, reply ) {
      reply.view( 'pen/new' );
    }
  };

  exports.create = {
    auth: {
      mode: 'required',
      strategy: 'session',
    },
    handler: function( request, reply ) {
      github.authenticate({
        type: 'oauth',
        token: request.auth.credentials.token
      });

      github.gists.create({
        description: request.payload.title,
        public: true,
        files: {
          'Readme.md': {
            content: '# ' + request.payload.title
          },
          'index.html': {
            content: '<!-- your html -->'
          },
          'main.css': {
            content: '// your css'
          },
          'main.js': {
            content: '// your js'
          }
        }
      }, function( err, newGist ) {

        if ( err ) {
          return reply( err );
        }

        let pen = new Pen({
          user: request.auth.credentials.username,
          gist: newGist.id
        });
        pen.save();

        reply.redirect('/pen');
      } );
    }
  };

})( module, exports, require );
