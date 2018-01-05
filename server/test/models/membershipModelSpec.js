import 'babel-polyfill';
import bcrypt from 'bcrypt';
import chai from 'chai';
import db from '../../src/models/index';

const should = chai.should();
const hashedPassword = bcrypt.hashSync('P@55w0rd', bcrypt.genSaltSync(3));
let dummyGroup;
let dummyMember1, dummyMember2, dummyMember3, dummyMember4;

describe('PostIT Database', () => {
  before(async () => {
    dummyMember1 = await db.User.create({
      username: 'DummyUser1',
      email: 'dummyuser1@gmail.com',
      password: hashedPassword
    });
    dummyMember2 = await db.User.create({
      username: 'DummyUser2',
      email: 'dummyuser2@gmail.com',
      password: hashedPassword
    });
    dummyMember3 = await db.User.create({
      username: 'DummyUser3',
      email: 'dummyuser3@gmail.com',
      password: hashedPassword
    });
    dummyMember4 = await db.User.create({
      username: 'DummyUser4',
      email: 'dummyuser4@gmail.com',
      password: hashedPassword
    });
    dummyGroup = await db.Group.create({
      title: 'Dummy Group',
      purpose: 'Dummy group for membership test',
      creatorId: dummyMember1.id
    });
  });

  describe('Membership model', () => {
    it('should add a single member to the group', async () => {
      const newMembership = await db.Membership.create({
        groupId: dummyGroup.id,
        memberId: dummyMember1.id,
        userRole: 'admin',
      });
      newMembership.should.be.a('object');
      newMembership.should.have.property('dataValues');
      newMembership.dataValues.groupId.should.be.eql(dummyGroup.id);
      newMembership.dataValues.memberId.should.be.eql(dummyMember1.id);
      newMembership.dataValues.userRole.should.be.eql('admin');
    });

    it('should add multiple members to the group', async () => {
      const newMemberships = await db.Membership.bulkCreate([
        { groupId: dummyGroup.id,
          memberId: dummyMember2.id,
          userRole: 'member',
        },
        { groupId: dummyGroup.id,
          memberId: dummyMember3.id,
          userRole: 'member',
        },
        {
          groupId: dummyGroup.id,
          memberId: dummyMember4.id,
          userRole: 'member',
        },
      ]);
      newMemberships.should.be.a('array');
    });

    it('should fetch a particular membership record', async () => {
      const membership = await db.Membership.findOne({
        where: { groupId: dummyGroup.id, memberId: dummyMember3.id } });
      membership.should.be.a('object');
      membership.should.have.property('dataValues');
      membership.dataValues.groupId.should.be.eql(dummyGroup.id);
      membership.dataValues.memberId.should.be.eql(dummyMember3.id);
    });

    it('should fetch all members of a specific group', async () => {
      const memberships = await db.Membership.findAll({
        where: { groupId: dummyGroup.id } });
      memberships.should.be.a('array');
      memberships.length.should.be.eql(4);
      memberships[1].should.have.property('dataValues');
      memberships[1].dataValues.groupId.should.be.eql(dummyGroup.id);
    });

    it('should fetch all membership records', async () => {
      const memberships = await db.Membership.findAll();
      memberships.should.be.a('array');
      memberships.length.should.be.above(4);
      memberships[1].should.have.property('dataValues');
    });

    it('should delete a particular membership record', async () => {
      await db.Membership.destroy({
        where: { groupId: dummyGroup.id, memberId: dummyMember4.id } });
      const deletedMembership = await db.Membership.findOne({
        where: { groupId: dummyGroup.id, memberId: dummyMember4.id } });
      should.not.exist(deletedMembership);
    });
  });
});
