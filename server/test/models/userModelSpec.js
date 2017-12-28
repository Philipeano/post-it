import chai from 'chai';
import bcrypt from 'bcrypt';
import db from '../../src/models/index';

const should = chai.should();
const hashedPassword = bcrypt.hashSync('P@55w0rd', 3);

describe('PostIT Database', () => {
  describe('User model', (done) => {
    before(() => {
      db.sequelize.sync({ force: true })
        .then(() => {})
        .catch((error) => {
          done(error);
        });
    });

    it('should create a new record', () => {
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
        });
    });
  });
});

