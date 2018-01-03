module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Groups',
      [
        {
          id: 'c46ebe90-bd68-11e7-922f-4d48c5331440',
          title: 'Demo Group',
          purpose: 'This is a sample broadcast group for testing the app.',
          creatorId: '75b936c0-ba72-11e7-84e1-058ffffd96c5',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Groups', null, {});
  }
};
