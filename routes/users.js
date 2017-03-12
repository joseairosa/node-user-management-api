module.exports = function(models) {
    'use strict';

    return {
        /**
         * List all users registered in the system
         * @param req
         * @param res
         */
        index: function(req, res) {
            models.User.usersForIndex()
                .then(function(users) {
                        res.json(users);
                    },
                    function(err) {
                        res.status(500);
                        res.json(err);
                    });
        },
        create: function(req, res) {
            models.User.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email
            }).then(
                function(user) {
                    res.json(user);
                },
                function(err) {
                    res.status(500);
                    res.json(err);
                });
        }
    }
};
//
// router.get('/:id', function(req, res, next) {
//   const user = models.User.find({
//     where: {
//       id: req.params.id
//     }
//   });
//   user.then(function(user) {
//     res.json(user);
//   });
// });
//
//
// module.exports = router;
