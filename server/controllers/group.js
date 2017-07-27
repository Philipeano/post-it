import db from '../models/index';
import group from '../models/group';

const sequelize = db.sequelize;

/**
 * @description: Defines controller for manipulating 'group' model
 * @class
 */
class Group {
  /**
   * @description: Initializes instance with 'group' model as local property
   * @constructor
   */
  constructor() {
    this.group = group(sequelize);
  }

  /**
   * @description: creates a new group
   * @param {String} value1
   * @param {String} value2
   * @param {String} value3
   * @param {Function} done
   * @return {Object} newGroup
   */
  createGroup(value1, value2, value3, done) {
    return this.group.sync().then(() => {
      this.group.create({
        value1,
        value2,
        value3,
      }).then((newGroup) => {
        done(newGroup);
      }).catch((err) => {
        throw new Error(err);
      });
    });
  }

  /**
   * @description: fetches all available groups
   * @param {Function} done
   * @return {Object} allGroups
   */
  getAllGroups(done) {
    this.group.findAll().then((allGroups) => {
      done(allGroups);
    });
  }

  /**
   * @description: fetches all groups matching specified groupKey
   * @param {String} groupKey
   * @param {Function} done
   * @return {Object} matchingGroups
   */
  getGroupByKey(groupKey, done) {
    this.group.findAll({ where: { groupId: groupKey } })
      .then((matchingGroups) => {
        done(matchingGroups);
      });
  }

  /**
   * @description: deletes a group matching specified groupKey
   * @param {String} groupKey
   * @return {Object} deletedGroup
   */
  deleteGroup(groupKey) {
    this.group.destroy({ where: { groupId: groupKey } });
  }
}

export default Group;
