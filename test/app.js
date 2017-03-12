const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const expect = chai.expect();
const sinon = require('sinon');
const request = require('supertest');
const http = require('http');
const app = require('../app');

const port = 3001

app.set('port', port);

describe('loading express', function() {
    var server;
    var users_route;

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
