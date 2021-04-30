var express = require('express');
const { route } = require('./users');
var router = express.Router();
const ZerodhaController = require('../controllers').ZerodhaController;
const ZerodhaControllerObj = new ZerodhaController();

console.log('ZerodhaControllerObj', ZerodhaControllerObj);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource from zerodha');
});

router.get('/select-watchlist', function(req, res, next) {
  res.render( 'select_watchlist' );
});

router.get('/view-watchlist', function(req, res, next) {
  res.render( 'view_watchlist' );
});

router.get( '/view-ticks', ( req, res, next ) => { 
  res.render( 'ticks', { title: 'Express' } );
} );

router.post('/add-watchlist', ZerodhaControllerObj.addToWatchList);
// router.get('/subscribe-instruments', ZerodhaControllerObj.subscribeInstruments);

// router.get( '/getInstrumentsFromCloud', ZerodhaControllerObj.getInstrumentsFromCloud);
router.get( '/getInstruments', ZerodhaControllerObj.searchInstruments);

router.get( '/getTokens', ZerodhaControllerObj.getZerodhaTokens);

router.get( '/getUserWatchList', ZerodhaControllerObj.getUserWatchList);

router.get( '/unsubscribeInstruments', ZerodhaControllerObj.unsubscribeInstruments );

module.exports = router;
