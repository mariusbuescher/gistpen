(function( module, require ) {
  'use strict';

  const Config = require( 'config' );
  const GitHubApi = require( 'github' );

  const github = new GitHubApi({
    // required
    version: '3.0.0',
    protocol: 'https',
    host: 'api.github.com', // should be api.github.com for GitHub
    timeout: 5000,
    headers: {
      'user-agent': Config.github.userAgent,
    },
  });

  module.exports = github;
})( module, require );
