module.exports = function(sinon) {
    describe('User Index Route', function() {
        // Object to mock the users model
        var usersMock;
        // Mock for the promise returned by users for index
        var promiseMock;
        // Object to mock the response
        var response;
        // Users route
        var user

        function requireUser(models) {
            return require('../routes/users.js')(models);
        }

        function callUserIndexRoute() {
            user.index({}, response);
        }

        beforeEach(function() {
            response = {};
            promiseMock = {};
            usersMock = {};
            usersMock.usersForIndex = sinon.stub().returns(promiseMock);
            promiseMock.then = sinon.spy();
            response.json = sinon.stub();
            response.send = sinon.stub();
            user = requireUser({
                User: usersMock
            });
        });

        it('calls Users.usersForIndex', function() {
            callUserIndexRoute();
            usersMock.usersForIndex.should.have.been.calledOnce;
        });

        it('passes resolve and reject functions to articlesForIndex', function() {
            callUserIndexRoute();
            var args = promiseMock.then.getCall(0).args;
            // Should be called with two arguments
            args.length.should.equal(2);
            // Both arguments should be functions
            args[0].should.be.a.function;
            args[1].should.be.a.function;
        });

        it('Calls the render function', function() {
            callUserIndexRoute();
            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0]({});
            response.json.should.have.been.calledOnce;
        });

        it('Passes the articles to the render function', function() {
            var users = {};
            callUserIndexRoute();
            // Call the promise resolve function
            promiseMock.then.getCall(0).args[0](users);
            var args = response.json.getCall(0).args
            args.length.should.equal(1);
            args[0].should.equal(users);
        });

        it('Sends a 500 status on error', function() {
            callUserIndexRoute();
            // Call the promise reject function
            promiseMock.then.getCall(0).args[1]({
                message: "There was an error"
            });
            response.send.should.have.been.calledOnce;
            response.send.should.have.been.calledWith(500);
        });
    });
}
