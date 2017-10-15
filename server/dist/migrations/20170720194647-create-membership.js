'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.createTable('Memberships', {
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

      userRole: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'member'
      },
      memberId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'member'
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
    return queryInterface.dropTable('Memberships');
  }
};