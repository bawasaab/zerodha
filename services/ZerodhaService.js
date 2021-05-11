const { Op, Sequelize } = require("sequelize");
const Instruments = require('../models/').Instruments;
const Zerodha_token = require('../models/').Zerodha_token;
const moment = require('moment');

module.exports = class ZerodhaService {

    constructor() {}

    async searchInstrumentsBckup( in_str ) {

        try {
            let result;
            if( in_str ) {

                result = await Instruments.findAll({
                    attributes: [
                        // [Sequelize.fn('DISTINCT', Sequelize.col('tradingsymbol')), 'tradingsymbol'],
                        'id', 'instrument_token', 'exchange_token', 'tradingsymbol', 'name', 'last_price', 'expiry', 'strike', 'tick_size', 'lot_size', 'instrument_type', 'segment', 'exchange', 'createdAt', 'updatedAt', 'deletedAt'
                    ],
                    $where: {

                        $or: [
                            {
                                name: {
                                    // [Op.like]: `%${in_str}%`
                                    [Op.like]: `${in_str}%`
                                },
                                // tradingsymbol: {
                                //     [Op.like]: `${in_str}%`
                                // }
                            }
                        ],
                    },
                    offset: 0, 
                    limit: 10000,
                    order: [
                        ['name', 'ASC']
                    ],
                    raw: true 
                });
            } else {

                result = await Instruments.findAll({
                    attributes: ['id', 'instrument_token', 'exchange_token', 'tradingsymbol', 'name', 'last_price', 'expiry', 'strike', 'tick_size', 'lot_size', 'instrument_type', 'segment', 'exchange', 'createdAt', 'updatedAt', 'deletedAt'],
                    $where: {

                        $or: [
                            {
                                name: {
                                    // [Op.like]: `%${in_str}%`
                                    [Op.like]: `${in_str}%`
                                },
                                // tradingsymbol: {
                                //     [Op.like]: `${in_str}%`
                                // }
                            }
                        ],
                    },
                    offset: 0, 
                    limit: 10,
                    order: [
                        ['tradingsymbol', 'ASC']
                    ],
                    raw: true 
                });
            }
            return result;
        } catch( ex ) {
            throw ex;
        }
    }

    async searchInstruments( in_str ) {

        try {
            let result;
            if( in_str ) {
                console.log('inside if');
                result = await Instruments.findAll({
                    attributes: [
                        // [Sequelize.fn('DISTINCT', Sequelize.col('tradingsymbol')), 'tradingsymbol'],
                        'id', 'instrument_token', 'exchange_token', 'tradingsymbol', 'name', 'last_price', 'expiry', 'strike', 'tick_size', 'lot_size', 'instrument_type', 'segment', 'exchange', 'createdAt', 'updatedAt', 'deletedAt'
                    ],
                    where: {
                        [Op.or]: {
                            name: {
                                [Op.like]: `${in_str}%`,
                            },
                            tradingsymbol: {
                                [Op.like]: `${in_str}%`,
                            },
                        }
                    },
                    offset: 0, 
                    limit: 10000,
                    order: [
                        ['name', 'ASC']
                    ],
                    raw: true 
                });
            } else {
                console.log('inside else');
                result = await Instruments.findAll({
                    attributes: ['id', 'instrument_token', 'exchange_token', 'tradingsymbol', 'name', 'last_price', 'expiry', 'strike', 'tick_size', 'lot_size', 'instrument_type', 'segment', 'exchange', 'createdAt', 'updatedAt', 'deletedAt'],
                    where: {
                        [Op.or]: {
                            name: {
                                [Op.like]: `${in_str}%`,
                            },
                            tradingsymbol: {
                                [Op.like]: `${in_str}%`,
                            },
                        }
                    },
                    offset: 0, 
                    limit: 10,
                    order: [
                        ['name', 'ASC']
                    ],
                    raw: true 
                });
            }
            return result;
        } catch( ex ) {
            throw ex;
        }
    }

    async insertZerodhaTokens( in_data ) {

        try {

            let truncate = await Zerodha_token.destroy({ truncate : true, cascade: false });
            console.log('truncate', truncate);
            let result = await Zerodha_token.create( in_data );
            return result;
        } catch( ex ) {
            throw ex;
        }
    }

    async getZerodhaToken( in_data ) {

        try {

            let today = moment().format('YYYY-MM-DD');
            const result = await Zerodha_token.findOne({ 
                where: { 
                    createdAt: {
                        [Op.gte]: today,
                    }
                }
            });
            return result;
        } catch( ex ) {
            throw ex;
        }
    }
}