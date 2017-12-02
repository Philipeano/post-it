module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Memberships',
      [
        {
          memberId: '75b936c0-ba72-11e7-84e1-058ffffd96c5',
          groupId: 'c46ebe90-bd68-11e7-922f-4d48c5331440',
          memberRole: 'admin'
        },
        {
          memberId: '9ee489d0-9c6f-11e7-a4d2-3b6a4940d978',
          groupId: 'c46ebe90-bd68-11e7-922f-4d48c5331440',
          memberRole: 'member'
        }
      ], {});
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Memberships', null, {});
  }
};
