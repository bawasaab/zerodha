const { Op } = require("sequelize");
const User = require('../models/').User;
const moment = require('moment');

module.exports = class UserService {

    constructor() {
        console.log('inside user service');
    }

    async insertUser( in_data ) {

        try {

            let result = await User.build( in_data );
            return result;
        } catch( ex ) {
            throw ex;
        }
    }

    updateUser() {}

    getUserById() {}

    getUserAll() {}

    getUserAll() {}

    isUserEmailExists() {}
}