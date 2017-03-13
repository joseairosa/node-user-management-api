const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const expect = chai.expect();
const sinon = require('sinon');
const request = require('supertest');
const http = require('http');
const faker = require('faker');

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
    var firstName;
    var lastName;
    var email;
    var password;

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

        firstName = faker.name.firstName();
        lastName = faker.name.lastName();
        email = faker.internet.email();
        password = faker.internet.password();
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
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function() {
                    request(server)
                        .get('/users/1')
                        .expect(200)
                        .expect({
                            'id': 1,
                            'first_name': firstName,
                            'last_name': lastName,
                            'email': email.toLowerCase()
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
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function() {
                    request(server)
                        .put('/users/1')
                        .send({
                            first_name: 'Rinoa',
                            last_name: 'Heartilly',
                            email: 'rinoa@finalfantasy.viii',
                            password: '12345678'
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
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
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
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function() {
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
    });

    describe('POST /users', function() {
        it('responds with a 200 OK', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .expect(200, done);
        });

        it("responds with a 500 ERROR if there's already a user with the same email", function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function(user_err, user_res) {
                    request(server)
                        .post('/users')
                        .send({
                            first_name: faker.name.firstName(),
                            last_name: faker.name.lastName(),
                            email: user_res.body.email,
                            password: faker.internet.password()
                        })
                        .expect(500, done);
                });
        });
    });

    describe('POST /session', function() {
        it('responds with a 200 OK for a valid session', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function(user_err, user_res) {
                    request(server)
                        .post('/session')
                        .send({
                            email: user_res.body.email,
                            password: password
                        })
                        .expect(200, done);
                });
        });

        it('responds with a 500 ERROR for an invalid session', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function(user_err, user_res) {
                    request(server)
                        .post('/session')
                        .send({
                            email: user_res.body.email,
                            password: '87654321'
                        })
                        .expect(500, done);
                });
        });
    });

    describe('GET /session/:user_id/:uuid', function() {
        it('responds with a 200 OK for a valid session', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function(user_err, user_res) {
                    request(server)
                        .post('/session')
                        .send({
                            email: user_res.body.email,
                            password: password
                        })
                        .end(function(session_err, session_res) {
                            request(server)
                                .get('/session/' + user_res.body.id + '/' + session_res.body.uuid)
                                .expect(200, done);
                        })
                });
        });

        it('responds with a 500 ERROR for an invalid session', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function(user_err, user_res) {
                    request(server)
                        .post('/session')
                        .send({
                            email: user_res.body.email,
                            password: 'this_is_wrong'
                        })
                        .end(function(session_err, session_res) {
                            request(server)
                                .get('/session/' + user_res.body.id + '/hello')
                                .expect(500, done);
                        })
                });
        });
    });

    describe('DELETE /session/:uuid', function() {
        it('responds with a 200 OK when user deleted', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function(user_err, user_res) {
                    request(server)
                        .post('/session')
                        .send({
                            email: user_res.body.email,
                            password: password
                        })
                        .end(function(session_err, session_res) {
                            request(server)
                                .delete('/session/' + session_res.body.uuid)
                                .expect(200, done);
                        })
                });
        });

        it('responds with a 500 ERROR when user cannot be found for deletion', function testSlash(done) {
            request(server)
                .post('/users')
                .send({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
                .end(function(user_err, user_res) {
                    request(server)
                        .post('/session')
                        .send({
                            email: user_res.body.email,
                            password: password
                        })
                        .end(function(session_err, session_res) {
                            request(server)
                                .delete('/session/hello-thar')
                                .expect(500, done);
                        })
                });
        });
    });
});
