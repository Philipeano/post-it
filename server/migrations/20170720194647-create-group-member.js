module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('GroupMembers', {
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
          as: 'member',
        },
      },
      groupId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Groups',
          key: 'id',
          as: 'group',
        },
      },
    }),

  down: queryInterface /* , Sequelize */ => queryInterface
    .dropTable('GroupMembers'),
};
