const jwt = require('jsonwebtoken');
const User = require('../models').User;
// const accesses = require('../config/access');
const constans = require('../config/constants');

module.exports = class AuthController {

    constructor(){
        console.log('inside AuthController controller constructor');
    }

    signUp(req, res, next) {

        User.create(
            req.body
        )
        .then(function (result) {
            if (result) {

                let userData = {
                    "id": result.id,
                    "first_name": result.first_name,
                    "last_name": result.last_name,
                    "email": result.email,
                    "dob": result.dob,
                    "role": result.role,
                    "status": result.status,
                    "deletedAt": result.deletedAt,
                    "createdAt": result.createdAt,
                    "updatedAt": result.updatedAt
                };
                jwt.sign({userData}, constans.JWT_SECRET, { expiresIn: 60 * 60 }, (err, token) => {
                    res.status(200).send({ err: [], token: 'bearer '+ token, user: userData });
                });
            } else {
                response.status(400).send('Error in insert new record');
            }
        })
        .catch((error) => {
    
            res.status(200).send({ err: error });
        });
    }

    signIn( req, res, next ) {

        var email = req.body.email;
    
        User.findOne({ where: { email: email } })
            .then((result) => {
    
                if (result === null) {
    
                    res.status(200).send({ err: ["Record not found!"] });
                } else {
    
                    let userData = {
                        "id": result.id,
                        "first_name": result.first_name,
                        "last_name": result.last_name,
                        "email": result.email,
                        "dob": result.dob,
                        "role": result.role,
                        "status": result.status,
                        "deletedAt": result.deletedAt,
                        "createdAt": result.createdAt,
                        "updatedAt": result.updatedAt
                    };
    
                    jwt.sign({userData}, constans.JWT_SECRET, { expiresIn: 60 * 60 }, (err, token) => {
                        res.status(200).send({ err: [], token: 'bearer '+ token, user: userData });
                    });
                }
            })
            .catch((error) => {
    
                res.status(200).send({ err: error });
            });
    }

    signOut(req, res, next) {}
    
    verifyToken(req, res, next) {
        //Request header with authorization key
        const bearerHeader = req.headers['authorization'];
        
        //Check if there is  a header
        if(typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');

            //Get Token arrray by spliting
            const bearerToken = bearer[1];
            req.token = bearerToken;
    
            jwt.verify(req.token, constans.JWT_SECRET, (err, authData)=>{
    
                if(err){
                    res.status(403).send({ err: err });
                }else{
                    
                    req.authData = authData;
                    //call next middleware
                    next();
                }
            });
        }else{
            res.status(403).send({ err: 'Header is not defined.' });            
        }
    }

    /*
    verifyAccess( req, res, next ) {

        let full_path = req.baseUrl + req.route.path;
        // let roleId = req.authData.roleId;
        let roleId = 2;

        if( accesses.hasOwnProperty( full_path ) ) {

            let authorisedRoles = accesses[full_path];
            if ( authorisedRoles.indexOf( roleId ) > -1 ) {
                //call next middleware
                next();
            } else {
                // Unauthorized Access
                res.status(403).send({ err: 'Unauthorized access.' });
            }
        } else {
            // Path is not declared in the /config/access.json
            res.status(403).send({ err: 'Path is not declared in the /config/access.json' });
        }
    }
    */
}