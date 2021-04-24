

# wplan Backend

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
