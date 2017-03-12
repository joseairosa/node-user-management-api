module.exports = function(sinon) {
    describe('User Create Route', function() {
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

        function callUserCreateRoute() {
            user.create(request, response, next);
        }

        beforeEach(function() {
            request = {
                body: {
                    first_name: 'Squall',
                    last_name: 'Lionheart',
                    email: 'squall@finalfantasy.viii',
                    password: '12345678'
                }
            }

            promiseMock = {};
            promiseMock.then = sinon.spy();

            usersMock = {};
            usersMock.create = sinon.stub().returns(promiseMock);

            response = {};
            response.json = sinon.stub();
            response.status = sinon.stub();

            next = sinon.stub();

            user = requireUser({
                User: usersMock
            });

            callUserCreateRoute();
        });

        it('Calls Users.create with correct parameters', function() {
            // Expectancy
            usersMock.create.should.have.been.calledOnce;
            usersMock.create.should.have.been.calledWith({
                first_name: 'Squall',
                last_name: 'Lionheart',
                email: 'squall@finalfantasy.viii',
                password: '12345678'
            });
        });

        it('Passes resolve and reject functions to User.create', function() {
            var args = promiseMock.then.getCall(0).args;
            // Should be called with two arguments
            args.length.should.equal(2);
            // Expectancy - Both arguments should be functions
            args[0].should.be.a.function;
            args[1].should.be.a.function;
        });

        it('Calls the render json function', function() {
            var user = {};
            var expectedParameters = 'safe';
            var mockUser = {
                dataValues: user,
                safeParameters: function() {
                    return expectedParameters;
                }
            };

            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0](mockUser);
            // Expectancy
            response.json.should.have.been.calledOnce;
        });

        it('Passes the created user safe parameters to the render json function', function() {
            var user = {};
            var expectedParameters = 'safe';
            var mockUser = {
                dataValues: user,
                safeParameters: function() {
                    return expectedParameters;
                }
            };

            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0](mockUser);
            var args = response.json.getCall(0).args

            // Expectancy
            args.length.should.equal(1);
            args[0].should.deep.equal(expectedParameters);
        });

        it('Calls next with a error message', function() {
            // Call the promise reject function
            var errorMessage = 'Error creating user: There was an error';
            promiseMock.then.getCall(0).args[1]({
                message: errorMessage
            });

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error(errorMessage));
        });
    });
}
