module.exports = function(sinon) {
    describe('Session Delete Route', function() {
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

        function callSessionDeleteRoute() {
            session.delete(request, response, next);
        }

        beforeEach(function() {
            request = {
                params: {
                    uuid: 'uuid'
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
            sessionModelMock.destroy = sinon.stub().returns(sessionModelPromiseMock);

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

            callSessionDeleteRoute();
        });

        it('Calls Session.destroy', function() {
            // Expectancy
            sessionModelMock.destroy.should.have.been.calledOnce;
            sessionModelMock.destroy.should.have.been.calledWith({
                where: {
                    uuid: 'uuid'
                }
            });
        });

        it('Passes resolve and reject functions to Session.destroy', function() {
            var args = sessionModelPromiseMock.then.getCall(0).args;

            // Should be called with two arguments
            args.length.should.equal(2);

            // Expectancy - Both arguments should be functions
            args[0].should.be.a.function;
            args[1].should.be.a.function;
        });

        it('Calls the render json function if session deleted successfully', function() {
            var affectedRows = 1;

            // Call the promise resolve function
            sessionModelPromiseMock.then.getCall(0).args[0](affectedRows);

            // Expectancy
            response.json.should.have.been.calledOnce;
        });

        it('Returns correct message if session deleted successfully', function() {
            var affectedRows = 1;

            // Call the promise resolve function
            sessionModelPromiseMock.then.getCall(0).args[0](affectedRows);
            var args = response.json.getCall(0).args

            // Expectancy
            args.length.should.equal(1);
            args[0].should.deep.equal({
                deleted: true
            });
        });

        it('Calls next with a specific error message if session not deleted', function() {
            var affectedRows = 0;

            // Call the promise reject function
            var errorMessage = 'Cannot find session uuid';
            sessionModelPromiseMock.then.getCall(0).args[0](affectedRows);

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error(errorMessage));
        });

        it('Calls next with a error message', function() {
            // Call the promise reject function
            var errorMessage = 'Error deleting session: There was an error';
            sessionModelPromiseMock.then.getCall(0).args[1]({
                message: errorMessage
            });

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error(errorMessage));
        });
    });
}
