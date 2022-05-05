'use strict';
const { Model } = require('sequelize');

const PROTECTED_ATTRIBUTES = ['password'];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(User, {
        as: 'created',
        foreignKey: 'created_by',
      });

      this.belongsTo(User, {
        as: 'updated',
        foreignKey: 'updated_by',
      });

      this.hasMany(models.Task, {
        as: 'user_task',
        foreignKey: 'created_by',
      });
    }

    toJSON() {
      const attributes = { ...this.get() };

      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }

      return attributes;

      // return { ...this.get(), password: undefined };
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'First Name should not be null.' },
          notEmpty: { msg: 'First Name should not be empty.' },
        },
      },
      middle_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Last Name should not be null.' },
          notEmpty: { msg: 'Last Name should not be empty.' },
        },
      },
      full_name: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue(
            'full_name',
            this.first_name + ' ' + this.middle_name + ' ' + this.last_name
          );
        },
      },
      profile_pic: {
        type: DataTypes.STRING,
        get() {
          const rawValue = this.getDataValue('profile_pic');
          return rawValue ? 'http://localhost:3600/public/' + rawValue : null; // MALE
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Male', 'Female', 'Others']],
            msg: 'Gender should be male, female or others only.',
          },
        },
        get() {
          const rawValue = this.getDataValue('gender');
          return rawValue ? rawValue.toUpperCase() : null; // MALE
        },
      },
      civil_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: 'email',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Active',
      },
      created_by: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'id',
        },
      },
      updated_by: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: 'date_created',
      updatedAt: 'date_updated',
      modelName: 'User',
      indexes: [{ unique: true, fields: ['email'] }],
    }
  );
  return User;
};
