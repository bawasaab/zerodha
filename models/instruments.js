'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instruments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Instruments.init({
    instrument_token: DataTypes.STRING,
    exchange_token: DataTypes.STRING,
    tradingsymbol: DataTypes.STRING,
    name: DataTypes.STRING,
    strike: DataTypes.FLOAT,
    tick_size: DataTypes.FLOAT,
    lot_size: DataTypes.INTEGER,
    instrument_type: DataTypes.STRING,
    segment: DataTypes.STRING,
    last_price: DataTypes.FLOAT,
    exchange: DataTypes.STRING,
    expiry: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Instruments',
  });
  return Instruments;
};