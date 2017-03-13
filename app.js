const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pg = require('pg');

module.exports = function(sequelize) {
  const models = require('./models')(sequelize);
  const routes = require('./routes')(models);

  const app = express();

  if(app.get('env') !== 'test') app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // Routes
  const users = routes.users;
  const sessions = routes.sessions;
  app.get('/', routes.index);
  app.get('/users', users.index);
  app.get('/users/:id', users.findOne);
  app.put('/users/:id', users.update);
  app.post('/users', users.create);
  app.delete('/users/:id', users.delete);
  app.post('/session', sessions.create);
  app.get('/session/:user_id/:uuid', sessions.validate);
  app.delete('/session/:uuid', sessions.delete);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    const message = err.message;
    const error = 'development' === req.app.get('env') ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
      "message": message,
      "error": error
    });
  });

  return app;
};
