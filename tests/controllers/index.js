(function( module, exports, require ) {
  'use strict';

  const Lab = require( 'lab' );
  const Code = require( 'code' );
  const Sinon = require( 'sinon' );
  const lab = exports.lab = Lab.script();

  const describe = lab.describe;
  const it = lab.it;
  const expect = Code.expect;

  describe( 'index controller', function() {
    describe( '#index()', function() {
      it( 'should test if a user is authenticated', function( done ) {
        const spy = Sinon.spy();
        const requestMock = {
          server: {
            auth: {
              test: spy,
            },
          },
        };

        const controller = require( '../../src/controllers/index.js' );

        controller.index.handler( requestMock, function() {} );

        expect( spy.withArgs( 'session' ).calledOnce ).to.be.true;
        done();
      } );

      it( 'should render a view when not authenticated', function( done ) {
        const expectedPath = 'test';
        const expectedData = {
          path: expectedPath,
          authentication: {
            authenticated: false,
          },
        };

        const replyFunction = Sinon.spy();
        const replyMock = {
          view: replyFunction,
        };
        const requestMock = {
          path: expectedPath,
          server: {
            auth: {
              test: function( scope, req, cb ) {
                cb( true, undefined );
              },
            },
          },
        };

        const controller = require( '../../src/controllers/index.js' );

        controller.index.handler( requestMock, replyMock );

        expect( replyFunction.withArgs( 'index/index', expectedData ).calledOnce ).to.be.true;
        done();
      } );

      it( 'should render a view when authenticated', function( done ) {
        const expectedPath = 'test';
        const expectedUsername = 'testUser';
        const expectedData = {
          path: expectedPath,
          authentication: {
            authenticated: true,
            username: expectedUsername,
          },
        };

        const replyFunction = Sinon.spy();
        const replyMock = {
          view: replyFunction,
        };
        const requestMock = {
          path: expectedPath,
          server: {
            auth: {
              test: function( scope, req, cb ) {
                cb( false, {
                  username: expectedUsername,
                } );
              },
            },
          },
        };

        const controller = require( '../../src/controllers/index.js' );

        controller.index.handler( requestMock, replyMock );

        expect( replyFunction.withArgs( 'index/index', expectedData ).calledOnce ).to.be.true;
        done();
      } );
    } );
  } );
})( module, exports, require );
