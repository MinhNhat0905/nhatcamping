var express = require('express');
var router = express.Router();

const controllerBuilder = require('../../app/controllers/fe/Vote.controller');


router.route('/vote/').get(controllerBuilder.index);
router.route('/vote/:id').get(controllerBuilder.show);
router.route('/vote/store').post(controllerBuilder.store);
router.route('/vote/update/:id').put(controllerBuilder.update);
router.route('/vote/:id').delete(controllerBuilder.delete);

module.exports = router;
