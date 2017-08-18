<<<<<<< HEAD
<<<<<<< HEAD
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
// const config = require(`${__dirname}/../config/config.json`)[env];
=======
/* eslint-disable spaced-comment */
=======
>>>>>>> server
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

>>>>>>> server
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database,
    config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import((path.join(__dirname, file)));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
<<<<<<< HEAD
<<<<<<< HEAD

export default db;


// var Sequelize = require('sequelize');
//
// var options = {
//   logging: false,
//   dialect: 'postgres',
//   port = process.env.DB_PORT;
// }
//
// var sequelize = new Sequelize(process.env.DB_DATABASE ||
// '', process.env.DB_USER || '', process.env.DB_PASS || '', options)
//
// sequelize.authenticate().then(function(test){console.log(test)});
// Errors out
=======
// db.DataTypes = DataTypes;
=======
>>>>>>> server

export default db;
>>>>>>> server
