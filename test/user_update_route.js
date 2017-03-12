module.exports = function(sinon) {
    describe('User Update Route', function() {
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

        function callUserUpdateRoute() {
            user.update(request, response, next);
        }

        beforeEach(function() {
            request = {
                params: {
                  id: 1
                },
                body: {
                    first_name: 'Squall',
                    last_name: 'Lionheart',
                    email: 'squall@finalfantasy.viii'
                }
            }

            promiseMock = {};
            promiseMock.then = sinon.spy();

            usersMock = {};
            usersMock.update = sinon.stub().returns(promiseMock);

            response = {};
            response.json = sinon.stub();
            response.status = sinon.stub();

            next = sinon.stub();

            user = requireUser({
                User: usersMock
            });

            callUserUpdateRoute();
        });

        it('Calls Users.update', function() {
            // Expectancy
            usersMock.update.should.have.been.calledOnce;
            usersMock.update.should.have.been.calledWith({
                first_name: 'Squall',
                last_name: 'Lionheart',
                email: 'squall@finalfantasy.viii'
            });
        });

        it('Passes resolve and reject functions to User.update', function() {
            var args = promiseMock.then.getCall(0).args;

            // Should be called with two arguments
            args.length.should.equal(2);

            // Expectancy - Both arguments should be functions
            args[0].should.be.a.function;
            args[1].should.be.a.function;
        });

        it('Calls the render json function', function() {
            var users = {}
            var resultArray = {
              dataValues: users
            };

            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0]([1, resultArray]);

            // Expectancy
            response.json.should.have.been.calledOnce;
        });

        it('Passes the updated user to the render json function', function() {
            var users = {}
            var resultArray = {
              dataValues: users
            };

            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0]([1, resultArray]);
            var args = response.json.getCall(0).args

            // Expectancy
            args.length.should.equal(1);
            args[0].should.equal(users);
        });

        it('Filters out fields that we do not want to expose in the response', function() {
            var users = {
              createdAt: '1',
              updatedAt: '2',
            };
            var updatedUser = {};
            var resultArray = {
              dataValues: users
            };

            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0]([1, resultArray]);
            var args = response.json.getCall(0).args

            // Expectancy
            args.length.should.equal(1);
            args[0].should.deep.equal(updatedUser);
        });

        it('Calls next with a error message', function() {
            // Call the promise reject function
            var errorMessage = 'Error updating user: There was an error';
            promiseMock.then.getCall(0).args[1]({
                message: errorMessage
            });

            // Expectancy
            next.should.have.been.calledOnce;
            next.should.have.been.calledWith(new Error(errorMessage));
        });
    });
}
