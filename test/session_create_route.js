module.exports = function(sinon) {
    describe('Session Create Route', function() {
        // Mock for the promise returned by Session model findOne
        var sessionModelPromiseMock;
        // Mock for the promise returned by User model findOne
        var userModelPromiseMock;
        // Object to mock the users model
        var userModelMock;
        // Object to mock the session model
        var sessionModelMock;
        // Object to mock the session resturned object from model
        var sessionMock;
        // Object to mock the user resturned object from model
        var userMock;
        // Object to mock the authentication response from user
        var authenticateMock;
        // Object to mock the request
        var request;
        // Object to mock the response
        var response;
        // Object to mock next handler
        var next;
        // Users route
        var session

        function requireSessionRoute(models) {
            return require('../routes/sessions.js')(models);
        }

        function callSessionCreateRoute() {
            session.create(request, response, next);
        }

        beforeEach(function() {
            request = {
                body: {
                    email: 'squall@finalfantasy.viii',
                    password: '12345678'
                }
            };

            userModelPromiseMock = {};
            userModelPromiseMock.then = sinon.spy();
            userModelMock = {};
            userModelMock.findOne = sinon.stub().returns(userModelPromiseMock);

            authenticateMock = sinon.stub();
            userMock = {
                id: 1
            };
            userMock.authenticate = sinon.stub().returns(authenticateMock);

            sessionModelPromiseMock = {};
            sessionModelPromiseMock.then = sinon.spy();
            sessionModelMock = {};
            sessionModelMock.create = sinon.stub().returns(sessionModelPromiseMock);

            sessionMock = {
                uuid: 'uuid'
            };

            response = {};
            response.json = sinon.stub();
            response.status = sinon.stub();

            next = sinon.stub();

            session = requireSessionRoute({
                Session: sessionModelMock,
                User: userModelMock
            });
        });

        it('Calls User.findOne with correct parameters', function() {
            callSessionCreateRoute();

            var expectedOptions = {
                where: {
                    email: 'squall@finalfantasy.viii'
                }
            }

            // Expectancy
            userModelMock.findOne.should.have.been.calledOnce;
            userModelMock.findOne.should.have.been.calledWith(expectedOptions);
        });

        it('Calls User#authenticate with correct parameters', function() {
            callSessionCreateRoute();

            userModelPromiseMock.then.getCall(0).args[0](userMock);

            // Expectancy
            userMock.authenticate.should.have.been.calledOnce;
            userMock.authenticate.should.have.been.calledWith('12345678');
        });

        it('Calls next with a error message when user not found', function() {
            callSessionCreateRoute();

            // Call the promise reject function
            var errorMessage = 'Email and Password do not match';
            userModelPromiseMock.then.getCall(0).args[0](null);

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error(errorMessage));
        });

        it('Calls next with a error message', function() {
            callSessionCreateRoute();

            // Call the promise reject function
            var errorMessage = 'Error creating session';
            userModelPromiseMock.then.getCall(0).args[1]({
                message: errorMessage
            });

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error(errorMessage));
        });

        describe('User credentials are valid', function() {
            beforeEach(function() {
                userMock.authenticate = function() {
                    return true;
                };

                callSessionCreateRoute();

                userModelPromiseMock.then.getCall(0).args[0](userMock);
            });

            it('Creates a new session associated with the user', function() {
                var expectedCreateOptions = {
                    UserId: 1
                }

                // Expectancy
                sessionModelMock.create.should.have.been.calledOnce;
                sessionModelMock.create.should.have.been.calledWith(expectedCreateOptions);
            });

            it('Passes resolve and reject functions to Session.create', function() {
                sessionModelPromiseMock.then.getCall(0).args[0](sessionMock);

                var args = sessionModelPromiseMock.then.getCall(0).args;
                // Should be called with two arguments
                args.length.should.equal(2);
                // Expectancy - Both arguments should be functions
                args[0].should.be.a.function;
                args[1].should.be.a.function;
            });

            it('Calls the render json function with correct message', function() {
                sessionModelPromiseMock.then.getCall(0).args[0](sessionMock);

                // Expectancy
                response.json.should.have.been.calledOnce;
                response.json.should.have.been.calledWith({
                    uuid: 'uuid'
                });
            });

            it('Calls next with a error message', function() {
                // Call the promise reject function
                var errorMessage = 'Error creating session: There was an error';
                sessionModelPromiseMock.then.getCall(0).args[1]({
                    message: errorMessage
                });

                // Expectancy
                next.should.have.been.calledOnce;
                next.should.have.been.calledWith(new Error(errorMessage));
            });
        });

        describe('User credentials are invalid', function() {
            beforeEach(function() {
                userMock.authenticate = function() {
                    return false;
                };

                callSessionCreateRoute();

                userModelPromiseMock.then.getCall(0).args[0](userMock);
            });

            it('Calls next with a error message', function() {
                // Call the promise reject function
                var errorMessage = 'Email and Password do not match';

                // Expectancy
                next.should.have.been.calledOnce;
                next.should.have.been.calledWith(new Error(errorMessage));
            });
        });
    });
}
