import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/app';

chai.use(chaiHttp);
const should = chai.should();
const app = server;
const memberLogin1 = { username: 'philnewman', password: 'P@55w0rd' };
const memberLogin2 = { username: 'sammy', password: 'P@55w0rd' };
const nonMemberLogin = { username: 'vicky', password: 'P@55w0rd' };
const validRoute = '/api/groups/c46ebe90-bd68-11e7-922f-4d48c5331440/messages/';
const invalidRoute = '/api/groups/5465c9f0-bd80-11e7-9185-533cacd6c3f6/messages/';
const dummyText = 'This is a demo message for testing.';
const dummyText2 = 'This is the updated version of the demo message.';
const invalidMessageId = '04f42880-cab9-11e7-8c5b-afe51c5b1c7b';
let postedMessageId, testMessage, testRoute;
let memberToken1, memberToken2, nonMemberToken;

describe('PostIT API', () => {
  before((done) => {
    chai.request(app).post('/api/users/signin').send(memberLogin1)
      .then((res) => { memberToken1 = res.body.token; });
    chai.request(app).post('/api/users/signin').send(memberLogin2)
      .then((res) => { memberToken2 = res.body.token; });
    chai.request(app).post('/api/users/signin').send(nonMemberLogin)
      .then((res) => { nonMemberToken = res.body.token; });
    done();
  });

  describe('/GET api/groups/:groupId/messages/*', () => {
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

  describe('/POST api/groups/:groupId/messages', () => {
    it('should return an error for missing message content', (done) => {
      testRoute = validRoute;
      testMessage = {};
      chai.request(app).post(testRoute)
        .set('token', memberToken1)
        .send(testMessage)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.not.have.property('Posted Message');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Content cannot be null or empty.');
          done();
        });
    });

    it('should return an error for invalid group ID', (done) => {
      testRoute = invalidRoute;
      testMessage = { content: dummyText };
      chai.request(app).post(testRoute)
        .set('token', memberToken1)
        .send(testMessage)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.not.have.property('Posted Message');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified group does not exist!');
          done();
        });
    });

    it('should return an error if sender is not a member of the group',
      (done) => {
        testRoute = validRoute;
        testMessage = { content: dummyText };
        chai.request(app).post(testRoute)
          .set('token', nonMemberToken)
          .send(testMessage)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.not.have.property('Posted Message');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('You do not belong to this group!');
            done();
        });
    });

    it('should post the message to the group if validation passes', (done) => {
      testRoute = validRoute;
      testMessage = { content: dummyText };
      chai.request(app).post(testRoute)
        .set('token', memberToken1)
        .send(testMessage)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('Posted Message');
          res.body.should.have.property('recipients');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Message posted to group successfully!');
          done();
          postedMessageId = res.body['Posted Message'].id;
        });
    });
  });

  describe('/GET api/groups/:groupId/messages', () => {
    it('should return an error if supplied group ID does not exist', (done) => {
      testRoute = invalidRoute;
      chai.request(app).get(testRoute)
        .set('token', memberToken1)        
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.not.have.property('Messages');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified group does not exist!');
          done();
        });
    });

    it('should return an error if the user is not a member of the group',
      (done) => {
        testRoute = validRoute;        
        chai.request(app).get(testRoute)
          .set('token', nonMemberToken)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.not.have.property('Messages');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('You do not belong to this group!');
            done();
          });
      });

    it('should fetch all messages meant for the group if validation passes',
      (done) => {
        testRoute = validRoute;        
        chai.request(app).get(testRoute)
          .set('token', memberToken1)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('Messages');
            done();
          });
    });
  });

  describe('/PATCH api/groups/:groupId/messages/:messageId', () => {
    it('should return an error for missing message content', (done) => {
      testRoute = `${validRoute}${postedMessageId}`;
      testMessage = {};     
      chai.request(app).patch(testRoute)
        .set('token', memberToken1)
        .send(testMessage)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.not.have.property('Updated Message');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Content cannot be null or empty.');
          done();
        });
    });

    it('should return an error for invalid group ID', (done) => {
      testRoute = `${invalidRoute}${postedMessageId}`;
      testMessage = { content: dummyText2 };
      chai.request(app).patch(testRoute)
        .set('token', memberToken1)
        .send(testMessage)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.not.have.property('Updated Message');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified group does not exist!');
          done();
        });
    });

    it('should return an error if supplied message ID does not exist',
      (done) => {
        testRoute = `${validRoute}${invalidMessageId}`;
        testMessage = { content: dummyText2 };
        chai.request(app).patch(testRoute)
          .set('token', memberToken1)
          .send(testMessage)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.not.have.property('Updated Message');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('Specified message does not exist!');
            done();
          });
      });

    it('should return an error if the user is not a member of the group',
      (done) => {
        testRoute = `${validRoute}${postedMessageId}`;
        testMessage = { content: dummyText2 };
        chai.request(app).patch(testRoute)
          .set('token', nonMemberToken)
          .send(testMessage)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.not.have.property('Updated Message');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('You do not belong to this group!');
            done();
          });
      });

    it('should return an error if the user is not the original sender',
      (done) => {
        testRoute = `${validRoute}${postedMessageId}`;
        testMessage = { content: dummyText2 };
        chai.request(app).patch(testRoute)
          .set('token', memberToken2)
          .send(testMessage)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.not.have.property('Updated Message');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('You are not the sender of this message!');
            done();
          });
      });

    it('should update the previously posted message if validation passes',
      (done) => {
        testRoute = `${validRoute}${postedMessageId}`;
        testMessage = { content: dummyText2 };
        chai.request(app).patch(testRoute)
          .set('token', memberToken1)
          .send(testMessage)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('Updated Message');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('Message updated successfully!');
            done();
          });
      });
  });

  describe('/DELETE api/groups/:groupId/messages/:messageId', () => {
    it('should return an error for invalid group ID', (done) => {
      testRoute = `${invalidRoute}${postedMessageId}`;
      chai.request(app).delete(testRoute)
        .set('token', memberToken1)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.trim().should.be
            .eql('Specified group does not exist!');
          done();
        });
    });

    it('should return an error if supplied message ID does not exist',
      (done) => {
        testRoute = `${validRoute}${invalidMessageId}`;
        chai.request(app).delete(testRoute)
          .set('token', memberToken1)
          .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('Specified message does not exist!');
            done();
          });
      });

    it('should return an error if the user is not a member of the group',
      (done) => {
        testRoute = `${validRoute}${postedMessageId}`;
        chai.request(app).delete(testRoute)
          .set('token', nonMemberToken)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('You do not belong to this group!');
            done();
          });
      });

    it('should return an error if the user is not the original sender',
      (done) => {
        testRoute = `${validRoute}${postedMessageId}`;
        chai.request(app).delete(testRoute)
          .set('token', memberToken2)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('You are not the sender of this message!');
            done();
          });
      });

    it('should delete the previously posted message if validation passes',
      (done) => {
        testRoute = `${validRoute}${postedMessageId}`;
        chai.request(app).delete(testRoute)
          .set('token', memberToken1)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.trim().should.be
              .eql('Message deleted successfully!');
            done();
          });
      });
  });
});
