'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
// Initialize Chai/Chai as promised
chai.use(chaiAsPromised);
chai.should();

var Sequelize = require('sequelize');
var sequelize;
var models;

// Cache the sequelize logging output till after all the tests have run
var logOutput = '\n';
function log(msg) {
    logOutput += msg + '\n';
}

var config = require('../config/postgres.js')['test'];
sequelize = new Sequelize(config.database, config.username, config.password, config);

// Load model definitions
models = require('../models')(sequelize);

// Run model tests
describe('Model tests', function() {
    // Recreate the database after each test to ensure isolation
    beforeEach(function(done) {
        sequelize.sync({
                force: true
            }).then(function(){
              done();
            });
    });

    //After all the tests have run, output all the sequelize logging.
    after(function() {
        console.log(logOutput);
    });

    require('./user_model')(sequelize, models);
});
