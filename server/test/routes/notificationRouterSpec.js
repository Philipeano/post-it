// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import server from '../../src/app';
//
// chai.use(chaiHttp);
// const should = chai.should();
// const app = server;
// const agent = chai.request.agent(app);
// const memberLogin = { username: 'sammy', password: 'P@55w0rd' };
// const nonMemberLogin = { username: 'vicky', password: 'P@55w0rd' };
// const authorisedRoute
//   = '/api/users/9ee489d0-9c6f-11e7-a4d2-3b6a4940d978/notifications';
// const unauthorisedRoute
//   = '/api/users/75b936c0-ba72-11e7-84e1-058ffffd96c5/notifications';
// const invalidRoute
//   = '/api/users/75b936c0-ba72-11e7-84e1-058ffffd96c6/notifications';
// const validNotificationId = '8d72627a-8169-40c4-958c-ab97c9b9ba8f';
// const invalidNotificationId = '8d72627a-8169-40c4-958c-ab97c9b9ba8e';
// const validGroupId = 'c46ebe90-bd68-11e7-922f-4d48c5331440';
// const invalidGroupId = 'c46ebe90-bd68-11e7-922f-4d48c5331441';
// let testRoute;
//
// describe('PostIT API', () => {
//   // describe('/POST api/users/:userId/notifications', () => {
//   //   it('should return an error for missing message content', (done) => {
//   //     testRoute = validRoute;
//   //     testMessage = {};
//   //     agent.post('/api/users/signin').send(memberLogin).then(() => {
//   //       agent.post(testRoute).send(testMessage).end((err, res) => {
//   //         res.should.have.status(400);
//   //         res.body.should.be.a('object');
//   //         res.body.should.not.have.property('Posted Message');
//   //         res.body.should.have.property('message');
//   //         res.body.message.trim().should.be
//   //           .eql('Content cannot be null or empty.');
//   //         done();
//   //       });
//   //     });
//   //   });
//   //
//   //   it('should return an error for invalid group ID', (done) => {
//   //     testRoute = invalidRoute;
//   //     testMessage = { content: dummyText };
//   //     agent.post('/api/users/signin').send(memberLogin).then(() => {
//   //       agent.post(testRoute).send(testMessage).end((err, res) => {
//   //         res.should.have.status(404);
//   //         res.body.should.be.a('object');
//   //         res.body.should.not.have.property('Posted Message');
//   //         res.body.should.have.property('message');
//   //         res.body.message.trim().should.be
//   //           .eql('Specified group does not exist!');
//   //         done();
//   //       });
//   //     });
//   //   });
//   //
//   //   it('should return an error if sender is not a member of the group',
//   //     (done) => {
//   //       testRoute = validRoute;
//   //       testMessage = { content: dummyText };
//   //       agent.post('/api/users/signin').send(nonMemberLogin).then(() => {
//   //         agent.post(testRoute).send(testMessage).end((err, res) => {
//   //           res.should.have.status(403);
//   //           res.body.should.be.a('object');
//   //           res.body.should.not.have.property('Posted Message');
//   //           res.body.should.have.property('message');
//   //           res.body.message.trim().should.be
//   //             .eql('You do not belong to this group!');
//   //           done();
//   //         });
//   //       });
//   //     });
//   //
//   //   it('should post the message to the group if validation passes', (done) => {
//   //     testRoute = validRoute;
//   //     testMessage = { content: dummyText };
//   //     agent.post('/api/users/signin').send(memberLogin).then(() => {
//   //       agent.post(testRoute).send(testMessage).end((err, res) => {
//   //         res.should.have.status(201);
//   //         res.body.should.be.a('object');
//   //         res.body.should.have.property('Posted Message');
//   //         res.body.should.have.property('recipients');
//   //         res.body.should.have.property('message');
//   //         res.body.message.trim().should.be
//   //           .eql('Message posted to group successfully!');
//   //         done();
//   //         invalidNotificationId = res.body['Posted Message'].id;
//   //       });
//   //     });
//   //   });
//   // });
//
//   describe('/GET api/users/:userId/notifications', () => {
//     it('should return an error if supplied user ID does not exist', (done) => {
//       testRoute = invalidRoute;
//       agent.get('/api/users/signin').send(memberLogin).then(() => {
//         agent.get(testRoute).send().end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.should.not.have.property('Notifications');
//           res.body.should.have.property('message');
//           res.body.message.trim().should.be
//             .eql('Specified user does not exist!');
//           done();
//         });
//       });
//     });
//
//     it('should return an error if the user is not a member of the group',
//       (done) => {
//         testRoute = `${authorisedRoute}/filter?groupId=${invalidGroupId}`;
//         agent.post('/api/users/signin').send(nonMemberLogin).then(() => {
//           agent.get(testRoute).send().end((err, res) => {
//             res.should.have.status(403);
//             res.body.should.be.a('object');
//             res.body.should.not.have.property('Notifications');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('You do not belong to this group!');
//             done();
//           });
//         });
//       });
//
//     it('should fetch all notifications meant for the user if validation passes',
//       (done) => {
//         testRoute = authorisedRoute;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.get(testRoute).send().end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('Notifications');
//             done();
//           });
//         });
//       });
//
//     it('should fetch notifications for the user from a specified group' +
//       ' if validation passes',
//       (done) => {
//         testRoute = `${authorisedRoute}/filter?groupId=${validGroupId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.get(testRoute).send().end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('Notifications');
//             done();
//           });
//         });
//       });
//   });
//
//   describe('/GET api/users/:userId/notifications/:notificationId', () => {
//     it('should return an error if supplied user ID does not exist', (done) => {
//       testRoute = `${authorisedRoute}/${validNotificationId}`;
//       agent.post('/api/users/signin').send(memberLogin).then(() => {
//         agent.get(testRoute).send().end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.should.not.have.property('Requested Notification');
//           res.body.should.have.property('message');
//           res.body.message.trim().should.be
//             .eql('Specified user does not exist!');
//           done();
//         });
//       });
//     });
//
//     it('should return an error if the user is not the original recipient',
//       (done) => {
//         testRoute = `${unauthorisedRoute}/${validNotificationId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.get(testRoute).send().end((err, res) => {
//             res.should.have.status(403);
//             res.body.should.be.a('object');
//             res.body.should.not.have.property('Requested Notification');
//             res.body.should.have.property('message');
//             res.body.notification.trim().should.be
//               .eql('You are not the recipient of this notification!');
//             done();
//           });
//         });
//       });
//
//     it('should return an error if the notification ID does not exist',
//       (done) => {
//         testRoute = `${authorisedRoute}/${invalidNotificationId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.get(testRoute).send().end((err, res) => {
//             res.should.have.status(404);
//             res.body.should.be.a('object');
//             res.body.should.not.have.property('Requested Notification');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Requested notification does not exist!');
//             done();
//           });
//         });
//       });
//
//     it('should fetch a specific notification if validation passes',
//       (done) => {
//         testRoute = `${authorisedRoute}/${validNotificationId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.get(testRoute).send().end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('Requested Notification');
//             done();
//           });
//         });
//       });
//   });
//
//   describe('/PATCH api/users/:userId/notifications/:notificationId', () => {
//     it('should return an error if supplied user ID does not exist', (done) => {
//       testRoute = `${authorisedRoute}/${validNotificationId}`;
//       agent.post('/api/users/signin').send(memberLogin).then(() => {
//         agent.patch(testRoute).send().end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.should.not.have.property('Updated Notification');
//           res.body.should.have.property('message');
//           res.body.message.trim().should.be
//             .eql('Specified user does not exist!');
//           done();
//         });
//       });
//     });
//
//     it('should return an error if the user is not the original recipient',
//       (done) => {
//         testRoute = `${unauthorisedRoute}/${validNotificationId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.patch(testRoute).send().end((err, res) => {
//             res.should.have.status(403);
//             res.body.should.be.a('object');
//             res.body.should.not.have.property('Updated Notification');
//             res.body.should.have.property('message');
//             res.body.notification.trim().should.be
//               .eql('You are not the recipient of this notification!');
//             done();
//           });
//         });
//       });
//
//     it('should return an error if the notification ID does not exist',
//       (done) => {
//         testRoute = `${authorisedRoute}/${invalidNotificationId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.patch(testRoute).send().end((err, res) => {
//             res.should.have.status(404);
//             res.body.should.be.a('object');
//             res.body.should.not.have.property('Updated Notification');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Specified notification does not exist!');
//             done();
//           });
//         });
//       });
//
//     it('should update a specific notification if validation passes',
//       (done) => {
//         testRoute = `${authorisedRoute}/${validNotificationId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.patch(testRoute).send().end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('Updated Notification');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Notification updated successfully!');
//             done();
//           });
//         });
//       });
//   });
//
//   describe('/DELETE api/users/:userId/notifications/:notificationId', () => {
//     it('should return an error if supplied user ID does not exist', (done) => {
//       testRoute = `${authorisedRoute}/${validNotificationId}`;
//       agent.post('/api/users/signin').send(memberLogin).then(() => {
//         agent.delete(testRoute).send().end((err, res) => {
//           res.should.have.status(404);
//           res.body.should.be.a('object');
//           res.body.should.have.property('message');
//           res.body.message.trim().should.be
//             .eql('Specified user does not exist!');
//           done();
//         });
//       });
//     });
//
//     it('should return an error if the user is not the original recipient',
//       (done) => {
//         testRoute = `${unauthorisedRoute}/${validNotificationId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.delete(testRoute).send().end((err, res) => {
//             res.should.have.status(403);
//             res.body.should.be.a('object');
//             res.body.should.have.property('message');
//             res.body.notification.trim().should.be
//               .eql('You are not the recipient of this notification!');
//             done();
//           });
//         });
//       });
//
//     it('should return an error if the notification ID does not exist',
//       (done) => {
//         testRoute = `${authorisedRoute}/${invalidNotificationId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.delete(testRoute).send().end((err, res) => {
//             res.should.have.status(404);
//             res.body.should.be.a('object');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Specified notification does not exist!');
//             done();
//           });
//         });
//       });
//
//     it('should delete a specific notification if validation passes',
//       (done) => {
//         testRoute = `${authorisedRoute}/${validNotificationId}`;
//         agent.post('/api/users/signin').send(memberLogin).then(() => {
//           agent.delete(testRoute).send().end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('message');
//             res.body.message.trim().should.be
//               .eql('Notification deleted successfully!');
//             done();
//           });
//         });
//       });
//   });
// });
