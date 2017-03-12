module.exports = function(sinon) {
    describe('User Delete Route', function() {
        // Object to mock the users model
        var usersMock;
        // Mock for the promise returned by users for index
        var promiseMock;
        // Object to mock the request
        var request;
        // Object to mock the response
        var response;
        // Object to mock next handler
        var next;
        // Users route
        var user

        function requireUser(models) {
            return require('../routes/users.js')(models);
        }

        function callUserDeleteRoute() {
            user.delete(request, response, next);
        }

        beforeEach(function() {
            response = {};
            request = {
                params: {
                    id: 1
                }
            }

            promiseMock = {};
            promiseMock.then = sinon.spy();

            usersMock = {};
            usersMock.destroy = sinon.stub().returns(promiseMock);

            response.json = sinon.stub();
            response.status = sinon.stub();

            next = sinon.stub();

            user = requireUser({
                User: usersMock
            });

            callUserDeleteRoute();
        });

        it('Calls Users.destroy', function() {
            // Expectancy
            usersMock.destroy.should.have.been.calledOnce;
            usersMock.destroy.should.have.been.calledWith({
                where: {
                    id: 1
                }
            });
        });

        it('Passes resolve and reject functions to User.destroy', function() {
            var args = promiseMock.then.getCall(0).args;

            // Should be called with two arguments
            args.length.should.equal(2);

            // Expectancy - Both arguments should be functions
            args[0].should.be.a.function;
            args[1].should.be.a.function;
        });

        it('Calls the render json function if user deleted successfully', function() {
            var affectedRows = 1;

            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0](affectedRows);

            // Expectancy
            response.json.should.have.been.calledOnce;
        });

        it('Returns correct message if user deleted successfully', function() {
            var affectedRows = 1;

            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0](affectedRows);
            var args = response.json.getCall(0).args

            // Expectancy
            args.length.should.equal(1);
            args[0].should.deep.equal({
                deleted: true
            });
        });

        it('Calls next with a specific error message if user not deleted', function() {
            var affectedRows = 0;

            // Call the promise reject function
            var errorMessage = 'Cannot find user ID 1';
            promiseMock.then.getCall(0).args[0](affectedRows);

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error(errorMessage));
        });

        it('Calls next with a error message', function() {
            // Call the promise reject function
            var errorMessage = 'Error deleting user: There was an error';
            promiseMock.then.getCall(0).args[1]({
                message: errorMessage
            });

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error(errorMessage));
        });
    });
}
