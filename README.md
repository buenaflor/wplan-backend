

# wplan Backend

## TODO

- DTO architecture -> should service layer only return dtos i.e are DTOs allowed inside the service layer? https://stackoverflow.com/questions/16866102/using-dto-to-transfer-data-between-service-layer-and-ui-layer/16872129#16872129
- Limit request rates -> how much per hour?
- Deny access if authentication failed too often in a short amount of time
- Error handling -> error pipeline? which errors should be returned
- Reduce boilerplate of pagination -> maybe with decorators?
- Default query parameters for GET endpoints that return lists? sort & order
- Change email to not verified when updating an email address
- Success response in controllers

## Tech Stack

- PostgreSQL 
- Redis caching
- NestJS with Typescript
- JSON Web Tokens for authentication and authorization
- Docker for containerization

## Database Model

Current state as of 22.04.2021

![alt text](https://i.imgur.com/tV3PQSH.png)

## Environment

### Development

For getting started in the environment, setup a .development.env file in the root directory with the following properties and configure them according to your setup.

The JWT secret token should ideally be around 32 characters long and randomly generated. 

```bash
# .development.env

# Mail  
EMAIL_USER=
EMAIL_PASS=
EMAIL_HOST=
EMAIL_PORT=
  
# Database  
DB_TYPE=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=
  
# JWT  
JWT_SECRET=
JWT_EXPIRATION_DURATION=
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
