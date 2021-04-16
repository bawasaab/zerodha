var KiteConnect = require("kiteconnect").KiteConnect;
var KiteTicker = require("kiteconnect").KiteTicker;
const axios = require('axios');
const crypto = require('crypto');

const Zerodha = require('../libs/Zerodha');
const ZerodhaLibsObj = new Zerodha();

const ZerodhaService = require('../services/').ZerodhaService;
const ZerodhaServiceObj = new ZerodhaService();

let $this;

module.exports = class UsersController {

    constructor() {
        $this = this;
    }

    sendResponse( res, in_data ) {

        res.send({
            resCode : in_data.hasOwnProperty('resCode') ? in_data.code : 200,
            success : in_data.hasOwnProperty('success') ? in_data.success : true,
            msg : in_data.hasOwnProperty('msg') ? in_data.msg : 'unknown',
            data : in_data.hasOwnProperty('data') ? in_data.data : [],
        });
    }

    sendException( res, in_data ) {

        res.send({
            resCode : in_data.hasOwnProperty('resCode') ? in_data.code : 400,
            success : in_data.hasOwnProperty('success') ? in_data.success : false,
            msg : in_data.hasOwnProperty('msg') ? in_data.msg : 'unknown',
            data : in_data.hasOwnProperty('data') ? in_data.data : [],
        });
    }

    login( req, res, next ) {

        let loginUrl = ZerodhaLibsObj.kc.getLoginURL();
        // console.log('loginUrl', loginUrl);
        // $this.getLoginURL = this.kc.getLoginURL();
        res.render( 'login', {
            url : loginUrl
        } );
    }

    // get request token and generate access token
    loginCallBack( req, res, next ) {
        // request token received
        let request_token = req.query.request_token;

        console.log('ZerodhaLibsObj', ZerodhaLibsObj);

        ZerodhaLibsObj.kc.generateSession( request_token, ZerodhaLibsObj.api_secret_key )
        .then(function(response) {
            console.log("generateSession Response", response);
            // init();

            // $this.access_token = response.access_token;
            // console.log('$this.access_token', $this.access_token);
            // $this.public_token = response.public_token;
            // $this.user = response;
            // $this.kc.setAccessToken( $this.access_token );
            // $this.setAccessToken();
            // $this.getDetails();

            ZerodhaLibsObj.access_token = response.access_token;
            console.log('$this.access_token', ZerodhaLibsObj.access_token);
            ZerodhaLibsObj.public_token = response.public_token;
            ZerodhaLibsObj.user = response;
            ZerodhaLibsObj.kc.setAccessToken( response.access_token );
            ZerodhaLibsObj.setAccessToken();
            ZerodhaLibsObj.getDetails();

            return {
                request_token: request_token,
                access_token: ZerodhaLibsObj.access_token,
                public_token: ZerodhaLibsObj.public_token,
                user: ZerodhaLibsObj.user,
                setAccessToken: ZerodhaLibsObj.kc.setAccessToken( response.access_token ),
                setAccessToken: ZerodhaLibsObj.setAccessToken(),
                getDetails: ZerodhaLibsObj.getDetails()
            };
        })
        .then( async (result) => {

            let in_data = {
                request_token: result.request_token,
                access_token: result.access_token,
                public_token: result.public_token,
            };
            let out = await ZerodhaServiceObj.insertZerodhaTokens( in_data );
            let response = {
                'data': result
            };
            return $this.sendResponse( res, response );
        } )
        .catch(function(err) {
            console.log('generateSession err', err);
            return $this.sendException( res, {
                msg: err
            } );
        });
    }
}
