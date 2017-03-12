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
                    email: req.body.email,
                    password: req.body.password
                })
                .then(
                    function(user) {
                        res.json(user.safeParameters());
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
                        if (null === user) {
                            return next(new Error('Cannot find user ID ' + req.params.id));
                        } else {
                            res.json(user.safeParameters());
                        }
                    },
                    function(err) {
                        return next(new Error('Error occured retrieving user ID ' + req.params.id));
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
                    email: req.body.email,
                    password: req.body.password
                }, {
                    where: {
                        id: req.params.id
                    },
                    returning: true,
                    plain: true
                })
                .then(
                    function(resultArray) {
                        var updateUser = resultArray[1];
                        res.json(updateUser.safeParameters());
                    },
                    function(err) {
                        return next(new Error('Error updating user. Make sure user ID ' + req.params.id + ' exists.'));
                    });
        },
        /**
         * Update a user based on the provided user id
         * @param req
         * @param res
         * @param next
         */
        delete: function(req, res, next) {
            models.User
                .destroy({
                    where: {
                        id: req.params.id
                    }
                })
                .then(
                    function(affectedRows) {
                        if (affectedRows > 0) {
                            res.json({
                                deleted: true
                            });
                        } else {
                            return next(new Error('Cannot find user ID ' + req.params.id));
                        }
                    },
                    function(err) {
                        return next(new Error('Error deleting user: ' + err.message));
                    });
        }
    }
};
