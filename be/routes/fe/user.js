var express = require('express');
var router = express.Router();

const controllerBuilder = require('../../app/controllers/fe/User.controller');


router.route('/user/').get(controllerBuilder.index);
router.route('/user/:id').get(controllerBuilder.show);

module.exports = router;
