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
         * include routes for blog
         */
        users: require('./users')(models)
    };
};
