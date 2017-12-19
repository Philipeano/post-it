'use strict';

var bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(3);
var hashedPassword = bcrypt.hashSync('P@55w0rd', salt);

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('Users', [{
      id: '75b936c0-ba72-11e7-84e1-058ffffd96c5',
      username: 'philnewman',
      password: hashedPassword,
      email: 'philnewman@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '50bd1190-a116-11e7-8614-2b874e7804bc',
      username: 'vicky',
      password: hashedPassword,
      email: 'vicky@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '9ee489d0-9c6f-11e7-a4d2-3b6a4940d978',
      username: 'sammy',
      password: hashedPassword,
      email: 'sammy@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  down: function down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};