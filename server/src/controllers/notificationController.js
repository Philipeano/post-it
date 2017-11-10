// import db from '../models/index';
// import Validator from '../controllers/validator';
//
// let errorMessage;
//
// /**
//  * @description: Defines controller for manipulating 'notification' model
//  * @class
//  */
// class NotificationController {
//   /**
//    * @description: Initializes instance with necessary database models
//    * as a local properties
//    * @constructor
//    */
//   constructor() {
//     this.group = db.Group;
//     this.message = db.Message;
//     this.user = db.User;
//     this.membership = db.Membership;
//     this.notification = db.Notification;
//   }
//
//   /**
//    * @description: Creates a notification for each group member
//    * from newly-posted message
//    * @param {Object} req
//    * @param {Object} res
//    * @param {Object} postedMessage newly posted message for the group
//    * @return {Object} newNotification
//    */
//   createNotifications(req, res, postedMessage) {
//     errorMessage = '';
//     if (Validator.isEmpty('Group ID', req.params.groupId))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//     if (Validator.isEmpty('Message', postedMessage))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//
//     if (errorMessage.trim() !== '')
//       res.status(400).json({ message: errorMessage });
//     else {
//       this.membership.findAll({
//         where: {
//           groupId: req.params.groupId,
//           memberId: { $ne: req.session.user.id }
//         }
//       })
//         .then((memberships) => {
//           if (memberships) {
//             const notificationsList = [];
//             let notificationItem;
//             for (let i = 0; i < memberships.length; i += 1) {
//               notificationItem = {
//                 messageId: postedMessage.id,
//                 recipientId: memberships[i].memberId,
//                 notificationType: 'in-app',
//                 status: 'unread'
//               }
//               notificationsList.push(notificationItem);
//             }
//             this.notification.sync().then(() => {
//               this.notification
//                 .bulkCreate(notificationsList)
//                 .then(() => {
//                   res.status(201).json({
//                     message: 'Notifications created successfully!',
//                     'No. of Recipients': notificationsList.length
//                   });
//                 }).catch((err) => {
//                   res.status(500).json({ message: err.message });
//                 });
//             });
//           } else {
//             res.status(403)
//               .json({ message: 'Please add members to the group first!' });
//           }
//         }).catch((err) => {
//           res.status(500).json({ message: err.message });
//         });
//     }
//   }
//
//   /**
//    * @description: Fetches all notifications for a user
//    * @param {Object} req
//    * @param {Object} res
//    * @return {Object} messages
//    */
//   getNotifications(req, res) {
//     errorMessage = '';
//     if (Validator.isEmpty('Group ID', req.params.groupId))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//     if (errorMessage.trim() !== '')
//       res.status(400).json({ message: errorMessage });
//     else {
//       this.membership.findOne({
//         where: { groupId: req.params.groupId,
//           memberId: req.session.user.id } })
//         .then((membership) => {
//           if (membership) {
//             this.message
//               .findAll({ where: { groupId: req.params.groupId } })
//               .then((messages) => {
//                 res.status(200).json({ Messages: messages });
//               }).catch((err) => {
//               res.status(500).json({ message: err.message });
//             });
//           } else {
//             res.status(403)
//               .json({ message: 'You do not belong to this group!' });
//           }
//         }).catch((err) => {
//         res.status(500).json({ message: err.message });
//       });
//     }
//   }
//
//   /**
//    * @description: Updates a specified message previously sent to a group
//    * @param {Object} req
//    * @param {Object} res
//    * @return {Object} null
//    */
//   updateNotification(req, res) {
//     errorMessage = '';
//     if (Validator.isEmpty('Group ID', req.params.groupId))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//     if (Validator.isEmpty('Message ID', req.params.messageId))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//     if (Validator.isEmpty('Content', req.body.content))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//
//     if (errorMessage.trim() !== '')
//       res.status(400).json({ message: errorMessage });
//     else {
//       this.membership.findOne({
//         where: { groupId: req.params.groupId,
//           memberId: req.session.user.id } })
//         .then((membership) => {
//           if (membership) {
//             this.message
//               .findOne({ where: { groupId: req.params.groupId,
//                 id: req.params.messageId,
//                 senderId: req.session.user.id } })
//               .then((message) => {
//                 if (message) {
//                   this.message
//                     .update({ content: req.body.content },
//                       { where: { id: req.params.messageId },
//                         returning: true,
//                         plain: true
//                       })
//                     .then((result) => {
//                       res.status(200)
//                         .json({
//                           message: 'Message updated successfully!',
//                           'Updated Message': result[1]
//                         });
//                     });
//                 } else {
//                   res.status(403)
//                     .json({ message:
//                       'You are not the sender of this message!' });
//                 }
//               }).catch((err) => {
//               res.status(500).json({ message: err.message });
//             });
//           } else {
//             res.status(403)
//               .json({ message: 'You do not belong to this group!' });
//           }
//         }).catch((err) => {
//         res.status(500).json({ message: err.message });
//       });
//     }
//   }
//
//   /**
//    * @description: Deletes a specified message from a group
//    * @param {Object} req
//    * @param {Object} res
//    * @return {Object} null
//    */
//   deleteNotification(req, res) {
//     errorMessage = '';
//     if (Validator.isEmpty('Group ID', req.params.groupId))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//     if (Validator.isEmpty('Message ID', req.params.messageId))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//
//     if (errorMessage.trim() !== '')
//       res.status(400).json({ message: errorMessage });
//     else {
//       this.membership.findOne({
//         where: { groupId: req.params.groupId,
//           memberId: req.session.user.id } })
//         .then((membership) => {
//           if (membership) {
//             this.message
//               .findAll({ where: { groupId: req.params.groupId,
//                 id: req.params.messageId,
//                 senderId: req.session.user.id } })
//               .then((messages) => {
//                 if (messages) {
//                   this.message
//                     .destroy({ where: { id: req.params.messageId } })
//                     .then(() => {
//                       res.status(200)
//                         .json({ message: 'Message deleted successfully!' });
//                     });
//                 } else {
//                   res.status(403)
//                     .json({ message:
//                       'You are not the sender of this message!' });
//                 }
//               }).catch((err) => {
//               res.status(500).json({ message: err.message });
//             });
//           } else {
//             res.status(403)
//               .json({ message: 'You do not belong to this group!' });
//           }
//         }).catch((err) => {
//         res.status(500).json({ message: err.message });
//       });
//     }
//   }
//
// }
//
// export default NotificationController;
