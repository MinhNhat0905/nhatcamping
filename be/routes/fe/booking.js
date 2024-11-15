var express = require('express');
var router = express.Router();

const bookingBuilder = require('../../app/controllers/fe/Booking.controller');

// const authMiddleware = require('./../../app/middleware/AuthJwt');
// const isAuth = authMiddleware.isAuth;

// Xử lý yêu cầu GET đến `/booking/callback`, gọi phương thức `webhook` của `bookingBuilder`
// Dùng để xử lý callback từ các hệ thống thanh toán (VD: nhận thông báo từ VNPAY)
router.route('/booking/callback').get(bookingBuilder.webhook);

// Xử lý yêu cầu POST đến `/booking/cancel/:id`, gọi phương thức `cancel` của `bookingBuilder`
// Dùng để hủy booking theo `id`
router.route('/booking/cancel/:id').post(bookingBuilder.cancel);

// Xử lý yêu cầu GET đến `/booking`, gọi phương thức `index` của `bookingBuilder`
// Lấy danh sách tất cả các booking
router.get('/booking',bookingBuilder.index);

// Xử lý yêu cầu POST đến `/booking`, gọi phương thức `add` của `bookingBuilder`
// Tạo mới một booking
router.route('/booking/').post(bookingBuilder.add);

// Xử lý yêu cầu GET đến `/booking/:id`, gọi phương thức `show` của `bookingBuilder`
// Lấy chi tiết booking theo `id`
router.get('/booking/:id',bookingBuilder.show);


module.exports = router;
