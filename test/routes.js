var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

// User Index Route Tests
describe('Route tests', function () {
    require('./user_index_route')(sinon);
});