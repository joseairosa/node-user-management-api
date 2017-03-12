module.exports = function(sequelize, models) {
    'use strict';

    var User;

    describe('User Model', function() {
        it('should create a model with valid properties', function(done) {
            models.User.create({
                    first_name: 'Squall',
                    last_name: 'Lionheart',
                    email: 'squall@finalfantasy.viii'
                })
                .should.not.be.rejected.notify(done);
        });

        it('should not be valid without a first_name', function(done) {
            models.User.create({
                    last_name: 'Lionheart',
                    email: 'squall@finalfantasy.viii'
                })
                .should.be.rejected.notify(done);
        });

        it('should not be valid without a last_name', function(done) {
            models.User.create({
                    first_name: 'Squall',
                    email: 'squall@finalfantasy.viii'
                })
                .should.be.rejected.notify(done);
        });


        it('should not be valid without an email', function(done) {
            models.User.create({
                    first_name: 'Squall',
                    last_name: 'Lionheart'
                })
                .should.be.rejected.notify(done);
        });
    });
};
