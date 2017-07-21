module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV1, primaryKey: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },

      username: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      isLoggedIn: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      picture: { type: Sequelize.BINARY, allowNull: true },
    }),

  down: queryInterface /* , Sequelize */ => queryInterface.dropTable('Users'),
};

//         User.hasMany(models.Group, {
//           foreignKey: 'creatorId',
//           as: 'ownGroups',
//         });
//
//         User.hasMany(models.GroupMember, {
//           foreignKey: 'memberId',
//           as: 'memberships',
//         });
//
//         User.hasMany(models.Message, {
//           foreignKey: 'senderId',
//           as: 'sentMessages',
//         });
//
//         User.hasMany(models.Notification, {
//           foreignKey: 'recipientId',
//           as: 'notifications',
//         });

