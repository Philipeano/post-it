import 'babel-polyfill';
import chai from 'chai';
import db from '../../src/models/index';

const should = chai.should();
const validUserId = '75b936c0-ba72-11e7-84e1-058ffffd96c5';

describe('PostIT Database', () => {
  describe('Group model', () => {
    it('should create a single record', async () => {
      const newGroup = await db.Group.create({
        title: 'Test Group 1',
        purpose: 'This is sample group 1',
        creatorId: validUserId,
      });
      newGroup.should.be.a('object');
      newGroup.should.have.property('dataValues');
      newGroup.dataValues.title.should.be.eql('Test Group 1');
      newGroup.dataValues.purpose.should.be.eql('This is sample group 1');
    });

    it('should create bulk records', async () => {
      const newGroups = await db.Group.bulkCreate([
        { title: 'Test Group 2',
          purpose: 'This is sample group 2',
          creatorId: validUserId
        },
        { title: 'Test Group 3',
          purpose: 'This is sample group 3',
          creatorId: validUserId
        },
        {
          title: 'Test Group 4',
          purpose: 'This is sample group 4',
          creatorId: validUserId
        },
      ]);
      newGroups.should.be.a('array');
    });

    it('should fetch a particular record', async () => {
      const group = await db.Group
      .findOne({ where: { title: 'Test Group 1' } });
      group.should.be.a('object');
      group.should.have.property('dataValues');
      group.dataValues.title.should.be.eql('Test Group 1');
      group.dataValues.purpose.should.be.eql('This is sample group 1');
    });

    it('should fetch all records', async () => {
      const groups = await db.Group.findAll();
      groups.should.be.a('array');
      groups.length.should.be.above(1);
      groups[1].should.have.property('dataValues');
    });

    it('should update a particular record and return the record', async () => {
      const updatedGroups = await db.Group.update(
        { title: 'Updated Test Group', purpose: 'This test group was updated' },
        { where: { title: 'Test Group 1' }, returning: true, plain: true }
        );
      updatedGroups.should.be.a('array');
      updatedGroups[1].should.have.property('dataValues');
      updatedGroups[1].dataValues.title.should.be.eql('Updated Test Group');
      updatedGroups[1].dataValues.purpose.should.be
      .eql('This test group was updated');
    });

    it('should delete a particular record', async () => {
      await db.Group.destroy({ where: { title: 'Test Group 4' } });
      const deletedGroup = await db.Group
      .findOne({ where: { title: 'Test Group 4' } });
      should.not.exist(deletedGroup);
    });
  });
});
