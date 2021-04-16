'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Zerodha_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Zerodha_token.init({
    request_token: DataTypes.STRING,
    access_token: DataTypes.STRING,
    public_token: DataTypes.STRING,
    public_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Zerodha_token',
  });
  return Zerodha_token;
};