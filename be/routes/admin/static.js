var express = require('express');
var router = express.Router();

const staticBuilder = require('../../app/controllers/cms/Static.controller');


router.route('/monthly-statistics').get(staticBuilder.monthlyStatistics);

module.exports = router;
