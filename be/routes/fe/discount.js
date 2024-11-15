var express = require('express');
var router = express.Router();

const discountBuilder = require('../../app/controllers/fe/Discount.controller');



// router.get('/discount/', discountBuilder.index);
// router.get('/discount/:id',discountBuilder.show);
router.route('/discount/').get(discountBuilder.index);
router.route('/discount/:id').get(discountBuilder.show);


module.exports = router;
