

# wplan Backend

## TODO

- DTO architecture -> should service layer only return dtos i.e are DTOs allowed inside the service layer? https://stackoverflow.com/questions/16866102/using-dto-to-transfer-data-between-service-layer-and-ui-layer/16872129#16872129
- Limit request rates -> how much per hour?
- Deny access if authentication failed too often in a short amount of time
- Error handling -> error pipeline? which errors should be returned
- Reduce boilerplate of pagination -> maybe with decorators? @Fixed: implemented as @Paginated() decorator
- Default query parameters for GET endpoints that return lists? sort & order
- Change email to not verified when updating an email address
- Success response in controllers

## Currenty implemented features (needs further testing)
### Authentication
- Passwords are one-way-hashed via argon2 and stored in the db
    - Passwords should be transported via a secure HTTPs channel as plain text
    - The plain text password is then verified with the hased password in the db
- Registering a user will create a new email verification token and sent via email
- Email confirmation via sent email and token
- Resend Email also possible -> rate limiting is not implemented yet and could be an exploit for DOS attacks
- Login user -> returns JSON web token for authentication
- Some endpoints will require an authenticated user
    - Header should consist of "Authorization: Bearer {auth_token}"
- not yet implemented: revoke auth token, refreshen auth token
### User
- Get authenticated user -> receive private information as well
- Update authenticated user
- Get all workout plans that the authenticated user has access to (including private workout plans)
    - User has access if they are: collaborator, owner of the workout plan
- Get all pending workout plan invitations
- Accept workout plan invitation
- Decline workout plan invitation
- Get all users (doesn't require authentication) -> only receive public information
- Get one specific user -> only public information
    - An authenticated requestor will receive private information for their user data
- Get all public workout plans that a user owns

### Workout Plans
- Get all public workout plans
- Get a specific workout plan associated with the owner. e.g. /workout_plans/gino/my_plan
    - If the workout plan is private, it will return an unauthorized error unless the requestor is authenticated and has access to it (collaborator or is owner)
- Update workout plan
    - Owner or a collaborator with at least write access can update
- Delete workout plan
    - Only the owner can delete a workout plan
- Get collaborators of a workout plan
    - Data will only be sent for the owner or a collaborator with at least read access
- Invite collaborators to a specific workout plan
    - The owner or a collaborator with admin access can invite other collaborators

### Workout Day
- Assigned to exactly one Workout Plan
- Has many exercise routines

### Exercise Routine
- Exercise routines consist of the exercise and the array of workout sets

### Exercise Weightlifting Set
- To differentiate from other types of sets, this weightlifting sets has: repetitions, weight, and a weight unit (kg, lbs)
- In the future there could be duration sets for planks for example. You cannot track planks with a weightlifting set.

### Exercise
- Exercises have a name, license, author since users will be able to add new exercises.
- Adding new exercises will have to go through a review procedure before being committed to the public exercise database (not yet implemented)

### License 
- licenes can be: 
    - "Open Data Commons Open Database License"
    - "Creative Commons Attribution 4"
    - "Creative Commons Attribution Share Alike 3"
    - "Creative Commons Attribution Share Alike 4"
    - "Creative Commons Public Domain 1.0"
    
### Roles & Permissions
#### Permission levels:
- none
- read
- write
- admin

Every upper level automatically has access to the lower levels

#### Roles:

- coach
- trainee
- viewer

Depending on how the permission levels can be setup, a role can be accompanied by any permission.

For example: coach & read. 

Roles are only accessory data that should only help the user identify a specific collaborator. 
Although it doesn't make semantically sense to assign a coach with none permission even though syntactically it would be ok.



## Tech Stack

- PostgreSQL 
- Redis caching
- NestJS with Typescript
- JSON Web Tokens for authentication and authorization
- Docker for containerization

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
