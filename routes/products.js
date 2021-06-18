var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');

/* GET Products listing. */
router.get('/', productController.getProduct);
// Create Default Product From data
router.post('/productSale', productController.insertProduct);
// User Sale History
router.get('/historySale/:id', productController.historyProductSale);
// User Buy History
router.get('/historyBuy/:id', productController.historyProductBuy);
// Find Product by id
router.get('/:id', productController.findProduct);
// Buy Product
router.put('/:id', productController.buyProduct);
// Delete Product
router.delete('/:id', productController.deleteProduct);
module.exports = router;