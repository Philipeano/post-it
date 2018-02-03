import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/app';

chai.use(chaiHttp);
const should = chai.should();
const app = server;
const validCredentials = { username: 'philnewman', password: 'P@55w0rd' };
const validGroup = {
  title: 'Demo Group',
  purpose: 'This is a sample broadcast group for testing the app.'
};
const invalidGroupRoute = '/api/groups/5465c9f0-bd80-11e7-9185-533cacd6c3f6';
let createdGroupId, validGroupRoute, testGroup, authToken;

describe('PostIT API', () => {
  before((done) => {
    chai.request(app).post('/api/users/signin').send(validCredentials)
      .then((res) => { authToken = res.body.token; });
    done();
  });

  beforeEach(() => {
    testGroup = Object.assign({}, validGroup);
  });

  describe('/GET api/groups/*', () => {
    it('should not have access to this route without a token', (done) => {
      chai.request(app).get('/api/groups')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Access denied! Please sign in first.');
          done();
        });
    });
  });

  describe('/POST api/groups', () => {
    it('should return an error for missing group title', (done) => {
      testGroup.title = '';
      chai.request(app).post('/api/groups')
        .set('token', authToken)
        .send(testGroup)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .include('Title cannot be null or empty.');
          done();
        });
    });

    it('should return an error for missing group purpose', (done) => {
      testGroup.purpose = '';
      chai.request(app).post('/api/groups')
        .set('token', authToken)
        .send(testGroup)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .include('Purpose cannot be null or empty.');
          done();
        });
    });

    it('should return an error if group title is already in use', (done) => {
      testGroup.title = 'Demo Group';
      chai.request(app).post('/api/groups')
        .set('token', authToken)
        .send(testGroup)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Group Title is already taken!');
          done();
        });
    });

    it('should create a new group if both fields are valid', (done) => {
      testGroup.title = 'Demo Group 2';
      testGroup.purpose = 'Yet another sample group';
      chai.request(app).post('/api/groups')
        .set('token', authToken)
        .send(testGroup)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('group');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Group created successfully!');
          createdGroupId = res.body.group.id;
          done();
        });
    });
  });

  describe('/GET api/groups', () => {
    it('should fetch all available groups', (done) => {
      chai.request(app).get('/api/groups')
        .set('token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('Available groups');
          done();
        });
    });
  });

  describe('/GET api/groups/:groupId', () => {
    it('should return an error if supplied group ID does not exist', (done) => {
      chai.request(app).get(invalidGroupRoute)
        .set('token', authToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.not.have.property('Requested group');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Requested group does not exist!');
          done();
        });
    });

    it('should fetch a particular group given a valid group ID', (done) => {
      validGroupRoute = `/api/groups/${createdGroupId}`;
      chai.request(app).get(validGroupRoute)
        .set('token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('Requested group');
          res.body['Requested group'].title.should.be.eql('Demo Group 2');
          done();
        });
    });
  });

  describe('/DELETE api/groups/:groupId', () => {
    it('should return an error if supplied group ID does not exist', (done) => {
      chai.request(app).delete(invalidGroupRoute)
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

    it('should delete a particular group if supplied group ID exists',
      (done) => {
        validGroupRoute = `/api/groups/${createdGroupId}`;
        chai.request(app).delete(validGroupRoute)
          .set('token', authToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('Group deleted successfully!');
            done();
          });
      });
  });
});
