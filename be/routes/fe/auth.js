var express = require('express');
var router = express.Router();
const authBuilder = require('../../app/controllers/Auth.controller');


const authMiddleware = require('./../../app/middleware/AuthJwt');
const isAuth = authMiddleware.isAuth;

router.route('/auth/register').post(authBuilder.register);
router.route('/auth/login').post(authBuilder.login);

router.get('/profile',isAuth, authBuilder.getProfile);
router.put('/profile',isAuth, authBuilder.updateInfo);
router.put('/change-password',isAuth, authBuilder.changePassword);

module.exports = router;
