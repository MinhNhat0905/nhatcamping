var express = require('express');
var router = express.Router();

const discountBuilder = require('../../app/controllers/cms/Discount.controller');


const authMiddleware = require('./../../app/middleware/AuthJwt');
const isAuth = authMiddleware.isAuth;

router.get('/discount/',isAuth, discountBuilder.index);
router.get('/discount/:id', isAuth,discountBuilder.show);
router.post('/discount/store',isAuth,discountBuilder.store);
router.put('/discount/update/:id',isAuth,discountBuilder.update);
router.delete('/discount/:id',isAuth,discountBuilder.delete);

module.exports = router;
