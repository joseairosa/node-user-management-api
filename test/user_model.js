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
    });
};
