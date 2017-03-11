const express = require('express');
const router = express.Router();
const models = require('../models/index');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const users = models.User.findAll({})
  users.then(function(users) {
    res.json(users);
  });
});

router.get('/:id', function(req, res, next) {
  const user = models.User.find({
    where: {
      id: req.params.id
    }
  })
  user.then(function(user) {
    res.json(user);
  });
});

router.post('/', function(req, res, next) {
  const newUser = models.User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  })
  newUser.then(function(user) {
    res.json(user);
  });
});

module.exports = router;
