module.exports = function(sequelize, models) {
    'use strict';

    const Q = require('q');
    const should = require('chai').should();

    var User;

    describe('User Model', function() {
        describe('Validations', function() {
            it('Should create a model with valid properties', function(done) {
                models.User.create({
                        first_name: 'Squall',
                        last_name: 'Lionheart',
                        email: 'squall@finalfantasy.viii',
                        password: '12345678'
                    })
                    .should.not.be.rejected.notify(done);
            });

            it('Should not be valid without a first_name', function(done) {
                models.User.create({
                        last_name: 'Lionheart',
                        email: 'squall@finalfantasy.viii'
                    })
                    .should.be.rejected.notify(done);
            });

            it('Should not be valid without a last_name', function(done) {
                models.User.create({
                        first_name: 'Squall',
                        email: 'squall@finalfantasy.viii'
                    })
                    .should.be.rejected.notify(done);
            });

            it('Should not be valid without a password', function(done) {
                models.User.create({
                        first_name: 'Squall',
                        email: 'squall@finalfantasy.viii'
                    })
                    .should.be.rejected.notify(done);
            });

            it('Should not be valid with a weak password', function(done) {
                models.User.create({
                        first_name: 'Squall',
                        last_name: 'Lionheart',
                        email: 'squall@finalfantasy.viii',
                        password: '1234'
                    })
                    .should.be.rejected.notify(done);
            });


            it('Should not be valid without an email', function(done) {
                models.User.create({
                        first_name: 'Squall',
                        last_name: 'Lionheart'
                    })
                    .should.be.rejected.notify(done);
            });
        });

        describe('User.usersForIndex', function() {
            function addUserFixture(offsetSeconds) {
                return models.User.create({
                    first_name: 'Squall',
                    last_name: 'Lionheart',
                    email: 'squall2@finalfantasy.viii',
                    password: '1234567',
                    createdAt: new Date(new Date().getTime() - (offsetSeconds * 1000))
                });
            }

            beforeEach(function(done) {
                // Add some users to the database
                Q.all([
                    addUserFixture(40),
                    addUserFixture(30),
                    addUserFixture(20),
                    addUserFixture(10)
                ]).then(function() {
                    done();
                });
            });

            it('Should define a function "usersForIndex"', function() {
                should.exist(models.User.usersForIndex);
            });

            it('Returns all the users from the database', function(done) {
                models.User.usersForIndex()
                    .should.eventually.have.length(4).notify(done);
            });

            it('Should return all the user models in created order', function(done) {
                models.User.usersForIndex()
                    .then(function(users) {
                        var t = new Date().getTime();
                        return Q(users.every(function(a) {
                            if (t >= a.createdAt.getTime()) {
                                t = a.createdAt.getTime();
                                return true;
                            }
                            return false;
                        }));
                    }).should.eventually.be.true.notify(done);
            });
        });

        describe('User#safeParameters', function() {
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
                Q.all([
                    addUserFixture()
                ]).then(function() {
                    userPromise = models.User.findOne({
                        where: { email: "squall@finalfantasy.viii" }
                    });
                    done();
                });
            });

            it('Should define a function "safeParameters"', function(done) {
                userPromise.then(function(user) {
                    return user.safeParameters();
                }).should.exist.notify(done);
            });

            it('Should only return parameters deemed safe', function(done) {
                var expectedParameters = {
                    id: 1,
                    first_name: 'Squall',
                    last_name: 'Lionheart',
                    email: 'squall@finalfantasy.viii'
                };
                userPromise.then(function(user) {
                    return user.safeParameters();
                }).should.eventually.deep.equal(expectedParameters).notify(done);
            });
        });
    });
};
