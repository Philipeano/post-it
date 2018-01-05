import 'babel-polyfill';
import chai from 'chai';
import bcrypt from 'bcrypt';
import db from '../../src/models/index';

const should = chai.should();
const hashedPassword = bcrypt.hashSync('P@55w0rd', bcrypt.genSaltSync(3));

describe('PostIT Database', () => {
  describe('User model', () => {
    it('should create a single record', async () => {
      const newUser = await db.User.create({
        username: 'TestUser1',
        email: 'testuser1@gmail.com',
        password: hashedPassword
      });
      newUser.should.be.a('object');
      newUser.should.have.property('dataValues');
      newUser.dataValues.username.should.be.eql('TestUser1');
      newUser.dataValues.email.should.be.eql('testuser1@gmail.com');
    });

    it('should create bulk records', async () => {
      const newUsers = await db.User.bulkCreate([
        { username: 'TestUser2',
          email: 'testuser2@gmail.com',
          password: hashedPassword
        },
        { username: 'TestUser3',
          email: 'testuser3@gmail.com',
          password: hashedPassword
        },
        {
          username: 'TestUser4',
          email: 'testuser4@gmail.com',
          password: hashedPassword
        },
      ]);
      newUsers.should.be.a('array');
    });

    it('should fetch a particular record', async () => {
      const user = await db.User.findOne({ where: { username: 'TestUser1' } });
      user.should.be.a('object');
      user.should.have.property('dataValues');
      user.dataValues.username.should.be.eql('TestUser1');
      user.dataValues.email.should.be.eql('testuser1@gmail.com');
    });

    it('should fetch all records', async () => {
      const users = await db.User.findAll()
      users.should.be.a('array');
      users.length.should.be.above(1);
      users[1].should.have.property('dataValues');
    });

    it('should update a particular record and return the record', async () => {
      const updatedUsers = await db.User.update(
        { username: 'UpdatedTestUser', email: 'updatedtestuser@gmail.com' },
        { where: { username: 'TestUser1' }, returning: true, plain: true }
        );
      updatedUsers.should.be.a('array');
      updatedUsers[1].should.have.property('dataValues');
      updatedUsers[1].dataValues.username.should.be.eql('UpdatedTestUser');
      updatedUsers[1].dataValues.email
      .should.be.eql('updatedtestuser@gmail.com');
    });

    it('should delete a particular record', async () => {
      await db.User.destroy({ where: { username: 'TestUser4' } });
      const deletedUser = await db.User
      .findOne({ where: { username: 'TestUser4' } });
      should.not.exist(deletedUser);
    });
  });
});
