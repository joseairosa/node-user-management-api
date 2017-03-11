'use strict';
module.exports = function(sequelize, DataTypes) {
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
