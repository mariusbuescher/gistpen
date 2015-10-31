(function( module ) {
  'use strict';

  module.exports = {
    server: {
      port: 3000
    },

    github: {
      clientId: 'your-client-id-here',
      clientSecret: 'your-client-secret-here',
      encryptionPassword: 'github-encryption-password',
      userAgent: 'gistpen'
    },

    session: {
      encryptionPassword: 'your-custom-password',
      cookie: 'gistpen',
      expires: 3 * 24 * 60 * 60 * 1000
    },

    redis: {
      host: '127.0.0.1',
      port: '6379',
      password: ''
    }
  };

})( module );
