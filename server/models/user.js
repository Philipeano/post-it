// import bcrypt from 'bcrypt';
import DataTypes from 'sequelize/lib/data-types';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
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
  });

  User.associate = (models) => {
    User.hasMany(models.Group, {
      foreignKey: 'creatorId',
      as: 'creator',
    });

    User.hasMany(models.Message, {
      foreignKey: 'senderId',
      as: 'sender',
    });

    User.hasMany(models.Notification, {
      foreignKey: 'recipientId',
      as: 'recipient',
    });

    User.belongsToMany(models.Group, {
      through: models.Membership,
      foreignKey: 'groupId',
    });
  };
  /*
  generateHash: (plainText) => {
    // Create hash from new password
    bcrypt.hash(plainText, 10, (err, hash) => {
      // Store hashed password in database
      this.password = hash;
    });
  },
  verifyPassword: (plainText, hashFromDB) => {
    bcrypt.compare(plainText, hashFromDB, (err, res) => {
      // Return comparison result
      return res;
    });
  },
  */
  return User;
};
