module.exports = function(models) {
    'use strict';

    return {
        /**
         * Attempts to validate a session using user_id and session uuid
         * @param req
         * @param res
         * @param next
         */
        validate: function(req, res, next) {
            models.Session.findOne({
                where: {
                    UserId: req.params.user_id,
                    uuid: req.params.uuid
                }
            }).then(
                function(session) {
                    if(session) {
                        res.json({valid: true});
                    } else {
                        return next(new Error('Invalid session'));
                    }
                },
                function(err) {
                    return next(new Error('Invalid session'));
                });
        },
        /**
         * Create a session based on valid user credentials
         * @param req
         * @param res
         * @param next
         */
        create: function(req, res, next) {
            models.User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(
                function(user) {
                    if (user.authenticate(req.body.password)) {
                        models.Session
                            .create({
                                UserId: user.id
                            })
                            .then(
                                function(session) {
                                    res.json({uuid: session.uuid});
                                },
                                function(err) {
                                    return next(new Error('Error creating session: ' + err.message));
                                });
                    } else {
                        return next(new Error('Email and Password do not match'));
                    }
                },
                function(err) {
                    return next(new Error('Could not find user'));
                });
        },
        /**
         * Destroy a session based on a uuid
         * @param req
         * @param res
         * @param next
         */
         delete: function(req, res, next) {
           // TODO - Implement
         }
    }
};
