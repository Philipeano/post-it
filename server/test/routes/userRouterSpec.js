process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server/src';

chai.use(chaiHttp);
const should = chai.should();
let validUser = { username: 'philnewman', email: 'philnewman@gmail.com', password: 'P@55w0rd', cPassword: 'P@55w0rd' };
let testUser = {};
// let inValidDemoUser = { username: 'badUser', email: 'badEmail', password: 'badPassword', cPassword: 'badPassword' }

describe('PostIT API', () => {
  describe('/POST api/users/signup', () => {
    it('should return an error for missing username', (done) => {
      testUser = Object.assign({}, validUser);
      testUser.username = '';
      chai.request(app)
      .post('/api/users/signup')
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql('Username cannot be null or empty.');
        done();
      });
    });

    it('should return an error for missing email address', (done) => {
      testUser = Object.assign({}, validUser);
      testUser.email = '';
      chai.request(app)
        .post('/api/users/signup')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Email Address cannot be null or empty.');
          done();
        });
    });

    it('should return an error for missing password', (done) => {
      testUser = Object.assign({}, validUser);
      testUser.password = '';
      chai.request(app)
        .post('/api/users/signup')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Password cannot be null or empty.');
          done();
        });
    });

    it('should return an error for missing password retype', (done) => {
      testUser = Object.assign({}, validUser);
      testUser.cPassword = '';
      chai.request(app)
        .post('/api/users/signup')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Password Retype cannot be null or empty.');
          done();
        });
    });

    it('should return an error for invalid email address', (done) => {
      testUser = Object.assign({}, validUser);
      testUser.email = 'badEmail';
      chai.request(app)
      .post('/api/users/signup')
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql(`${testUser.email} is not a valid email address.`);
        done();
      });
    });

    it('should return an error for invalid password', (done) => {
      testUser = Object.assign({}, validUser);
      testUser.password = 'badPassword';
      chai.request(app)
      .post('/api/users/signup')
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql(`${testUser.password} is not a valid password.`);
        done();
      });
    });

    it('should return an error for password mismatch', (done) => {
      testUser = Object.assign({}, validUser);
      testUser.password = 'P@55w0rd';
      testUser.cPassword = 'badPassword';
      chai.request(app)
      .post('/api/users/signup')
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.be.eql('The two passwords do not match.');
        done();
      });
    });

  });

});      



  // it('should respond with a success message if correct user details are supplied', (done) => {
  //   chai.request(app)
  //     .post('/api/users/signup')
  //     .send(testUser)
  //     .end((err, res) => {
  //       res.should.have.status(201);
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('message');
  //       res.body.should.have.property('user');
  //       res.body.message.should.be.eql('Registration successful');
  //       done();
  //     });
  //   });

  // describe('/POST api/users/signin', () => {
  //   it('should respond with an error message if username is undefined',
  //     (done) => {
  //       chai.request(app)
  //         .post('/api/users/signin')
  //         .send({
  //           password: 'undefUser1'
  //         })
  //         .end((err, res) => {
  //           res.should.have.status(400);
  //           res.body.should.be.a('object');
  //           res.body.should.have.property('message');
  //           res.body.message.should.be.eql('username must be supplied');
  //           done();
  //         });
  //     });
  //   it('should respond with a success message if correct username and password are supplied',
  //     (done) => {
  //       chai.request(app)
  //         .post('/api/users/signin')
  //         .send({
  //           username: 'existing',
  //           password: 'exist123'
  //         })
  //         .end((err, res) => {
  //           sentToken = res.body.user.token;
  //           res.should.have.status(200);
  //           res.body.should.be.a('object');
  //           res.body.should.have.property('message');
  //           res.body.should.have.property('user');
  //           res.body.user.username.should.be.eql('existing');
  //           res.body.user.email.should.be.eql('existing@gmail.com');
  //           res.body.message.should.be.eql('You are now logged in');
  //           done();
  //         });
  //     });
  // });

  // describe('/GET api/users', () => {
  //   it('should produce all available users', (done) => {
  //     chai.request(app)
  //       .post('/api/users')
  //       .send({
  //         token: sentToken,
  //         currentMembers: ''
  //       })
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('users');
  //         res.body.users[0].username.should.be.eql('existing');
  //         res.body.users[0].email.should.be.eql('existing@gmail.com');
  //         res.body.users[0].phoneNumber.should.be.eql('07012345678');
  //         done();
  //       });
  //   });

  // });

