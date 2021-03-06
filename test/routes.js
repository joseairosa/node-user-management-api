var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

// User Index Route Tests
describe('Route tests', function () {
    require('./user_index_route')(sinon);
    require('./user_create_route')(sinon);
    require('./user_find_one_route')(sinon);
    require('./user_update_route')(sinon);
    require('./user_delete_route')(sinon);
    require('./session_create_route')(sinon);
    require('./session_validate_route')(sinon);
    require('./session_delete_route')(sinon);
});
