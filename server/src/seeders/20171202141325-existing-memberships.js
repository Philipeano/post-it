module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Memberships',
      [
        {
          id: '047fbd50-2d5a-4800-86f0-05583673fd7f',
          memberId: '75b936c0-ba72-11e7-84e1-058ffffd96c5',
          groupId: 'c46ebe90-bd68-11e7-922f-4d48c5331440',
          userRole: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '75ba1746-bc81-47e5-b43f-cc1aa304db84',
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
