import 'babel-polyfill';
import bcrypt from 'bcrypt';
import chai from 'chai';
import db from '../../src/models/index';

const should = chai.should();
const hashedPassword = bcrypt.hashSync('P@55w0rd', bcrypt.genSaltSync(3));
let targetGroup, groupAdmin, postedMessage;

describe('PostIT Database', () => {
  before(async () => {
    groupAdmin = await db.User.create({
      username: 'GroupAdmin',
      email: 'groupadmin@gmail.com',
      password: hashedPassword
    });
    targetGroup = await db.Group.create({
      title: 'Target Group',
      purpose: 'Target group for broadcast messages test',
      members: [
        {
          username: 'GroupMember1',
          email: 'groupmember1@gmail.com',
          password: hashedPassword
        },
        {
          username: 'GroupMember2',
          email: 'groupmember2@gmail.com',
          password: hashedPassword
        }
      ]
    }, {
      include: [{ model: db.User, as: 'members' }]
    }
  );
    await targetGroup.setCreator(groupAdmin);
    await targetGroup.addMember(
      groupAdmin, { through: { userRole: 'admin' }
      });
  });

  describe('Message model', () => {
    it('should post a new message to the group', async () => {
      postedMessage = await db.Message.create({
        groupId: targetGroup.id,
        senderId: groupAdmin.id,
        content: 'Dummy broadcast message 1',
      });
      postedMessage.should.be.a('object');
      postedMessage.should.have.property('dataValues');
      postedMessage.dataValues.groupId.should.be.eql(targetGroup.id);
      postedMessage.dataValues.senderId.should.be.eql(groupAdmin.id);
      postedMessage.dataValues.content.should
      .be.eql('Dummy broadcast message 1');
    });

    it('should post multiple messages in bulk to the group', async () => {
      const bulkMessages = await db.Message.bulkCreate([
        {
          groupId: targetGroup.id,
          senderId: groupAdmin.id,
          content: 'Dummy broadcast message 2',
        },
        {
          groupId: targetGroup.id,
          senderId: groupAdmin.id,
          content: 'Dummy broadcast message 3',
        },
        {
          groupId: targetGroup.id,
          senderId: groupAdmin.id,
          content: 'Dummy broadcast message 4',
        },
      ]);
      bulkMessages.should.be.a('array');
    });

    it('should fetch a particular message', async () => {
      const message = await db.Message.findById(postedMessage.id);
      message.should.be.a('object');
      message.should.have.property('dataValues');
      message.dataValues.groupId.should.be.eql(targetGroup.id);
      message.dataValues.senderId.should.be.eql(groupAdmin.id);
    });

    it('should fetch all messages meant for a specific group', async () => {
      const messages = await db.Message.findAll({
        where: { groupId: targetGroup.id } });
      messages.should.be.a('array');
      messages.length.should.be.eql(4);
      messages[1].should.have.property('dataValues');
      messages[1].dataValues.groupId.should.be.eql(targetGroup.id);
    });

    it('should update a particular message and return the message', (done) => {
      db.Message.update(
        { content: 'Updated dummy broadcast message' },
        { where: { id: postedMessage.id }, returning: true, plain: true })
        .then((updatedMessages) => {
          updatedMessages.should.be.a('array');
          updatedMessages[1].should.have.property('dataValues');
          updatedMessages[1].dataValues.content
            .should.be.eql('Updated dummy broadcast message');
          done();
        });
    });

    it('should delete a particular message', async () => {
      await db.Message.destroy({ where: { id: postedMessage.id } });
      const deletedMessage = await db.Message.findById(postedMessage.id);
      should.not.exist(deletedMessage);
    });
  });
});
