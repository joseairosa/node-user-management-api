module.exports = function(models) {
    'use strict';

    return {
        /**
         * Home Page Route
         * @param req
         * @param res
         */
        index: function(req, res, next) {
          res.json({});
        },
        /**
         * include routes for users
         */
        users: require('./users')(models),
        /**
         * include routes for sessions
         */
        sessions: require('./sessions')(models)
    };
};
