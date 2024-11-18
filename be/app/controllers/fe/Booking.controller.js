const Booking = require("./../../models/Booking.model");
const Room = require("./../../models/Room.model");
const Discount = require("./../../models/Discount.model");

const nodemailer =  require('nodemailer');
const moment = require("moment");
const axios = require("axios");
// Xử lý webhook cho thanh toán
exports.webhook = async (req, res) => { // Khai báo phương thức webhook để xử lý callback từ hệ thống thanh toán
    let _id = req.query.vnp_TxnRef;
    if (req.query.vnp_ResponseCode === "00") { // Kiểm tra nếu thanh toán thành công
        const booking = await Booking.findById({_id: _id});
        if (booking) {
            booking.status_payment = "Đã thanh toán";// Cập nhật trạng thái thanh toán là đã thanh toán
            booking.save();
        }

        return res.redirect('http://localhost:3030/payment/success');// Redirect tới trang thành công
    }

    return res.redirect('http://localhost:3030/payment/error');// Redirect tới trang thất bại nếu thanh toán không thành công
    // return res.status(200).json({ data: req.query, status: 200 });
}

// Phương thức index để lấy danh sách các booking
exports.index = async (req, res) => {
    const page = req.query.page || 1; 
	const page_size = req.query.page_size  || 10;
    try {
         // Tạo điều kiện tìm kiếm
        const condition = {};
        // Nếu có room_id trong query thì thêm điều kiện tìm theo room_id
        if (req.query.room_id) condition.room_id = req.query.room_id;
        // Nếu có user_id trong query thì thêm điều kiện tìm theo user_id
        if (req.query.user_id) condition.user_id = req.query.user_id;

        const bookings = await Booking.find()// Tìm kiếm tất cả các booking
            .where(condition)
            .limit(page_size)
			.populate(['room'])
            .skip((page - 1) * page_size)
            .sort({created_at: 'desc'})
            .exec();

        // Tính tổng số lượng booking để phân trang
        const count = await Booking.find().where(condition).count();

        // Trả về thông tin phân trang cùng với dữ liệu
        const meta = {
            total_page: Math.ceil(count / page_size),
            total: count,
            current_page: parseInt(page),
            page_size: parseInt(page_size)
        }
        const status =  200;
        const data = {
            bookings: bookings// Dữ liệu booking tìm được
        }
        res.json({
            data,
            meta,
            status
        });
    } catch (err) {
        console.error('booking list--------> ',err.message);
		res.send({ error: "Booking doesn't exist!" })
    }
};
// Phương thức show để lấy chi tiết booking theo ID
exports.show = async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id });// Tìm kiếm booking theo ID từ tham số trong URL
        return res.status(200).json({ data: booking, status: 200 });// Trả về booking nếu tìm thấy
    } catch {
        res.status(404)
        res.send({ error: "Booking doesn't exist!" })
    }
};
// Phương thức cancel để hủy booking theo ID
exports.cancel = async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id });
        booking.status = 'Hủy';// Cập nhật trạng thái của booking thành "Hủy"

        let room = await Room.findById({ _id: booking.room_id });
        room.status = "EMPTY";// Cập nhật trạng thái phòng thành "EMPTY" (phòng trống)
        room.save();// Lưu lại thông tin phòng đã cập nhật

        await booking.save();// Lưu lại thông tin booking đã hủy
        return res.status(200).json({ data: booking, status: 200 });
    } catch (e){
        console.log('------------------ e',e);
        res.status(404)
        res.send({ error: "Booking doesn't exist!" })
    }
};
// Phương thức add để thêm mới booking
exports.add = async (req, res) => {
    try {
        let data = req.body;// Lấy dữ liệu từ request body
		console.log('data--------> ', data);
        // xử lý thời gian
        var now = moment(data.check_out); // Lấy thời gian checkout
        var end = moment(data.check_in); // Lấy thời gian checkin
        var duration = moment.duration(now.diff(end));// Tính thời gian chênh lệch giữa checkout và checkin
        var days = duration.asDays();// Lấy số ngày giữa hai thời điểm

        let roomID = data.room_id; // Lấy room_id từ dữ liệu
        let room = await Room.findById({ _id: roomID });// Tìm kiếm phòng theo room_id
        room.status = "USER";// Cập nhật trạng thái phòng thành "USER"
        room.save();// Lưu lại thông tin phòng

        data.room = roomID;// Gán room_id vào data booking
        data.price = room.price; // Gán giá phòng vào data booking
        data.total_money = room.price * days;// Tính tổng số tiền từ giá phòng và số ngày đã ở


        // Kiểm tra mã giảm giá
        if (data.discount_name) {
            let codeDiscount = await Discount.findOne({ name: data.discount_name });
            if (codeDiscount) {
                data.discount_id = codeDiscount._id; // Lưu discount_id từ tên mã giảm giá
                data.discount = codeDiscount.price; // Gán giá trị giảm giá vào data
                data.total_money -= codeDiscount.price;
                if (data.total_money < 0) data.total_money = 0;
            }
        }

       
        
        if (data.payment_type === 2) { // Nếu phương thức thanh toán là VNPAY
            // Cấu hình các tham số để gửi yêu cầu thanh toán qua VNPAY
            // try {
                var secretKey = 'NNKCMMREAOLFEUVCNLJMGVMFSSBPYPCQ';
                var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
                var returnUrl = 'http://localhost:3053/api/v1/booking/callback';

                var date = new Date();

                var createDate = dateFormat(date, 'yyyymmddHHmmss');
                var orderId = booking._id;// Lấy ID booking làm mã đơn hàng
                var tmnCode = "B6D7F86K";
                var amount = data.total_money;

                var orderInfo = 'Thanh toan hoa don mua hang'; // Thông tin đơn hàng
                var orderType = 'other';
                var locale = 'vn';

                var currCode = 'VND';
                var vnp_Params = {}; // Khởi tạo đối tượng chứa các tham số gửi đi
                vnp_Params['vnp_Version'] = '2.1.0';
                vnp_Params['vnp_Command'] = 'pay';
                vnp_Params['vnp_TmnCode'] = tmnCode;
                // vnp_Params['vnp_Merchant'] = ''
                vnp_Params['vnp_Locale'] = locale;
                vnp_Params['vnp_CurrCode'] = currCode;
                vnp_Params['vnp_TxnRef'] = orderId;
                vnp_Params['vnp_OrderInfo'] = orderInfo;
                vnp_Params['vnp_OrderType'] = orderType;
                vnp_Params['vnp_Amount'] = amount * 100;
                vnp_Params['vnp_ReturnUrl'] = returnUrl;
                vnp_Params['vnp_IpAddr'] = '127.0.0.1';
                vnp_Params['vnp_CreateDate'] = createDate;

                vnp_Params = sortObject(vnp_Params);// Sắp xếp các tham số theo thứ tự chuẩn

                var querystring = require('qs');
                var signData = querystring.stringify(vnp_Params, { encode: false });
                var crypto = require("crypto");     
                var hmac = crypto.createHmac("sha512", secretKey);
                var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
                vnp_Params['vnp_SecureHash'] = signed;
                vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

                res.redirect(vnpUrl)

                // let newData = {
                //     order_id : booking._id,
                //     url_return : 'http://localhost:3053/api/v1/booking/callback',
                //     amount : data.total_money,
                //     // url_callback: 'http://localhost:3053/api/v1/booking/callback'
                // }
                // const response = await axios.post("https://123code.net/api/v1/payment/add", newData);
                // console.log('link url vnpay');
                // console.log(response.data);
                // if (response.data.link) {
                //     data.link = response.data.link;
                // }

            // } catch (err) {
            //     res.status(500).json({ message: err });
            // }
        }
        const booking = new Booking(data);// Tạo mới booking với dữ liệu đã xử lý
        await booking.save();// Lưu booking vào database

        console.log('--------------- booking: ', booking);
       
        return res.status(200).json({ data: data, status : 200 });
    } catch (e){
        res.status(501)
        res.send({ error: e })
    }
};
