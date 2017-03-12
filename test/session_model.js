module.exports = function(sequelize, models) {
    'use strict';

    const Q = require('q');
    const should = require('chai').should();

    describe('Session Model', function() {
        var userPromise;

        function addUserFixture() {
            return models.User.create({
                first_name: 'Squall',
                last_name: 'Lionheart',
                email: 'squall@finalfantasy.viii',
                password: '1234567'
            });
        }

        beforeEach(function(done) {
            // Add some users to the database
            Q.all([
                addUserFixture()
            ]).then(function() {
                userPromise = models.User.findOne({
                    where: {
                        email: "squall@finalfantasy.viii"
                    }
                });
                done();
            });
        });

        it('Should create a session with valid properties', function(done) {
            userPromise.then(function(user) {
                return models.Session.create({
                    UserId: user.id
                })
            }).should.eventually.not.be.rejected.notify(done);
        });

        it('Should create a session with uuid', function(done) {
            userPromise.then(function(user) {
                return models.Session.create({
                    UserId: user.id
                }).then(function(session) {
                    return session.uuid;
                });
            }).should.eventually.not.be.empty.notify(done);
        });

        it('Should belong to the correct user ID', function(done) {
            userPromise.then(function(user) {
                return models.Session.create({
                    UserId: user.id
                }).then(function(session) {
                    return session.UserId;
                });
            }).should.eventually.equal(1).notify(done);
        });
    });
};
