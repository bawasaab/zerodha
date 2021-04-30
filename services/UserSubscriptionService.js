const { Op } = require("sequelize");
const UserSubscription = require('../models').UserSubscription;
const Instruments = require('../models').Instruments;

module.exports = class UserSubscriptionService {

    constructor() {}

    async isInstrumentAlreadyExistsInWatchList( in_data ) {

        try {

            const result = await UserSubscription.count({
                where: {
                    [Op.and]: [
                        { user_id: in_data.user_id },
                        { instrument_token: in_data.instrument_token }
                    ]
                }
            });
            return result > 0 ? true : false;
        } catch( ex ) {
            throw ex;
        }
    }

    async addToWatchList( in_data ) {

        try {

            const result = await UserSubscription.create(in_data);
            return result;
        } catch( ex ) {
            throw ex;
        }
    }

    async getUserWatchList( user_id ) {
        try {
            const result = await UserSubscription.findAll( { where: { user_id: user_id } } );
            console.log('result', result);
            return result;
        } catch( ex ) {
            throw ex;
        }
    }

    async getInstrumentsByInstrumentTokens( instrument_tokens ) {

        try {

            const result = await Instruments.findAll({
                where: {
                instrument_token: {
                    [Op.in]: instrument_tokens
                  }
                }
            });
            return result;
        } catch( ex ) {
            throw ex;
        }
    }
}