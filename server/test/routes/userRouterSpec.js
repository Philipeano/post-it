import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/app';

chai.use(chaiHttp);
const should = chai.should();
const app = server;
const validUser = {
  username: 'philnewman',
  email: 'philnewman@gmail.com',
  password: 'P@55w0rd',
  cPassword: 'P@55w0rd'
};
let testUser;
let createdUserId;
let validUserRoute;
const invalidUserRoute = '/api/users/c4afc0a0-ba72-11e7-91e3-f5d58be223cf';


describe('PostIT API', () => {
  describe('/POST api/users/signup', () => {
    beforeEach(() => {
      testUser = Object.assign({}, validUser);
    });

    it('should return an error for missing username', (done) => {
      testUser.username = '';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Username cannot be null or empty.');
          done();
        });
    });

    it('should return an error for missing email address', (done) => {
      testUser.email = '';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Email Address cannot be null or empty.');
          done();
        });
    });

    it('should return an error for missing password', (done) => {
      testUser.password = '';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Password cannot be null or empty.');
          done();
        });
    });

    it('should return an error for missing password retype', (done) => {
      testUser.cPassword = '';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Password Retype cannot be null or empty.');
          done();
        });
    });

    it('should return an error for invalid email address', (done) => {
      testUser.email = 'badEmail';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql(`${testUser.email} is not a valid email address.`);
          done();
        });
    });

    it('should return an error for invalid password', (done) => {
      testUser.password = 'badPassword';
      testUser.cPassword = 'badPassword';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql(`${testUser.password} is not a valid password.`);
          done();
        });
    });

    it('should return an error for password mismatch', (done) => {
      testUser.cPassword = 'badPassword';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('The two passwords do not match.');
          done();
        });
    });

    it('should return an error message if username is unavailable', (done) => {
      testUser.username = 'philnewman';
      testUser.email = 'philnewman1@gmail.com';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Username is already in use!');
          done();
        });
    });

    it('should return an error message if email already exists', (done) => {
      testUser.username = 'philnewman1';
      testUser.email = 'philnewman@gmail.com';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Email Address already exists!');
          done();
        });
    });

    it('should create a new user if all fields are valid', (done) => {
      testUser.username = 'philnewman1';
      testUser.email = 'philnewman1@gmail.com';
      chai.request(app).post('/api/users/signup').send(testUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('You signed up successfully!');
          createdUserId = res.body.user.id;
          done();
        });
    });
  });

  describe('/POST api/users/signin', () => {
    beforeEach(() => {
      testUser = Object.assign({}, validUser);
    });

    it('should return an error for missing username', (done) => {
      testUser.username = '';
      chai.request(app).post('/api/users/signin').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.not.have.property('user');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Username cannot be null or empty.');
          done();
        });
    });

    it('should return an error for missing password', (done) => {
      testUser.password = '';
      chai.request(app).post('/api/users/signin').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.not.have.property('user');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Password cannot be null or empty.');
          done();
        });
    });

    it('should return an error for unregistered username', (done) => {
      testUser.username = 'unknownUser';
      chai.request(app).post('/api/users/signin').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.not.have.property('user');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Username does not exist!');
          done();
        });
    });

    it('should return an error for wrong password', (done) => {
      testUser.password = 'wrongPassword';
      chai.request(app).post('/api/users/signin').send(testUser)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.not.have.property('user');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Password is wrong!');
          done();
        });
    });

    it('should sign in the user if both fields are valid', (done) => {
      chai.request(app).post('/api/users/signin').send(testUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          res.body.user.username.should.be.eql(testUser.username);
          res.body.user.email.should.be.eql(testUser.email);
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('You signed in successfully!');
          done();
        });
    });
  });

  describe('/POST api/users/signout', () => {
    it('should return a success message after signing user out', (done) => {
      chai.request(app).post('/api/users/signout').send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.not.have.property('user');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('You have been logged out.');
          done();
        });
    });
  });

  describe('/GET api/users', () => {
    it('should fetch all registered users', (done) => {
      chai.request(app).get('/api/users').send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('Registered users');
          done();
        });
    });
  });

  describe('/GET api/users/:userId', () => {
    it('should return an error if supplied user ID does not exist', (done) => {
      chai.request(app).get(invalidUserRoute)
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.not.have.property('Specified user');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified user does not exist!');
          done();
        });
    });

    it('should fetch a particular user if supplied user ID exists', (done) => {
      validUserRoute = `/api/users/${createdUserId}`;
      chai.request(app).get(validUserRoute)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('Specified user');
          res.body['Specified user'].username.should.be.eql('philnewman1');
          res.body['Specified user'].email.should.be
            .eql('philnewman1@gmail.com');
          done();
        });
    });
  });

  describe('/DELETE api/users/:userId', () => {
    it('should return an error if supplied user ID does not exist', (done) => {
      chai.request(app)
        .delete(invalidUserRoute)
        .send()
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified user does not exist!');
          done();
        });
    });

    it('should delete a particular user if supplied user ID exists', (done) => {
      validUserRoute = `/api/users/${createdUserId}`;
      chai.request(app)
        .delete(validUserRoute)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('User deleted successfully!');
          done();
        });
    });
  });
});

