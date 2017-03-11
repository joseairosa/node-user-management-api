module.exports = function(sequelize, DataTypes) {
    'use strict';

    var Session = sequelize.define('Session', {
        UserId: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Session.belongsTo(models.User);
            }
        }
    });
    return Session;
};
