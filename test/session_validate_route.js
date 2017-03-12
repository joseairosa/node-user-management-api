module.exports = function(sinon) {
    describe('Session Validate Route', function() {
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

        function callSessionValidateRoute() {
            session.validate(request, response, next);
        }

        beforeEach(function() {
            request = {
                params: {
                    user_id: 1,
                    uuid: '054135c4-26d6-4de4-8e68-8c7c4ea575f9'
                }
            }

            authenticateMock = sinon.stub();
            userMock = {
              id: 1
            };
            userMock.authenticate = sinon.stub().returns(authenticateMock);

            sessionModelPromiseMock = {};
            sessionModelPromiseMock.then = sinon.spy();
            sessionModelMock = {};
            sessionModelMock.findOne = sinon.stub().returns(sessionModelPromiseMock);

            sessionMock = {};

            response = {};
            response.json = sinon.stub();
            response.status = sinon.stub();

            next = sinon.stub();

            session = requireSessionRoute({
                Session: sessionModelMock,
                User: userModelMock
            });

            callSessionValidateRoute();
        });

        it('Calls Session.findOne with correct parameters', function() {
            var expectedOptions = {
                where: {
                    UserId: 1,
                    uuid: '054135c4-26d6-4de4-8e68-8c7c4ea575f9'
                }
            }

            // Expectancy
            sessionModelMock.findOne.should.have.been.calledOnce;
            sessionModelMock.findOne.should.have.been.calledWith(expectedOptions);
        });

        it('Calls the render json function with correct message', function() {
            sessionModelPromiseMock.then.getCall(0).args[0](sessionMock);

            // Expectancy
            response.json.should.have.been.calledOnce;
            response.json.should.have.been.calledWith({valid: true});
        });

        it('Calls next with a error message', function() {
            // Call the promise reject function
            var errorMessage = 'Invalid session';
            sessionModelPromiseMock.then.getCall(0).args[1]({
                message: errorMessage
            });

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error(errorMessage));
        });
    });
}
