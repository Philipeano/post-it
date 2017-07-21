module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Notifications', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },

      notificationType: { type: Sequelize.STRING, defaultValue: 'in-app' },
      status: { type: Sequelize.ENUM, values: ['unread', 'read', 'archived'], defaultValue: 'unread' },

      recipientId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'recipient',
        },
      },
      messageId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Messages',
          key: 'id',
          as: 'originalMessage',
        },
      },
    }),

  down: queryInterface /* , Sequelize */ => queryInterface.dropTable('Notifications'),
};
