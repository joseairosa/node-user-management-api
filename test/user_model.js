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
                        email: 'squall@finalfantasy.viii'
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
                    email: 'squall@finalfantasy.viii',
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
    });
};
