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
//
// // // Create notifications from a new group message
// // notificationRouter.post('/', (req, res) => {
// //   notificationController.createNotifications(req, res);
// // });
//
// // Fetch all notifications for a user
// notificationRouter.get('/', (req, res) => {
//   notificationController.getAllNotifications(req, res);
// });
//
// // Fetch all notifications for a user from a specified group
// notificationRouter.get('/filter?groupId=groupIdValue', (req, res) => {
//   notificationController.getAllNotifications(req, res);
// });
//
// // Fetch a specific notification for a user
// notificationRouter.get('/:notificationId', (req, res) => {
//   notificationController.getNotificationByKey(req, res);
// });
//
// // Update a specific notification
// notificationRouter.patch('/:notificationId', (req, res) => {
//   notificationController.updateNotification(req, res);
// });
//
// // Delete a specific notification
// notificationRouter.delete('/:notificationId', (req, res) => {
//   notificationController.deleteNotification(req, res);
// });
//
// export default notificationRouter;
"use strict";