const { Op } = require("sequelize");
const UserSubscription = require('../models').UserSubscription;

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

    async getUserWatchList() {
        try {
            console.log('inside getUserWatchList');
            const result = await UserSubscription.findAll();
            console.log('result', result);
            return result;
        } catch( ex ) {
            throw ex;
        }
    }
}   