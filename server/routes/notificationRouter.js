// import express from 'express';
// import NotificationController from '../controllers/notificationController';
//
// const notificationRouter = express.Router({ mergeParams: true });
//
// /**
//  * @description: Defines router for handling all 'notifications' requests
//  * @module
//  */
//
// const notificationController = new NotificationController();
// // baseURL /api/groups/:groupId/messages/:messageId/notifications
//
// // Create notifications from a new group message
// notificationRouter.post('/', (req, res) => {
//   notificationController.createNotification(req, res);
// });
//
// // Fetch all notifications for a user, from a particular group
// notificationRouter.get('/', (req, res) => {
//   notificationController.getMessagesFromGroup(req, res);
// });
//
// // Fetch all notifications created for a particular message
// notificationRouter.get('/', (req, res) => {
//   notificationController.getMessagesFromGroup(req, res);
// });
//
// // Update a specific notification
// notificationRouter.patch('/:messageId', (req, res) => {
//   notificationController.updateNotification(req, res);
// });
//
// // Delete a specific notification
// notificationRouter.delete('/:messageId', (req, res) => {
//   notificationController.deleteNotification(req, res);
// });
//
// // module.exports = NotificationRouter;
// export default notificationRouter;
