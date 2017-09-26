'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.createTable('Messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: ['visible', 'archived'],
        defaultValue: 'visible'
      },
      priority: {
        type: Sequelize.ENUM,
        values: ['normal', 'urgent', 'critical'],
        defaultValue: 'normal'
      },

      senderId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'sender'
        }
      },
      groupId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Groups',
          key: 'id',
          as: 'group'
        }
      }
    });
  },

  down: function down(queryInterface /* , Sequelize */) {
    return queryInterface.dropTable('Messages');
  }
};