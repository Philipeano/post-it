// import express from 'express';
// import NotificationController from '../controllers/notificationController';
//
// const notificationRouter = express.Router({ mergeParams: true });
//
// /**
//  * @description: Defines router for handling all 'notification' requests
//  * @module
//  */
//
// const notificationController = new NotificationController();
// // baseURL /api/users/:userId/notifications
//
// // Create notifications from a new group message
// notificationRouter.post('/api/users/:userId/notifications', (req, res) => {
//   notificationController.createNotifications(req, res);
// });
//
// // Fetch all notifications for a user, from a particular group
// notificationRouter.get('/', (req, res) => {
//   notificationController.getNotificationsFromGroup(req, res);
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
// export default notificationRouter;
