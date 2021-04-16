'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserSubscription.init({
    user_id: DataTypes.STRING,
    instrument_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserSubscription',
  });
  return UserSubscription;
};