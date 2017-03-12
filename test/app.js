const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const expect = chai.expect();
const sinon = require('sinon');
const request = require('supertest');
const http = require('http');

const Sequelize = require('sequelize');
var sequelize;
const config = require('../config/postgres.js')['test'];
sequelize = new Sequelize(config.database, config.username, config.password, config);

const app = require('../app')(sequelize);

const port = 3001
app.set('port', port);

describe('API', function() {
    var server;
    var users_route;

    before(function(done) {
        sequelize.sync({
            force: true
        }).then(function() {
            done();
        });
    });

    beforeEach(function() {
        server = http.createServer(app);
        server.listen(port);
    });

    afterEach(function() {
        server.close();
    });

    describe('GET /users', function() {
        it('responds with a 200 OK', function testSlash(done) {
            request(server)
                .get('/users')
                .expect(200, done);
        });
    });

    describe('GET /users/:id', function() {
        it('responds with a 200 OK', function testSlash(done) {
          request(server)
              .post('/users')
              .send({
                  first_name: 'Squall',
                  last_name: 'Lionheart',
                  email: 'squall@finalfantasy.viii'
              })
              .end(function(){
                request(server)
                  .get('/users/1')
                  .expect(200)
                  .expect({
                      'id': 1,
                      'first_name': 'Squall',
                      'last_name': 'Lionheart',
                      'email': 'squall@finalfantasy.viii'
                  })
                  .end(function(err, res) {
                      if (err) return done(err);
                      done();
                  });
              })
        });
    });

    describe('PUT /users/:id', function() {
        it('responds with a 200 OK', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: 'Squall',
                    last_name: 'Lionheart',
                    email: 'squall@finalfantasy.viii'
                })
                .end(function() {
                    request(server)
                        .put('/users/1')
                        .send({
                            first_name: 'Rinoa',
                            last_name: 'Heartilly',
                            email: 'rinoa@finalfantasy.viii'
                        })
                        .expect(200)
                        .expect({
                            "id": 1,
                            "first_name": "Rinoa",
                            "last_name": "Heartilly",
                            "email": "rinoa@finalfantasy.viii"
                        })
                        .end(function(err, res) {
                            if (err) return done(err);
                            done();
                        });
                });
        });
    });

    describe('DELETE /users/:id', function() {
        it('responds with a 200 OK when user deleted', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: 'Squall',
                    last_name: 'Lionheart',
                    email: 'squall@finalfantasy.viii'
                })
                .end(function() {
                    request(server)
                        .delete('/users/1')
                        .expect(200)
                        .expect({
                            "deleted": true
                        })
                        .end(function(err, res) {
                            if (err) return done(err);
                            done();
                        });
                });
        });

        it('responds with a 500 ERROR when user cannot be found for deletion', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: 'Squall',
                    last_name: 'Lionheart',
                    email: 'squall@finalfantasy.viii'
                })
            request(server)
                .delete('/users/999')
                .expect(500)
                .expect({
                    "error": {},
                    "message": 'Cannot find user ID 999'
                })
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /users', function() {
        it('responds with a 200 OK', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: 'Squall',
                    last_name: 'Lionheart',
                    email: 'squall@finalfantasy.viii'
                })
                .expect(200, done);
        });
    });
});
