const jwt = require('jsonwebtoken');
const User = require('../models').User;
// const accesses = require('../config/access');
const constans = require('../config/constants');
let Validator = require('validatorjs');

let UserService = require('../services/UserService');
let UserServiceObj = new UserService();

let ResponseService = require('../services/ResponseService');
let ResponseServiceObj = new ResponseService();

let $this = '';

module.exports = class AuthController {

    constructor(){
        console.log('inside AuthController controller constructor');
        $this = this;
    }

    getFirstError( validation ) {
        let errors = validation.errors.all();
        let firstErr = '';
        for ( const property in errors ) {
            firstErr = errors[property];
            break;
        }
        return firstErr[0];
    }

    signUp(req, res, next) {

        try {

            let in_data = req.body;
            let rules = {
                first_name: 'required',
                last_name: 'required',
                email: 'required|email',
                password: 'required|min:6',
                role: 'required|in:ADVISOR,INVESTOR'
            };
            let validation = new Validator(in_data, rules);
            if( validation.fails() ) {

                return ResponseServiceObj.sendException( res, {
                    msg : $this.getFirstError( validation )
                } );
            }

            UserServiceObj.insertUser( in_data )
            .then( (result) => {

                let userData = {
                    "id": result.id,
                    "first_name": result.first_name,
                    "last_name": result.last_name,
                    "email": result.email,
                    "password": result.password,
                    "role": result.role,
                    "status": result.status,
                    "createdAt": result.createdAt,
                    "updatedAt": result.updatedAt
                };
                jwt.sign({userData}, constans.JWT_SECRET, { expiresIn: 60 * 60 }, async (err, token) => {
                    return ResponseServiceObj.sendResponse( res, {
                        msg : 'Record inserted successfully',
                        data : {
                            token: token,
                            user: userData
                        },
                        cnt: 1
                    } );
                });                
            } )
            .catch( (ex) => {
                return ResponseServiceObj.sendException( res, {
                    msg : ex.toString()
                } );
            } );
            
        } catch( ex ) {

            return ResponseServiceObj.sendException( res, {
                msg : ex.toString()
            } );
        }
    }

    signIn( req, res, next ) {

        try {

            let in_data = req.body;
            var email = req.body.email;
            var password = req.body.password;

            let rules = {
                email: 'required|email',
                password: 'required|min:6'
            };
            let validation = new Validator(in_data, rules);
            if( validation.fails() ) {

                return ResponseServiceObj.sendException( res, {
                    msg : $this.getFirstError( validation )
                } );
            }
    
            User.findOne({ where: { email: email } })
            .then((result) => {
    
                if (result === null) {
    
                    res.status(200).send({ err: ["Record not found!"] });
                } else {
                    
                    if( password !== result.password ) {

                        return ResponseServiceObj.sendException( res, {
                            msg : 'Invalid Password'
                        } ); 
                    }
                    let userData = {
                        "id": result.id,
                        "first_name": result.first_name,
                        "last_name": result.last_name,
                        "email": result.email,
                        "password": result.password,
                        "role": result.role,
                        "status": result.status,
                        "createdAt": result.createdAt,
                        "updatedAt": result.updatedAt
                    };
    
                    jwt.sign({userData}, constans.JWT_SECRET, { expiresIn: 60 * 60 }, (err, token) => {
                        return ResponseServiceObj.sendResponse( res, {
                            msg : 'Login successfully',
                            data : {
                                token: token,
                                user: userData
                            },
                            cnt: 1
                        } );
                    });
                }
            })
            .catch( (error) => {
    
                return ResponseServiceObj.sendException( res, {
                    msg : error.toString()
                } ); 
            });
        } catch( ex ) {

            return ResponseServiceObj.sendException( res, {
                msg : ex.toString()
            } ); 
        }
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

    tokenDecode( req, res, next ) {

        try {

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
                        // res.status(403).send({ err: err });
                        return res.send({
                            status: 403,
                            code: 403,
                            msg: err.toString(),
                            result: []
                        });
                    }else{
                        
                        req.authData = authData;
                        return res.send({
                            status: 200,
                            code: 200,
                            msg: 'Token decoded successfully.',
                            result: authData
                        });
                    }
                });
            }else{
                // res.status(403).send({ err: 'Header is not defined.' });            
                return res.send({
                    status: 403,
                    code: 403,
                    msg: 'Header is not defined.',
                    result: []
                });
            }
        } catch( ex ) {

            res.send({
                status: 403,
                code: 403,
                msg: ex.toString(),
                result: []
            });
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