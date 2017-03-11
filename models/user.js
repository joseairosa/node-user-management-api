module.exports = function(sequelize, DataTypes) {
    'use strict';

    var User = sequelize.define('User', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Session);
            }
        }
    });
    return User;
};
