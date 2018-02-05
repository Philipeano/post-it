const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: 'Newman',
    password: 'andela2017',
    database: 'postit-db-dev',
    host: '127.0.0.1',
    port: 5432,
    secret_key: process.env.SECRET_KEY,
    dialect: 'postgres'
  },
  test: {
    username: 'postgres',
    password: '',
    database: 'postit_db_test',
    host: '127.0.0.1',
    port: 5432,
    secret_key: process.env.SECRET_KEY,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    username: 'postgres',
    password: '',
    host: 'postgresql-angular-59718.herokuapp.com',
    dialect: 'postgres',
  }
};
