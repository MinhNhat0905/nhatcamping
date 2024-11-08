var express = require('express');
var router = express.Router();

const facilityBuilder = require('../../app/controllers/fe/Facility.controller');


router.route('/facility').get(facilityBuilder.index);
router.route('/facility/:id').get(facilityBuilder.show);

module.exports = router;
