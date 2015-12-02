(function( module, exports, require ) {
  'use strict';

  const Lab = require( 'lab' ),
        Code = require( 'code' ),
        Sinon = require( 'sinon' ),
        lab = exports.lab = Lab.script();

  const describe = lab.describe,
        it = lab.it,
        expect = Code.expect;

  describe( 'index controller', function() {
    describe( '#index()', function() {
      it( 'should test if a user is authenticated', function( done ) {

        const spy = Sinon.spy(),
              requestMock = {
                server: {
                  auth: {
                    test: spy
                  }
                }
              };

        const controller = require( '../../src/controllers/index.js' );

        controller.index.handler( requestMock, function() {} );

        expect( spy.withArgs( 'session' ).calledOnce ).to.be.true;
        done();
      } );

      it( 'should render a view when not authenticated', function( done ) {
        const expectedPath = 'test',
              expectedData = {
                path: expectedPath,
                authentication: {
                  authenticated: false
                }
              };

        const replyFunction = Sinon.spy(),
              replyMock = {
                view: replyFunction
              },
              requestMock = {
                path: expectedPath,
                server: {
                  auth: {
                    test: function( scope, req, cb ) {
                      cb( true, undefined );
                    }
                  }
                }
              };

        const controller = require( '../../src/controllers/index.js' );

        controller.index.handler( requestMock, replyMock );

        expect( replyFunction.withArgs( 'index/index', expectedData ).calledOnce ).to.be.true;
        done();
      } );

      it( 'should render a view when authenticated', function( done ) {
        const expectedPath = 'test',
              expectedUsername = 'testUser',
              expectedData = {
                path: expectedPath,
                authentication: {
                  authenticated: true,
                  username: expectedUsername
                }
              };

        const replyFunction = Sinon.spy(),
              replyMock = {
                view: replyFunction
              },
              requestMock = {
                path: expectedPath,
                server: {
                  auth: {
                    test: function( scope, req, cb ) {
                      cb( false, {
                        username: expectedUsername
                      } );
                    }
                  }
                }
              };

        const controller = require( '../../src/controllers/index.js' );

        controller.index.handler( requestMock, replyMock );

        expect( replyFunction.withArgs( 'index/index', expectedData ).calledOnce ).to.be.true;
        done();
      } );
    } );
  } );

})( module, exports, require );
