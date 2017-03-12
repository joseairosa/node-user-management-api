# Documentation

This API is a CRUD (Create Read Update Delete) application that provides a
simple layer for user management.

Assuming you're running the API on `localhost` on port `3000` (default port)
with some dummy data.

## List all users

#### Request

```
$ curl http://localhost:3000/users
```

#### Response

```
[
    {
        "id": 1,
        "first_name": "Squall",
        "last_name": "Lionheart",
        "email": "squall@joseairosa.com",
        "createdAt": "2017-03-12T16:11:39.534Z",
        "updatedAt": "2017-03-12T16:12:05.665Z"
    }
]
```

## Retrieve one user

#### Request

```
$ curl http://localhost:3000/users/1
```

#### Response

```
{
    "id": 3,
    "first_name": "Jose",
    "last_name": "Airosa",
    "email": "me@joseairosa.com"
}
```

## Create a user

#### Request

```
$ curl -X POST -d "first_name=Jose&last_name=Airosa&email=me%40joseairosa.com&password=12345678" http://localhost:3000/users
```

#### Response

```
{
    "id": 2,
    "first_name": "Jose",
    "last_name": "Airosa",
    "email": "me@joseairosa.com",
    "updatedAt": "2017-03-12T16:44:25.475Z",
    "createdAt": "2017-03-12T16:44:25.475Z"
}
```

## Update a user

#### Request

```
$ curl -X PUT -d "first_name=Squall&last_name=Lionheart&email=squall%40finalfantasy.viii&password=12345678" http://localhost:3000/users/1
```

#### Response

```
{
    "id": 1,
    "first_name": "Jose",
    "last_name": "Airosa",
    "email": "me@joseairosa.com",
    "updatedAt": "2017-03-12T16:44:25.475Z",
    "createdAt": "2017-03-12T16:44:25.475Z"
}
```

## Delete a user

#### Request

```
$ curl -X DELETE http://localhost:3000/users/2
```

#### Response

```
{
    "deleted":true
}
```
