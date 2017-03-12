const uuidV4 = require('uuid/v4');

module.exports = function(sequelize, DataTypes) {
    'use strict';

    var Session = sequelize.define('Session', {
        UserId: DataTypes.INTEGER,
        uuid: {
            type: DataTypes.STRING,
            defaultValue: uuidV4()
        }
    }, {
        classMethods: {
            associate: function(models) {
                Session.belongsTo(models.User);
            }
        }
    });
    return Session;
};
