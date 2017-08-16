// import db from '../models/index';
// import group from '../models/group';
// import groupMember from '../models/groupmember';
// import Validator from '../controllers/validator';
//
// const sequelize = db.sequelize;
// let errorMessage;
// let groupModelInstance;
// let membershipModelInstance;
//
// /**
//  * @description: Defines controller for manipulating 'group' model
//  * @class
//  */
// class GroupController {
//   /**
//    * @description: Initializes instance with 'group' and 'groupMember' models
//    * as local properties
//    * @constructor
//    */
//   constructor() {
//     this.group = group(sequelize);
//     this.membership = groupMember(sequelize);
//     groupModelInstance = this.group;
//     membershipModelInstance = this.membership;
//   }
//
//   /**
//    * @description: Creates a new group and adds creator as member
//    * @param {Object} req
//    * @param {Object} res
//    * @return {Object} newGroup
//    */
//   createGroup(req, res) {
//     errorMessage = '';
//     if (Validator.isEmpty('Title', req.body.title))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//     if (Validator.isEmpty('Purpose', req.body.purpose))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//
//     if (errorMessage.trim() !== '')
//       res.status(400).json({ message: errorMessage });
//     else {
//       groupModelInstance.findOne({ where: { title: req.body.title } })
//         .then((matchingGroup) => {
//           if (matchingGroup)
//             res.status(409).json({ message: 'Group Title is already taken!' });
//           else {
//             console.log(`Current user: ${req.session.user.id}`);
//             groupModelInstance.sync().then(() => {
//               groupModelInstance.create({
//                 title: req.body.title,
//                 purpose: req.body.purpose,
//                 creatorId: req.session.user.id
//               }).then((newGroup) => {
//
//                 console.log(Object.keys(groupModelInstance.rawAttributes));
//                 console.log(Object.keys(newGroup.rawAttributes));
//
//                 membershipModelInstance.create({
//                   userRole: 'admin',
//                   groupId: newGroup.id,
//                   memberId: req.session.user.id
//                 }).then((newMembership) => {
//                   // newGroup.setMember(newMembership).then(() => {
//                   res.status(201).json({
//                     message: 'Group created successfully!',
//                     group: newGroup
//                   });
//                   // });
//                 });
//
//           // groupModelInstance.create({
//           //   title: req.body.title,
//           //   purpose: req.body.purpose,
//           // }).then((newGroup) => {
//           //   newGroup.prototype.setCreator(req.session.user.id).then(() => {
//           //     newGroup.prototype.addMember(req.session.user.id).then(() => {
//           //       res.status(201).json({
//           //         message: 'Group created successfully!',
//           //         group: newGroup
//           //       });
//           //     });
//           //   });
//
//           // newGroup.setUser(req.session.user);
//           // const createdGroup = newGroup;
//           // membershipModelInstance.sync().then(() => {
//           //   membershipModelInstance.create({
//           //     userRole: 'admin'
//           //     // group: createdGroup,
//           //     // groupId: createdGroup.id,
//           //     // member: req.session.user,
//           //     // memberId: req.session.user.id,
//           //   }).then((newMembership) => {
//           //     // newMembership.setGroup(newGroup);
//           //     // newMembership.setMember(req.session.user);
//           //     // console.log(`Current User: ${req.session.user},
//           //     //  \nNew Group: ${createdGroup.toJSON()},
//           //     //  \nMembership: ${newMembership.toJSON()}`);
//           //     res.status(201).json({
//           //       message: 'Group created successfully!',
//           //       group: createdGroup
//           //     });
//           //   }).catch((err) => {
//           //     res.status(500).json({ message: err.message });
//           //   });
//           // });
//               }).catch((err) => {
//                 res.status(500).json({ message: err.message });
//               });
//             });
//           }
//         });
//     }
//   }
//
//   /**
//    * @description: Fetches all available groups
//    * @param {Object} req
//    * @param {Object} res
//    * @return {Object} allGroups
//    */
//   getAllGroups(req, res) {
//     groupModelInstance.findAll().then((allGroups) => {
//       res.status(200).json({ 'Available groups': allGroups });
//     }).catch((err) => {
//       res.status(500).json({ message: err.message });
//     });
//   }
//
//   /**
//    * @description: Fetches a group matching specified groupKey
//    * @param {Object} req
//    * @param {Object} res
//    * @return {Object} matchingGroup
//    */
//   getGroupByKey(req, res) {
//     errorMessage = '';
//     if (Validator.isEmpty('Group ID', req.params.groupId))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//     if (errorMessage.trim() !== '')
//       res.status(400).json({ message: errorMessage });
//     else {
//       groupModelInstance.findOne({ where: { id: req.params.groupId } })
//         .then((matchingGroup) => {
//           if (matchingGroup) {
//             res.status(200).json({ 'Specified group': matchingGroup });
//           } else {
//             res.status(404).json({ message: 'Specified group does not exist' });
//           }
//         }).catch((err) => {
//           res.status(500).json({ message: err.message });
//         });
//     }
//   }
//
//   /**
//    * @description: Deletes a group matching specified groupKey
//    * @param {Object} req
//    * @param {Object} res
//    * @return {Object} null
//    */
//   deleteGroup(req, res) {
//     errorMessage = '';
//     if (Validator.isEmpty('Group ID', req.params.groupId))
//       errorMessage = `${errorMessage} ${Validator.validationMessage}`;
//     if (errorMessage.trim() !== '')
//       res.status(400).json({ message: errorMessage });
//     else {
//       groupModelInstance.findOne({ where: { id: req.params.groupId } })
//         .then((matchingGroup) => {
//           if (matchingGroup) {
//             groupModelInstance.destroy({ where: { id: req.params.groupId } })
//               .then(() => {
//                 res.status(200)
//                   .json({ message: 'Group deleted successfully!' });
//               }).catch((err) => {
//                 res.status(500).json({ message: err.message });
//               });
//           } else {
//             res.status(404).json({ message: 'Specified group does not exist' });
//           }
//         }).catch((err) => {
//           res.status(500).json({ message: err.message });
//         });
//     }
//   }
//
// }
//
// export default GroupController;
