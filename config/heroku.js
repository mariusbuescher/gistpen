(function( module, process ) {
  'use strict';

  module.exports = {
    server: {
      host: '0.0.0.0',
      port: process.env.PORT
    },

    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      encryptionPassword: process.env.GITHUB_ENCRYPTION_PASSWORD
    }
  };

})( module, process );
