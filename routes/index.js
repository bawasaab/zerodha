var express = require('express');
var router = express.Router();

var usersRouter = require('./users');
var zerodhaRouter = require('./zerodha');
var authRouter = require('./authRouter');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/login', function(req, res, next) {
//   res.render('login', { url: 'https://kite.trade/connect/login?api_key=tbrzulogl3yckk3b&v=3' });
// });

router.get( '/dashboard', ( req, res, next ) => {
  res.render('dashboard', { title: 'Express' });
} );

router.get( '/holdings', ( req, res, next ) => {
  res.render('holdings', { title: 'Express' });
} );

router.get( '/positions', ( req, res, next ) => {
  res.render('positions', { title: 'Express' });
} );

router.get( '/mutual_funds', ( req, res, next ) => {
  res.render('mutual_funds', { title: 'Express' });
} );

router.get( '/money', ( req, res, next ) => {
  res.render('money', { title: 'Express' });
} );

router.get( '/profile', ( req, res, next ) => {
  res.render('profile', { title: 'Express' });
} );

router.use('/users', usersRouter);
router.use('/zerodha', zerodhaRouter);
router.use('/auth', authRouter);


module.exports = router;
