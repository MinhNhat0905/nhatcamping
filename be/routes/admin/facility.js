var express = require('express');
var router = express.Router();

const facilityBuilder = require('../../app/controllers/cms/Facility.controller');
const authMiddleware = require('./../../app/middleware/AuthJwt');
const isAuth = authMiddleware.isAuth;

router.get('/facility/',isAuth,facilityBuilder.index);
router.get('/facility/:id',isAuth,facilityBuilder.show);
router.post('/facility/store',isAuth,facilityBuilder.store);
router.put('/facility/update/:id',isAuth,facilityBuilder.update);
router.delete('/facility/:id',isAuth,facilityBuilder.delete);

module.exports = router;
