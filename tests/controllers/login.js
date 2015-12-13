(function( module, exports, require ) {
  'use strict';

  const Lab = require( 'lab' );
  const Code = require( 'code' );
  const Sinon = require( 'sinon' );
  const lab = exports.lab = Lab.script();
  const proxyquire = require( 'proxyquire' );

  const describe = lab.describe;
  const it = lab.it;
  const expect = Code.expect;

  describe( 'login controller', function() {
    describe( '#index()', function() {
      it( 'should authenticate using github', function( done ) {
        const loginController = require( '../../src/controllers/login.js' );
        expect( loginController.index.auth ).to.be.equal( 'github' );
        done();
      } );

      it( 'should reply with an error when user is not authenticated', function( done ) {
        const fakeMessage = 'test';
        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: false,
            error: {
              message: fakeMessage,
            },
          },
        };
        const mockReply = Sinon.mock();

        const loginController = require( '../../src/controllers/login.js' );
        loginController.index.handler( mockRequest, mockReply );

        mockReply.once().withArgs( 'Authentication failed due to: ' + fakeMessage );
        mockReply.verify();

        done();
      } );

      it( 'should initialize a github api with user token when authenticates', function( done ) {
        const githubMock = {
          authenticate: function() {},
          user: {
            get: function() {},
          },
        };

        const fakeToken = 'test';
        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: fakeToken,
            },
          },
        };
        const expectedArg = {
          type: 'oauth',
          token: fakeToken,
        };

        const mock = Sinon.mock( githubMock );

        const mocks = {
          '../utils/github': githubMock,
        };

        mock.expects( 'authenticate' ).once().withArgs( expectedArg );

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest );

        mock.verify();
        done();
      } );

      it( 'should get user information from github when the user is authenticated', function( done ) {
        const githubMock = {
          authenticate: function() {},
          user: {
            get: function() {},
          },
        };

        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: '',
            },
          },
        };

        const mock = Sinon.mock( githubMock.user );

        const mocks = {
          '../utils/github': githubMock,
        };

        mock.expects( 'get' ).once();

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest );

        mock.verify();
        done();
      } );

      it( 'should reply with an error when github sends an error', function( done ) {
        const fakeError = {};
        const githubMock = {
          authenticate: function() {},
          user: {
            get: function( settings, cb ) {
              cb( fakeError );
            },
          },
        };

        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: '',
            },
          },
        };

        const mockReply = Sinon.mock();

        const mocks = {
          '../utils/github': githubMock,
        };

        mockReply.once().withArgs( fakeError );

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest, mockReply );

        mockReply.verify();
        done();
      } );

      it( 'should create a session ID when github does not send an error', function( done ) {
        const fakeCryptoBytes = {
          toString: function() {},
        };
        const fakeCrypto = {
          randomBytes: function() {},
        };

        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: '',
            },
          },
        };

        const mockCrypto = Sinon.mock( fakeCrypto );

        mockCrypto.expects( 'randomBytes' ).once().returns( fakeCryptoBytes );

        const githubMock = {
          authenticate: function() {},
          user: {
            get: function( temp, cb ) {
              cb( null, {} );
              mockCrypto.verify();
              done();
            },
          },
        };

        const mocks = {
          '../utils/github': githubMock,
          'crypto': fakeCrypto,
        };

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest, function() {} );
      } );

      it( 'should get a user from the database when github does not send an error', function( done ) {
        const fakeQuery = {
          exec: function() {},
        };
        const fakeUser = {
          find: function() {},
        };
        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: '',
            },
          },
        };

        const expectedGithubUser = 'test';
        const fakeGithubUser = {
          login: expectedGithubUser,
        };

        const mockUser = Sinon.mock( fakeUser );
        const mockQuery = Sinon.mock( fakeQuery );

        mockUser.expects( 'find' ).once().withArgs( { username: expectedGithubUser } ).returns( fakeQuery );
        mockQuery.expects( 'exec' ).once();

        const githubMock = {
          authenticate: function() {},
          user: {
            get: function( temp, cb ) {
              cb( null, fakeGithubUser );
              mockUser.verify();
              mockQuery.verify();
              done();
            },
          },
        };

        const mocks = {
          '../utils/github': githubMock,
          '../models/user': fakeUser,
        };

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest, function() {} );
      } );

      it( 'should reply with an error when the database fetch fails', function( done ) {
        const fakeUser = {
          find: Sinon.stub(),
        };
        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: '',
            },
          },
        };

        const expectedGithubUser = 'test';
        const fakeGithubUser = {
          login: expectedGithubUser,
        };

        const githubMock = {
          authenticate: function() {},
          user: {
            get: function( temp, cb ) {
              cb( null, fakeGithubUser );
            },
          },
        };

        const fakeError = {};
        const mockReply = Sinon.mock();

        mockReply.once().withArgs( fakeError );

        const fakeQuery = {
          exec: function( cb ) {
            cb( fakeError, null );
            mockReply.verify();
            done();
          },
        };

        fakeUser.find.returns( fakeQuery );

        const mocks = {
          '../utils/github': githubMock,
          '../models/user': fakeUser,
        };

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest, mockReply );
      } );

      it( 'should create a new user when none is found', function( done ) {
        const mockUser = Sinon.mock();
        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: '',
            },
          },
          server: {
            app: {
              cache: {
                set: function() {},
              },
            },
          },
        };

        const expectedGithubUser = 'test';
        const fakeGithubUser = {
          login: expectedGithubUser,
        };

        const githubMock = {
          authenticate: function() {},
          user: {
            get: function( temp, cb ) {
              cb( null, fakeGithubUser );
            },
          },
        };

        const mockSave = Sinon.mock();

        mockUser.returns( { save: mockSave } );

        mockUser.once().withArgs( { username: expectedGithubUser } );
        mockSave.once();

        const fakeQuery = {
          exec: function( cb ) {
            cb( null, [] );
            mockUser.verify();
            mockSave.verify();
            done();
          },
        };

        mockUser.find = function() { return fakeQuery; };

        const mocks = {
          '../utils/github': githubMock,
          '../models/user': mockUser,
        };

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest );
      } );

      it( 'should save the data to the session', function( done ) {
        const fakeCache = {
          set: function() {},
        };
        const mockCache = Sinon.mock( fakeCache );
        const expectedToken = 'tokenTest';
        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: expectedToken,
            },
          },
          server: {
            app: {
              cache: fakeCache,
            },
          },
        };

        const expectedGithubUser = 'userTest';
        const fakeGithubUser = {
          login: expectedGithubUser,
        };

        const githubMock = {
          authenticate: function() {},
          user: {
            get: function( temp, cb ) {
              cb( null, fakeGithubUser );
            },
          },
        };

        const expectedSessionName = 'sessionTest';

        const fakeBytes = {
          toString: Sinon.stub(),
        };
        const fakeCrypto = {
          randomBytes: Sinon.stub(),
        };

        const expectedSessionData = {
          githubToken: expectedToken,
          githubUsername: expectedGithubUser,
        };

        fakeCrypto.randomBytes.returns( fakeBytes );
        fakeBytes.toString.returns( expectedSessionName );

        mockCache.expects( 'set' ).once().withArgs( expectedSessionName, expectedSessionData );

        const fakeQuery = {
          exec: function( cb ) {
            cb( null, [ {} ] );
            mockCache.verify();
            done();
          },
        };

        const fakeUser = {
          find: function() { return fakeQuery; },
        };

        const mocks = {
          '../utils/github': githubMock,
          '../models/user': fakeUser,
          'crypto': fakeCrypto,
        };

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest );
      } );

      it( 'should reply with an error when cache fails', function( done ) {
        const expectedGithubUser = 'userTest';
        const fakeGithubUser = {
          login: expectedGithubUser,
        };

        const githubMock = {
          authenticate: function() {},
          user: {
            get: function( temp, cb ) {
              cb( null, fakeGithubUser );
            },
          },
        };

        const fakeQuery = {
          exec: function( cb ) {
            cb( null, [ {} ] );
          },
        };

        const fakeUser = {
          find: function() { return fakeQuery; },
        };

        const mocks = {
          '../utils/github': githubMock,
          '../models/user': fakeUser,
        };

        const fakeError = {};
        const mockReply = Sinon.mock();

        mockReply.once().withArgs( fakeError );

        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: '',
            },
          },
          server: {
            app: {
              cache: {
                set: function( name, data, temp, cb ) {
                  cb( fakeError );
                  mockReply.verify();
                  done();
                },
              },
            },
          },
        };

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest, mockReply );
      } );

      it( 'should set bind the session id to the authentication and redirect to index', function( done ) {
        const expectedGithubUser = 'userTest';
        const fakeGithubUser = {
          login: expectedGithubUser,
        };

        const githubMock = {
          authenticate: function() {},
          user: {
            get: function( temp, cb ) {
              cb( null, fakeGithubUser );
            },
          },
        };

        const expectedSessionName = 'sessionTest';

        const fakeBytes = {
          toString: Sinon.stub(),
        };
        const fakeCrypto = {
          randomBytes: Sinon.stub(),
        };

        fakeCrypto.randomBytes.returns( fakeBytes );
        fakeBytes.toString.returns( expectedSessionName );

        const fakeQuery = {
          exec: function( cb ) {
            cb( null, [ {} ] );
          },
        };

        const fakeUser = {
          find: function() { return fakeQuery; },
        };

        const mocks = {
          '../utils/github': githubMock,
          '../models/user': fakeUser,
          'crypto': fakeCrypto,
        };

        const expectedSessionData = {
          sid: expectedSessionName,
        };
        const defaultRedirect = '/';

        const fakeSession = {
          set: function() {},
        };
        const fakeReply = {
          redirect: function() {},
        };

        const mockSession = Sinon.mock( fakeSession );
        const mockReply = Sinon.mock( fakeReply );

        mockSession.expects( 'set' ).once().withArgs( expectedSessionData );
        mockReply.expects( 'redirect' ).once().withArgs( defaultRedirect );

        const mockRequest = {
          query: {},
          auth: {
            isAuthenticated: true,
            credentials: {
              token: '',
            },
            session: fakeSession,
          },
          server: {
            app: {
              cache: {
                set: function( name, data, temp, cb ) {
                  cb( null );
                  mockSession.verify();
                  mockReply.verify();
                  done();
                },
              },
            },
          },
        };

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest, fakeReply );
      } );

      it( 'should redirect to a given page', function( done ) {
        const expectedGithubUser = 'userTest';
        const fakeGithubUser = {
          login: expectedGithubUser,
        };

        const githubMock = {
          authenticate: function() {},
          user: {
            get: function( temp, cb ) {
              cb( null, fakeGithubUser );
            },
          },
        };

        const expectedSessionName = 'sessionTest';

        const fakeBytes = {
          toString: Sinon.stub(),
        };
        const fakeCrypto = {
          randomBytes: Sinon.stub(),
        };

        fakeCrypto.randomBytes.returns( fakeBytes );
        fakeBytes.toString.returns( expectedSessionName );

        const fakeQuery = {
          exec: function( cb ) {
            cb( null, [ {} ] );
          },
        };

        const fakeUser = {
          find: function() { return fakeQuery; },
        };

        const mocks = {
          '../utils/github': githubMock,
          '../models/user': fakeUser,
          'crypto': fakeCrypto,
        };

        const expectedRedirect = 'test';

        const fakeReply = {
          redirect: function() {},
        };

        const mockReply = Sinon.mock( fakeReply );

        mockReply.expects( 'redirect' ).once().withArgs( expectedRedirect );

        const mockRequest = {
          query: {
            redirect: expectedRedirect,
          },
          auth: {
            isAuthenticated: true,
            credentials: {
              token: '',
            },
            session: {
              set: function() {},
            },
          },
          server: {
            app: {
              cache: {
                set: function( name, data, temp, cb ) {
                  cb( null );
                  mockReply.verify();
                  done();
                },
              },
            },
          },
        };

        const loginController = proxyquire( '../../src/controllers/login.js', mocks );
        loginController.index.handler( mockRequest, fakeReply );
      } );
    } );

    describe( '#logout()', function() {
      it( 'should authenticate using the session', function( done ) {
        const loginController = require( '../../src/controllers/login.js' );
        expect( loginController.logout.auth ).to.be.equal( 'session' );
        done();
      } );

      it( 'should drop the session from cache', function( done ) {
        const expectedCredentialsId = 'test';
        const fakeCache = {
          drop: function() {},
        };
        const fakeRequest = {
          server: {
            app: {
              cache: fakeCache,
            },
          },
          auth: {
            credentials: {
              id: expectedCredentialsId,
            },
          },
        };

        const mockCache = Sinon.mock( fakeCache );

        mockCache.expects( 'drop' ).once().withArgs( expectedCredentialsId );

        const loginController = require( '../../src/controllers/login.js' );
        loginController.logout.handler( fakeRequest );
        mockCache.verify();
        done();
      } );

      it( 'should reply with an error when session data could not be droppen', function( done ) {
        const mockReply = Sinon.mock();
        const expectedError = {};

        mockReply.once().withArgs( expectedError );

        const fakeRequest = {
          server: {
            app: {
              cache: {
                drop: function( id, cb ) {
                  cb( expectedError );
                },
              },
            },
          },
          auth: {
            credentials: {
              id: '',
            },
          },
        };

        const loginController = require( '../../src/controllers/login.js' );
        loginController.logout.handler( fakeRequest, mockReply );
        done();
      } );

      it( 'should clear the session and render the template', function( done ) {
        const fakeReply = {
          view: function() {},
        };
        const fakeSession = {
          clear: function() {},
        };

        const mockReply = Sinon.mock( fakeReply );
        const mockSession = Sinon.mock( fakeSession );

        const expectedData = {
          authentication: {
            authenticated: false,
          },
        };

        mockReply.expects( 'view' ).once().withArgs( 'login/logout', expectedData );
        mockSession.expects( 'clear' ).once();

        const fakeRequest = {
          server: {
            app: {
              cache: {
                drop: function( id, cb ) {
                  cb( undefined );
                  mockSession.verify();
                  mockReply.verify();
                  done();
                },
              },
            },
          },
          auth: {
            credentials: {
              id: '',
            },
            session: fakeSession,
          },
        };

        const loginController = require( '../../src/controllers/login.js' );
        loginController.logout.handler( fakeRequest, fakeReply );
      } );
    } );
  } );
} )( module, exports, require );
