module.exports = function(sinon) {
    describe('User Find One Route', function() {
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

        function callUserFindOneRoute() {
            user.findOne(request, response, next);
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
            usersMock.findById = sinon.stub().returns(promiseMock);

            response.json = sinon.stub();
            response.status = sinon.stub();

            next = sinon.stub();

            user = requireUser({
                User: usersMock
            });

            callUserFindOneRoute();
        });

        it('calls Users.findById', function() {
            // Expectancy
            usersMock.findById.should.have.been.calledOnce;
        });

        it('passes resolve and reject functions to User.findById', function() {
            var args = promiseMock.then.getCall(0).args;

            // Should be called with two arguments
            args.length.should.equal(2);

            // Expectancy - Both arguments should be functions
            args[0].should.be.a.function;
            args[1].should.be.a.function;
        });

        it('Calls the render json function', function() {
            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0]({});

            // Expectancy
            response.json.should.have.been.calledOnce;
        });

        it('Passes the users to the render json function', function() {
            var users = {};

            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0](users);
            var args = response.json.getCall(0).args

            // Expectancy
            args.length.should.equal(1);
            args[0].should.equal(users);
        });

        it('calls next with a error message', function() {
            // Call the promise reject function
            var errorMessage = "There was an error";
            promiseMock.then.getCall(0).args[1]({
                message: errorMessage
            });

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error('Error creating user: ' + errorMessage));
        });
    });
}
