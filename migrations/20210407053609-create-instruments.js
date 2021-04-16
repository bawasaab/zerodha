'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Instruments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      instrument_token: {
        type: Sequelize.STRING
      },
      exchange_token: {
        type: Sequelize.STRING
      },
      tradingsymbol: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      last_price: {
        type: Sequelize.STRING
      },
      expiry: {
        type: Sequelize.STRING
      },
      strike: {
        type: Sequelize.STRING
      },
      tick_size: {
        type: Sequelize.STRING
      },
      lot_size: {
        type: Sequelize.STRING
      },
      instrument_type: {
        type: Sequelize.STRING
      },
      segment: {
        type: Sequelize.STRING
      },
      exchange: {
        type: Sequelize.STRING
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Instruments');
  }
};