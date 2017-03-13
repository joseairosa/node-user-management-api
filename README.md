# User Management node API [![Build Status](https://travis-ci.org/joseairosa/node-user-management-api.svg?branch=master)](https://travis-ci.org/joseairosa/node-user-management-api) [![Coverage Status](https://coveralls.io/repos/github/joseairosa/node-user-management-api/badge.svg?branch=master)](https://coveralls.io/github/joseairosa/node-user-management-api?branch=master)

API used for managing user access, account creating and deletion

## Installation

Start up by installing are required libraries

```
npm install
```

## Database

This project assumes that you'll have a postgres database that you can connect
to.

You'll need to setup the following enviroment variables:

```
export FLOCK_USER_MANAGEMENT_DEVELOPMENT_DATABASE="change-me"
export FLOCK_USER_MANAGEMENT_DEVELOPMENT_USERNAME="change-me"
export FLOCK_USER_MANAGEMENT_DEVELOPMENT_PASSWORD="change-me"
export FLOCK_USER_MANAGEMENT_DEVELOPMENT_HOST="change-me"
```

Once they are set and available in the current user enviroment, that will be
running the node app, make sure you first run `sequelize db:migrate`. This will
run all migrations necessary to get your database up to date to the current
schema.

## Running the API

Fairly easy to get the app started, just run:

```
npm start
```

You can also run it in debug mode for extra runtime info:

```
DEBUG=api npm start
```

## Interacting with the API

Please check the [documentation](DOCUMENTATION.md)

## Tests

Run the tests with:

```
npm test
```

Tests will run in a `test` environment and they do require a database for some
of the tests.
Where we can we abstract and mock database connection, but we do require it for
end to end tests.

Setup details for the test database with the following environment variables:

```
export FLOCK_USER_MANAGEMENT_TEST_DATABASE="change-me"
export FLOCK_USER_MANAGEMENT_TEST_USERNAME="change-me"
export FLOCK_USER_MANAGEMENT_TEST_PASSWORD="change-me"
export FLOCK_USER_MANAGEMENT_TEST_HOST="change-me"
```

Note: Do not use this database for anything apart from tests. It will be
completely deleted every time you run the tests.

## Deploying

This service is currently deployed to heroku under `https://node-user-management-dev.herokuapp.com`.

Deployement is currently handled continuously:

- Commit to master
- Runs tests in travis-ci
- If tests pass heroku will deploy the API

## Roadmap

- [ ] Apply safe parameters to when listing all users
- [ ] Improve test coverage
- [x] Delete sessions (logging out)
- [ ] Enforce session expiration, currently there's nothing expiring those sessions
- [ ] Add more fields to the user model
- [ ] Better logging strategy
- [ ] Cleanup tests a bit more by removing unused variables, ex: test/session_delete_route.js
