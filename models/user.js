const bcrypt = require('bcrypt');

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
            },
            unique: {
                args: true,
                msg: 'Email address already in use!'
            }
        },
        password_digest: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: 'Password digest is required'
                }
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Password is required'
                },
                len: {
                  args: [6, Infinity],
                  msg: 'Weak password detected, use more than 5 characters'
                }
            }
        }
    }, {
        timestamps: true,
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Session);
            },
            usersForIndex: function() {
                return this.findAll({
                    order: '"createdAt" DESC'
                });
            }
        },
        instanceMethods: {
            authenticate: function(value) {
                if (bcrypt.compareSync(value, this.password_digest))
                    return this;
                else
                    return false;
            },
            safeParameters: function() {
                var safeParameters = this.dataValues;
                delete safeParameters.password;
                delete safeParameters.password_digest;
                delete safeParameters.createdAt;
                delete safeParameters.updatedAt;
                return safeParameters;
            }
        }
    });

    var hasSecurePassword = function(user, options, callback) {
        bcrypt.hash(user.get('password'), 10, function(err, hash) {
            if (err) return callback(err);
            user.set('password_digest', hash);
            return callback(null, options);
        });
    };

    User.beforeCreate(function(user, options, callback) {
        user.email = user.email.toLowerCase();
        if (user.password)
            hasSecurePassword(user, options, callback);
        else
            return callback(null, options);
    })

    User.beforeUpdate(function(user, options, callback) {
        user.email = user.email.toLowerCase();
        if (user.password)
            hasSecurePassword(user, options, callback);
        else
            return callback(null, options);
    })

    return User;
};
