module.exports = function(models) {
    'use strict';

    return {
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
         }
    }
};
