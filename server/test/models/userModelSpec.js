import chai from 'chai';
import bcrypt from 'bcrypt';
import db from '../../src/models/index';

const should = chai.should();
const hashedPassword = bcrypt.hashSync('P@55w0rd', bcrypt.genSaltSync(3));

describe('PostIT Database', () => {
  describe('User model', () => {
    it('should create a single record', (done) => {
      db.User.create({
        username: 'TestUser1',
        email: 'testuser1@gmail.com',
        password: hashedPassword
      })
        .then((newUser) => {
          newUser.should.be.a('object');
          newUser.should.have.property('dataValues');
          newUser.dataValues.username.should.be.eql('TestUser1');
          newUser.dataValues.email.should.be.eql('testuser1@gmail.com');
          done();
        });
    });

    it('should create bulk records', (done) => {
      db.User.bulkCreate([
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
      ])
        .then((newUsers) => {
          newUsers.should.be.a('array');
          done();
        });
    });

    it('should fetch a particular record', (done) => {
      db.User.findOne({ where: { username: 'TestUser1' } })
        .then((user) => {
          user.should.be.a('object');
          user.should.have.property('dataValues');
          user.dataValues.username.should.be.eql('TestUser1');
          user.dataValues.email.should.be.eql('testuser1@gmail.com');
          done();
        });
    });

    it('should fetch all records', (done) => {
      db.User.findAll()
        .then((users) => {
          users.should.be.a('array');
          users.length.should.be.above(1);
          users[1].should.have.property('dataValues');
          done();
        });
    });

    it('should update a particular record and return the record', (done) => {
      db.User.update(
        { username: 'UpdatedTestUser', email: 'updatedtestuser@gmail.com' },
        { where: { username: 'TestUser1' }, returning: true, plain: true }
        )
        .then((updatedUsers) => {
          updatedUsers.should.be.a('array');
          updatedUsers[1].should.have.property('dataValues');
          updatedUsers[1].dataValues.username
            .should.be.eql('UpdatedTestUser');
          updatedUsers[1].dataValues.email
            .should.be.eql('updatedtestuser@gmail.com');
          done();
        });
    });

    it('should delete a particular record', (done) => {
      db.User.destroy({ where: { username: 'TestUser4' } })
        .then(() => {
          db.User.findOne({ where: { username: 'TestUser4' } })
            .then((deletedUser) => {
              should.not.exist(deletedUser);
              done();
            });
        });
    });
  });
});
