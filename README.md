# User Management node API

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

Once they are set and available to the user that will be running the node app
make sure you run first `sequelize db:migrate`. This will run all migrations
necessary to get your database up to date to the current schema.

## Running the API

Fairly easy to get the app started, just run

```
npm run start
```

You can also run it in debug mode for extra runtime info

```
DEBUG=api npm run start
```
