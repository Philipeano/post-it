module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Groups', {
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

      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      purpose: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      creatorId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'creator',
        },
      },
    }),

  down: queryInterface /* , Sequelize */ => queryInterface.dropTable('Groups'),
};
