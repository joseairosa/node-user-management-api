module.exports = function(sequelize, DataTypes) {
    'use strict';

    var User = sequelize.define('User', {
        first_name: {
            type: DataTypes.STRING,
            defaultValue: '',
            validate: {
                notEmpty: {
                    msg: 'First Name is required'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING,
            defaultValue: '',
            validate: {
                notEmpty: {
                    msg: 'Last Name is required'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            defaultValue: '',
            validate: {
                notEmpty: {
                    msg: 'Email is required'
                }
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Session);
            },
            usersForIndex: function() {
                return this.findAll({order: 'createdAt DESC'});
            }
        }
    });
    return User;
};
