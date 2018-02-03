import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/app';

chai.use(chaiHttp);
const should = chai.should();
const app = server;
const validCredentials = { username: 'philnewman', password: 'P@55w0rd' };
const validRoute = '/api/groups/c46ebe90-bd68-11e7-922f-4d48c5331440/users/';
const invalidRoute = '/api/groups/5465c9f0-bd80-11e7-9185-533cacd6c3f6/users/';
const validUserId = '50bd1190-a116-11e7-8614-2b874e7804bc';
const invalidUserId = '9c75f270-a15f-11e7-9bb0-b7bf1c74a69d';
const memberUserId = '75b936c0-ba72-11e7-84e1-058ffffd96c5';
let testMember, testRoute, authToken;

describe('PostIT API', () => {
  before(() => {
    chai.request(app).post('/api/users/signin').send(validCredentials)
      .then((res) => { authToken = res.body.token; });
  });

  describe('/GET api/groups/:groupId/users/*', () => {
    it('should not have access to this route without a token', (done) => {
      chai.request(app).get(validRoute).end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.trim().should.be
          .eql('Access denied! Please sign in first.');
        done();
      });
    });
  });

  describe('/POST api/groups/:groupId/users', () => {
    it('should return an error for missing user ID', (done) => {
      testRoute = validRoute;
      testMember = {};
      chai.request(app).post(testRoute)
        .set('token', authToken)
        .send(testMember)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('User ID cannot be null or empty.');
          done();
        });
    });

    it('should return an error for invalid group ID', (done) => {
      testRoute = invalidRoute;
      testMember = { userId: validUserId };
      chai.request(app).post(testRoute)
        .set('token', authToken)
        .send(testMember)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified group does not exist!');
          done();
        });
    });

    it('should return an error for invalid user ID', (done) => {
      testRoute = validRoute;
      testMember = { userId: invalidUserId };
      chai.request(app).post(testRoute)
        .set('token', authToken)
        .send(testMember)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified user does not exist!');
          done();
        });
    });

    it('should return an error if the user is already in the group', (done) => {
      testRoute = validRoute;
      testMember = { userId: memberUserId };
      chai.request(app).post(testRoute)
        .set('token', authToken)
        .send(testMember)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('User is already in the group!');
          done();
        });
    });

    it('should add the user to the group if both IDs are valid', (done) => {
      testRoute = validRoute;
      testMember = { userId: validUserId };
      chai.request(app).post(testRoute)
        .set('token', authToken)
        .send(testMember)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('membership');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('User added to group successfully!');
          done();
        });
    });
  });

  describe('/GET api/groups/:groupId/users', () => {
    it('should fetch all members of the group', (done) => {
      testRoute = validRoute;
      chai.request(app).get(testRoute)
        .set('token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('Memberships');
          done();
        });
    });
  });

  describe('/DELETE api/groups/:groupId/users/:userId', () => {
    it('should return an error if supplied group ID does not exist', (done) => {
      testRoute = `${invalidRoute}${validUserId}`;
      chai.request(app).delete(testRoute)
        .set('token', authToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified group does not exist!');
          done();
        });
    });

    it('should return an error if supplied user ID does not exist', (done) => {
      testRoute = `${validRoute}${invalidUserId}`;
      chai.request(app).delete(testRoute)
        .set('token', authToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified user does not exist!');
          done();
        });
    });

    it('should delete the user from the group if supplied IDs are valid',
      (done) => {
        testRoute = `${validRoute}${validUserId}`;
        chai.request(app).delete(testRoute)
          .set('token', authToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('Member deleted from group successfully!');
            done();
          });
      });

    it('should return an error if the user is not a member of the group',
      (done) => {
        testRoute = `${validRoute}${validUserId}`;
        chai.request(app).delete(testRoute)
          .set('token', authToken)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('Specified membership does not exist!');
            done();
          });
      });
  });
});
