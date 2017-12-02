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
    username: 'Newman',
    password: 'andela2017',
    database: 'postit-db-test',
    host: '127.0.0.1',
    port: 5432,
    secret_key: process.env.SECRET_KEY,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'PROD_DB_URL',
    username: '?',
    password: '?',
    database: '?',
    host: '?',
    dialect: '?'
  }
};
