var User = require('../models').User;
const Op = require('sequelize').Op;

module.exports = class UsersService {

    constructor() {
        console.log('inside UsersService');
    }

    async insertUser( in_data ) {

        try {

            let result = await User.build(in_data).save();
            if (result === null) {
                throw 'Record not found';
            } else {
                return result;
            }
        } catch( ex ) {
            throw ex;
        }
    }

    async updateUser( id, in_data ) {

        try {

            let result = await User.update(in_data, { where: { id: id } });
            if (result === null) {
    
                throw 'Record not updated';
            } else {

                return result;
            }
        } catch( ex ) {
            throw ex;
        }
    }

    async getAllUser() {

        try {

            let result = await User.findAll({ 
                where: { 
                    status: { 
                        [Op.ne]: 'DELETED' 
                    } 
                } 
            });            
            if (result === null) {
                throw 'Records not found';
            } else {
                return result;
            }
        } catch( ex ) {
            throw ex;
        }
    }

    async getAllUserCnt() {

        try {

            let result = await User.count({ 
                where: { 
                    status: { 
                        [Op.ne]: 'DELETED' 
                    } 
                } 
            });            
            if (result === null) {
                throw 'Records not found';
            } else {
                return result;
            }
        } catch( ex ) {
            throw ex;
        }
    }

    async getUserById( id ) {

        try {

            let result = await User.findOne(
                { 
                    where: { 
                        id: id,
                        status: { 
                            [Op.ne]: 'DELETED' 
                        } 
                    } 
                }
            );
            if (result === null) {
                throw 'Record not found';
            } else {
                return result;
            }
        } catch( ex ) {
            throw ex;
        }
    }

    async deleteUserSoftlyById( id ) {

        try {

            let dated = new Date();
            let in_data = {
                status : 'DELETED',
                deletedAt: dated
            };

            let result = await User.update(in_data, { where: { id: id } });
            if (result === null) {
                throw 'Unable to delete record';
            } else {
                return 'Record deleted successfully';
            }
        } catch( ex ) {
            throw ex;
        }
    }

    async deleteUserHardlyById( id ) {

        try {

            let result = await User.destroy({ where: { id: id } });
            if (result === null) {    
                throw 'Unable to deleted record.';
            } else {
                return result;
            }
        } catch( ex ) {
            throw ex;
        }
    }
}