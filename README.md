

# wplan Backend

## Read about the current state of [features](https://github.com/buenaflor/wplan-backend/wiki/Features) 

## Tech Stack

- PostgreSQL 
- NestJS with Typescript
- JSON Web Tokens for authentication

## Database

Currently, the PostgreSQL test development database "wplan_dev" is hosted on Microsoft Azure. 
The db should only be tested when a new release candidate is ready due to costs.

For development, a local postgres database should be used due to costs with azure.

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
DB_TYPE=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=
DB_PASS=
DB_NAME=wplan_dev
  
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
