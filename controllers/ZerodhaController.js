var KiteConnect = require("kiteconnect").KiteConnect;
var KiteTicker = require("kiteconnect").KiteTicker;
const axios = require('axios');
const crypto = require('crypto');
const Zerodha = require('../libs/Zerodha');
const ZerodhaObj = new Zerodha();

const Instruments = require('../models/').Instruments;
// console.log('Instruments', Instruments);
const ZerodhaService = require('../services/').ZerodhaService;
const ZerodhaServiceObj = new ZerodhaService();

const UserSubscriptionService = require('../services/').UserSubscriptionService;
const UserSubscriptionServiceObj = new UserSubscriptionService();

const SocketLib = require('../libs').SocketLib;
const SocketLibObj = new SocketLib;

let $this;

module.exports = class ZerodhaController {

    constructor() {
        console.log('inside ZerodhaController');
        $this = this;
        $this.init_KiteTicker();
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
    
    async getInstrumentsFromCloud( req, res, next ) {

        try {

            let out = [];
            let data = await ZerodhaObj.kc.getInstruments()
            .then(function(response) {
                // console.log('response', response);
                return response;
            });

            let responded = await Instruments.bulkCreate(data).catch( (ex) => {
                console.log('catch 1');
                console.log('error', ex.toString());

                return res.send({
                    status: 400,
                    code: 400,
                    msg: 'Exception occur',
                    data: ex.toString()
                });
            } );
           /*******************************************************************************/
           /* error SequelizeDatabaseError: read ECONNRESET */
           /*******************************************************************************/

           /*
            // let in_data = data[0];
            data.forEach( async (element) => {

                let responded = await Instruments.build(element).save()
                .then( (result) => {
                    if (result === null) {
        
                        // return res.send({
                        //     status: 200,
                        //     code: 404,
                        //     msg: 'Record not inserted',
                        //     data: result
                        // });
                        return result;
                    } else {
        
                        // return res.send({
                        //     status: 200,
                        //     code: 200,
                        //     msg: 'Record inserted successfully',
                        //     data: result
                        // });

                        return result;
                    }
                } )
                .catch((error) => {
                    console.log('catch 1');
                    console.log('error', error.toString());
                    return error.toString();
                });

                out.push(responded);

                return res.send({
                    status: 200,
                    code: 200,
                    msg: 'Record inserted successfully',
                    data: out,
                    cnt: out.length
                });
            });
            */

        } catch( ex ) {

            console.log('catch 2');
            console.log('error', ex.toString());

            return res.send({
                status: 400,
                code: 400,
                msg: 'Exception occur',
                data: ex.toString()
            });
        }        
    }

    searchInstruments( req, res, next ) {

        try {
            
            let srch_str = req.query.str;
            ZerodhaServiceObj.searchInstruments( srch_str )
            .then( async( result ) => {

                if( result.length > 0 ) {

                    return await $this.sendResponse( res, {
                        msg : 'Record Found',
                        data : result
                    });
                } else {
                    return await $this.sendException( res, {
                        msg : 'Record not found.'
                    });
                }
            })
            .catch( async (ex) => {

                return await $this.sendException( res, {
                    msg : ex.toString()
                });
            } );
        } catch( ex ) {
        
            $this.sendException( res, {
                msg : ex.toString()
            });
        }
    }

    addToWatchList( req, res, next ) {

        try {

            let user_id = 1;
            let instrument_token = req.body.instrument_token;
            let in_data = {
                user_id : user_id,
                instrument_token : instrument_token
            };

            UserSubscriptionServiceObj.isInstrumentAlreadyExistsInWatchList( in_data )
            .then( ( result ) => {
                if( result ) {
                    throw 'Instrument already added to the watchlist.'
                } else {
                    return true;
                }
            } )
            .then( async ( result ) => {
                return await UserSubscriptionServiceObj.addToWatchList( in_data )
            } )
            .then( ( result ) => {
                if( result ) {

                    $this.sendResponse( res, {
                        msg : 'Record inserted successfully'
                    });
                } else {

                    throw 'Unable to insert record.'
                }
            } )
            .catch( ( ex ) => {
                $this.sendException( res, {
                    msg : ex.toString()
                });
            } );
        } catch( ex ) {
        
            $this.sendException( res, {
                msg : ex.toString()
            });
        }
    }

    init_KiteTicker() {

        let api_key = 'tbrzulogl3yckk3b';
        let access_token = 'VAOVlEK8kOiJIjQFO5DiD0wBdFSyHUec';
        console.log('api_key', api_key);
        console.log('access_token', access_token);
        // this.ws = new WebSocket(`wss://ws.kite.trade?api_key=${this.api_key}&access_token=${this.access_token}`);
        $this.ticker = new KiteTicker({ api_key: api_key, access_token: access_token });
        console.log( 'ticker', $this.ticker );

        $this.ticker.connect();
        $this.ticker.on("ticks", $this.onTicks);
        $this.ticker.on("connect", $this.subscribe);
    }
   
    onTicks(ticks) {
        // console.log("Ticks", ticks);
        SocketLibObj.tick( ticks );
    }

    subscribe() {
    // subscribeInstruments( req, res, next ) {

        try {

            // $this.init_KiteTicker();
            // SBIN // 779521
            // ICICI // 1270529
            var items = [779521];
            $this.ticker.subscribe(items);
            $this.ticker.setMode(ticker.modeFull, items);

        } catch( ex ) {
        
            // $this.sendException( res, {
            //     msg : ex.toString()
            // });
            console.log('ex.toString()', ex.toString());
        }
    }

    getZerodhaTokens( req, res, next ) {

        try {

            let in_data = '';
            ZerodhaServiceObj.getZerodhaToken( in_data )
            .then( async ( result ) => {

                return await $this.sendResponse( res, {
                    msg: 'Token found',
                    data: result
                } );
            } )
            .catch( async (ex) => {
                return await $this.sendException( res, {
                    msg: ex
                } );
            } );
        } catch( ex ) {

            return $this.sendException( res, {
                msg: ex
            } );
        }
    }
}