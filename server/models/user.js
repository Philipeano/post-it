import bcrypt from 'bcrypt';

// module.exports = (sequelize, DataTypes) => {
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    // picture: {
    //   type: DataTypes.BINARY,
    //   allowNull: true
    // }
    /*
    id: {
     type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
       primaryKey: true
        },
    dateRegistered: {
     type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
      },
    */
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Group, {
          foreignKey: 'creatorId',
          as: 'ownGroups',
        });

        User.hasMany(models.GroupMember, {
          foreignKey: 'memberId',
          as: 'memberships',
        });

        User.hasMany(models.Message, {
          foreignKey: 'senderId',
          as: 'sentMessages',
        });

        User.hasMany(models.Notification, {
          foreignKey: 'recipientId',
          as: 'notifications',
        });
      },
      generateHash: (plainText) => {
        // Create hash from new password
        bcrypt.hash(plainText, 10, (err, hash) => {
          // Store hashed password in database
          this.password = hash;
        });
      },
      verifyPassword: (plainText) => {
        // Load password hash from database
        const hash = this.password;
        bcrypt.compare(plainText, hash, (err, res) => {
          // Return comparison result
          return res;
        });
      },
    },
  });
  return User;
};
