module.exports = function(models) {
    'use strict';

    return {
        /**
         * List all users registered in the system
         * @param req
         * @param res
         * @param next
         */
        index: function(req, res, next) {
            models.User
                .usersForIndex()
                .then(function(users) {
                        res.json(users);
                    },
                    function(err) {
                        return next(new Error('Error listing users'));
                    });
        },
        /**
         * Create a user
         * @param req
         * @param res
         * @param next
         */
        create: function(req, res, next) {
            models.User
                .create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email
                })
                .then(
                    function(user) {
                        res.json(user);
                    },
                    function(err) {
                        return next(new Error('Error creating user: ' + err.message));
                    });
        },
        /**
         * Find a user by its ID
         * @param req
         * @param res
         * @param next
         */
        findOne: function(req, res, next) {
            models.User
                .findById(req.params.id)
                .then(
                    function(user) {
                        res.json(user);
                    },
                    function(err) {
                        return next(new Error('Cannot find user ID ' + req.params.id));
                    });
        },
        /**
         * Update a user based on the provided user id
         * @param req
         * @param res
         * @param next
         */
        update: function(req, res, next) {
            models.User
                .update({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email
                }, {
                    where: {
                        id: req.params.id
                    },
                    returning: true,
                    plain: true
                })
                .then(
                    function(resultArray) {
                        var updateUser = resultArray[1].dataValues;
                        delete updateUser.createdAt;
                        delete updateUser.updatedAt;
                        res.json(resultArray[1].dataValues);
                    },
                    function(err) {
                        return next(new Error('Error updating user: ' + err.message));
                    });
        }
    }
};
