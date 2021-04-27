var KiteConnect = require("kiteconnect").KiteConnect;
var KiteTicker = require("kiteconnect").KiteTicker;
const axios = require('axios');
const crypto = require('crypto');

module.exports = class Zerodha {
    
    constructor() {

        this.api_key = '*****';
        this.api_secret_key = '*****';
        this.request_token = '*****';

        this.access_token = '*****';
        this.public_token = '*****';

        
        this.connectLoginLink = 'https://kite.trade/connect/login?api_key=*****;&v=3';
        this.kiteDeveloperLink = 'https://developers.kite.trade';
        this.clientCredentials = {
            user_id : '*****',
            pwd : '*****', 
            pin : '*****'
        };
        this.delevoperCredentials = {
            email : '*****',
            pwd : '*****',
        };
        this.kiteLoginCredentials = { 
            userId : '*****',
            pwd : '*****',
            pin : '*****'
        };

        this.kc =  new KiteConnect({        
            api_key: this.api_key
        });

        this.getLoginURL = this.kc.getLoginURL(); // https://kite.trade/connect/login?api_key=tbrzulogl3yckk3b&v=3
        // this.generateSession();
    }

    generateCheckSum() {
        let sha_api_key = '02FC107944EB602093708A69823F2AD2D244F964129204351F8B3295E7697996';
        return sha_api_key +' + '+ this.request_token +' + '+ this.api_secret_key;
    }

    generateSession() {

        let $this = this;
        this.kc.generateSession( this.request_token, this.api_secret_key )
        .then(function(response) {
            console.log("generateSession Response", response);
            // init();
            $this.access_token = response.access_token;
            console.log('$this.access_token', $this.access_token);
            $this.public_token = response.public_token;
            $this.user = response;
            // $this.kc.setAccessToken( $this.access_token );
            $this.setAccessToken();
            $this.getDetails();
        })
        .catch(function(err) {
            console.log('generateSession err', err);
        })
    }

    setAccessToken() {
        let $this = this;
        $this.kc.setAccessToken( $this.access_token );
    }

    getDetails() {

        console.log('this.user', this.user);
        return this.user;
    }

    async getInstruments() {

        await this.kc.getInstruments()
        .then(function(response) {
            // console.log("getInstruments Response", response);
            // console.log("getInstruments Response cnt", response);
            // let cnt = 0;
            // for( let i in response ) {
            //     cnt++;
            // }
            // console.log('cnt', cnt);
            return response;
        })
        .catch(function(err) {
            console.log('getInstruments err', err);
            return  err;
        })
    }

    getQuote() {

        // this.kc.getQuote( this.request_token, this.api_secret_key )
        // this.kc.getQuote( this.access_token, this.api_key, {instruments: ['NSE:INFY'] } )
        let instruments = ["256265","BSE:INFY", "NSE:APOLLOTYRE", "NSE:NIFTY 50"];
        this.kc.getQuote( instruments )
        .then(function(response) {
            console.log("getInstruments Response", response);
        })
        .catch(function(err) {
            console.log('getInstruments err', err);
        })
    }

    init_KiteTicker() {
        // this.ws = new WebSocket(`wss://ws.kite.trade?api_key=${this.api_key}&access_token=${this.access_token}`);
        this.ticker = new KiteTicker({ api_key: this.api_key, access_token: this.access_token });
        console.log( 'ticker', this.ticker );

        this.ticker.connect();
        this.ticker.on("ticks", this.onTicks);
        this.ticker.on("connect", this.subscribe);
    }

    onTicks(ticks) {
        console.log("Ticks", ticks);
    }

    subscribe() {
        var items = [408065];
        this.ticker.subscribe(items);
        this.ticker.setMode(ticker.modeFull, items);
    }
}