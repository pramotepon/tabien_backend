var express = require('express');
var router = express.Router();
const provinceController = require('../controllers/provinceController');

/* GET Province listing. */
router.get('/', provinceController.getProvince);
module.exports = router;