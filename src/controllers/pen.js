(function( module, exports, require ) {
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
          path: request.path,
          authentication: {
            authenticated: true,
            username: request.auth.credentials.username,
          },
          pens,
        } );
      });
    },
  };

  exports.show = {
    auth: {
      mode: 'required',
      strategy: 'session',
    },
    handler: function( request, reply ) {
      github.authenticate({
        type: 'oauth',
        token: request.auth.credentials.token,
      });

      Pen.findById( request.params.id ).exec().then(function( pen ) {
        github.gists.get({
          id: pen.gist,
        }, function( err, gist ) {
          if ( err ) {
            return reply( err );
          }

          reply.view( 'pen/show', {
            path: request.path,
            authentication: {
              authenticated: true,
              username: request.auth.credentials.username,
            },
            pen: {
              title: gist.description,
              files: gist.files,
              author: pen.user,
            },
          } );
        });
      });
    },
  };

  exports.new = {
    auth: {
      mode: 'required',
      strategy: 'session',
    },
    handler: function( request, reply ) {
      reply.view( 'pen/new', {
        path: request.path,
        authentication: {
          authenticated: true,
          username: request.auth.credentials.username,
        },
      } );
    },
  };

  exports.create = {
    auth: {
      mode: 'required',
      strategy: 'session',
    },
    handler: function( request, reply ) {
      github.authenticate({
        type: 'oauth',
        token: request.auth.credentials.token,
      });

      github.gists.create({
        description: request.payload.title,
        public: true,
        files: {
          'Readme.md': {
            content: '# ' + request.payload.title,
          },
          'index.html': {
            content: '<!-- your html -->',
          },
          'main.css': {
            content: '// your css',
          },
          'main.js': {
            content: '// your js',
          },
        },
      }, function( err, newGist ) {
        if ( err ) {
          return reply( err );
        }

        const pen = new Pen({
          user: request.auth.credentials.username,
          gist: newGist.id,
        });
        pen.save();

        reply.redirect('/pen');
      } );
    },
  };
})( module, exports, require );
