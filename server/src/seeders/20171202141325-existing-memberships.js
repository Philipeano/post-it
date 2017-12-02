module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Memberships',
      [
        {
          id: Sequelize.UUIDV1,
          memberId: '75b936c0-ba72-11e7-84e1-058ffffd96c5',
          groupId: 'c46ebe90-bd68-11e7-922f-4d48c5331440',
          userRole: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: Sequelize.UUIDV1,
          memberId: '9ee489d0-9c6f-11e7-a4d2-3b6a4940d978',
          groupId: 'c46ebe90-bd68-11e7-922f-4d48c5331440',
          userRole: 'member',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Memberships', null, {});
  }
};
