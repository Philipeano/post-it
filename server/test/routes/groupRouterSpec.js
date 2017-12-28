// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import server from '../../src/app';
//
// chai.use(chaiHttp);
// const should = chai.should();
// const app = server;
// const agent = chai.request.agent(app);
// const validCredentials = { username: 'philnewman', password: 'P@55w0rd' };
// const validGroup = {
//   title: 'Demo Group',
//   purpose: 'This is a sample broadcast group for testing the app.'
// };
// const invalidGroupRoute = '/api/groups/5465c9f0-bd80-11e7-9185-533cacd6c3f6';
// let createdGroupId, validGroupRoute, testGroup;
//
// describe('PostIT API', () => {
//   describe('/POST api/groups', () => {
//     beforeEach(() => {
//       testGroup = Object.assign({}, validGroup);
//     });
//
//     it('should return an error for missing group title', (done) => {
//       testGroup.title = '';
//       agent.post('/api/users/signin').send(validCredentials).then(() => {
//         agent.post('/api/groups').send(testGroup)
//           .end((err, res) => {
//             res.should.have.status(400);
//             res.body.should.be.a('object');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Title cannot be null or empty.');
//             done();
//           });
//       });
//     });
//
//     it('should return an error for missing group purpose', (done) => {
//       testGroup.purpose = '';
//       agent.post('/api/users/signin').send(validCredentials).then(() => {
//         agent.post('/api/groups').send(testGroup)
//           .end((err, res) => {
//             res.should.have.status(400);
//             res.body.should.be.a('object');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Purpose cannot be null or empty.');
//             done();
//           });
//       });
//     });
//
//     it('should return an error if group title is already in use', (done) => {
//       testGroup.title = 'Demo Group';
//       agent.post('/api/users/signin').send(validCredentials).then(() => {
//         agent.post('/api/groups').send(testGroup)
//           .end((err, res) => {
//             res.should.have.status(409);
//             res.body.should.be.a('object');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Group Title is already taken!');
//             done();
//           });
//       });
//     });
//
//     it('should create a new group if both fields are valid', (done) => {
//       testGroup.title = 'Dummy Group';
//       testGroup.purpose = 'Yet another sample group';
//       agent.post('/api/users/signin').send(validCredentials).then(() => {
//         agent.post('/api/groups').send(testGroup)
//           .end((err, res) => {
//             res.should.have.status(201);
//             res.body.should.be.a('object');
//             res.body.should.have.property('group');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Group created successfully!');
//             createdGroupId = res.body.group.id;
//             done();
//           });
//       });
//     });
//   });
//
//   describe('/GET api/groups', () => {
//     it('should fetch all available groups', (done) => {
//       agent.post('/api/users/signin').send(validCredentials).then(() => {
//         agent.get('/api/groups').send()
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('Available groups');
//             done();
//           });
//       });
//     });
//   });
//
//   describe('/GET api/groups/:groupId', () => {
//     it('should return an error if supplied group ID does not exist', (done) => {
//       agent.post('/api/users/signin').send(validCredentials).then(() => {
//         agent.get(invalidGroupRoute).send()
//           .end((err, res) => {
//             res.should.have.status(404);
//             res.body.should.be.a('object');
//             res.body.should.not.have.property('Requested group');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Requested group does not exist!');
//             done();
//           });
//       });
//     });
//
//     it('should fetch a particular group given a valid group ID', (done) => {
//       validGroupRoute = `/api/groups/${createdGroupId}`;
//       agent.post('/api/users/signin').send(validCredentials).then(() => {
//         agent.get(validGroupRoute).send()
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('Requested group');
//             res.body['Requested group'].title.should.be.eql('Dummy Group');
//             done();
//           });
//       });
//     });
//   });
//
//   describe('/DELETE api/groups/:groupId', () => {
//     it('should return an error if supplied group ID does not exist', (done) => {
//       agent.post('/api/users/signin').send(validCredentials).then(() => {
//         agent.delete(invalidGroupRoute).send()
//           .end((err, res) => {
//             res.should.have.status(404);
//             res.body.should.be.a('object');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Specified group does not exist!');
//             done();
//           });
//       });
//     });
//
//     it('should delete a particular group if supplied group ID exists',
//       (done) => {
//         validGroupRoute = `/api/groups/${createdGroupId}`;
//         agent.post('/api/users/signin').send(validCredentials).then(() => {
//           agent.delete(validGroupRoute).send()
//             .end((err, res) => {
//               res.should.have.status(200);
//               res.body.should.be.a('object');
//               res.body.should.have.property('message');
//               res.body.message.trim().should.be
//                 .eql('Group deleted successfully!');
//               done();
//             });
//         });
//       });
//   });
// });
