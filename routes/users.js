var express = require('express');
var router = express.Router();

let UsersController = require('../controllers/UsersControlller');
let UsersControllerObj = new UsersController();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.get('/login', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/admin/login', UsersControllerObj.login);
router.get('/loginCallBack', UsersControllerObj.loginCallBack);

router.post('/', UsersControllerObj.insertUser);

module.exports = router;
