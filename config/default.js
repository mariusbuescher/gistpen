(function( module ) {
  'use strict';

  module.exports = {
    server: {
      host: '0.0.0.0',
      port: 3000
    },

    github: {
      clientId: 'your-client-id-here',
      clientSecret: 'your-client-secret-here',
      encryptionPassword: 'github-encryption-password',
      userAgent: 'gistpen'
    },

    sass: {
      outputStyle: 'compressed',
      sourceComments: false
    },

    session: {
      encryptionPassword: 'your-custom-password',
      cookie: 'gistpen',
      expires: 3 * 24 * 60 * 60 * 1000
    },

    mongodb: {
      url: 'mongodb://localhost/gistpen'
    },

    redis: {
      host: '127.0.0.1',
      port: '6379',
      password: ''
    }
  };

})( module );
