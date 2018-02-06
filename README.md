# PostIT

[![Build Status](https://travis-ci.org/Philipeano/post-it.svg)](https://travis-ci.org/Philipeano/post-it)
[![Coverage Status](https://coveralls.io/repos/github/Philipeano/post-it/badge.svg)](https://coveralls.io/github/Philipeano/post-it)
[![Maintainability](https://api.codeclimate.com/v1/badges/cce4bd525b5ba150b8b0/maintainability)](https://codeclimate.com/github/Philipeano/post-it/maintainability)
[![Code Quality](https://img.shields.io/badge/Protected%20by-Hound-blue.svg)](https://houndci.com)

## Overview
PostIT is a simple web application that enables friends and colleagues create groups for notifications. It is a multi-purpose system built for group-wide messaging.  

You can access the hosted API [here](https://postit-phil-svr.herokuapp.com/api/v1). 

## Main Features
- New users can create accounts by signing up.
- Registered users can access the app's features by signing in.
- Authenticated users can create groups for messaging.
- Group owners/creators can add other users to their groups.
- Members of a group can post messages for others to read.
- Members of a group receive notifications when a new message is posted.
- Authenticated users can search for other users registered on the platform.

## Built with

- [NodeJS](https:nodejs.org) - a runtime environment for JavaScript outside of the browser
- [ExpressJS](https://expressjs.com) - a framework for flexibly handling HTTP routing in NodeJS applications
- [PostgreSQL](www.postgresql.org) - an open-source Object-Relational Database System; used for data storage
- [Sequelize](https://github.com/sequelize/sequelize) - a multi-dialect, promise-based Object-Relational Mapper (ORM) for NodeJS
- [Webpack](https://webpack.js.org) - a module for bundling JavaScript files for usage in a browser
- [Babel](https://babeljs.io) - a transpiler for translating ES2015+ JavaScript code into ES5.
- [Mocha](https://mochajs.org) - a JavaScript test framework running on NodeJS
- [Chai](http://chaijs.com) - a BDD/TDD assertion library; used along with Mocha to define the test specifications.

## Getting started
### Setting up the project locally
- Fork this repo to your account using the _fork_ button at the top of this GitHub page.
- Clone the repo to your local computer by running ```git clone your-github-name/post-it``` from your terminal.

### Installing the dependencies
- Navigate to the project's directory from your terminal, with the command: ```cd /path/to/your/current/directory/post-it```.
- Run the following command: ```npm install```.

### Setting up the database
- Install PostgreSQL.
- For `development` purposes, create a database named `postit-db-dev`.
- For `testing` purposes, create a database named `postit-db-test`.
- Run the migration scripts using the command ```sequelize db:migrate```.
- Seed the database by running the commad ```sequelize db:seed:all ```

### Running the tests
- Run the command ```npm run start:test```.

### Using the app
#### Using Postman
- Launch the app from the terminal, then test with Postman.
#### Using the browser


## API Endpoints

```
```

## Limitations

```
```

## Contributing to the project
- Fork this repo to your account.
- Clone the repo to your local machine.
- Create your feature branch on your local machine with ```git checkout -b your-feature-branch```
- Ensure your code adheres to the [AirBnB Javascript Style Guide](https://github.com/airbnb/javascript).
- Commit and push your changes to your remote branch with ```git push origin your-feature-branch```
- Open a pull request to the master branch, and describe how your feature works.

## License
[MIT © Philip Newman.](../LICENSE)
