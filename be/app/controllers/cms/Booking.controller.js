const Booking = require("./../../models/Booking.model")
// Hàm index để lấy danh sách các đặt phòng với phân trang
exports.index = async (req, res) => {
    
     // Lấy thông tin trang và kích thước trang từ query params
     const page = req.query.page || 1; // Mặc định là trang 1
     const page_size = req.query.page_size || 10; // Mặc định là 10 bản ghi trên mỗi trang
     
    try {
        const condition = {}; // Đối tượng điều kiện để tìm kiếm
        // Thêm điều kiện lọc nếu có user_id hoặc room_id trong query
        if (req.query.user_id) condition.user_id = req.query.user_id; // Lọc theo user_id
        if (req.query.room_id) condition.room_id = req.query.room_id; // Lọc theo room_id


         // Tìm kiếm các booking theo điều kiện đã thiết lập
         const bookings = await Booking.find()
         .where(condition) // Áp dụng điều kiện tìm kiếm
         .limit(page_size) // Giới hạn số bản ghi trên mỗi trang
         .skip((page - 1) * page_size) // Bỏ qua số bản ghi theo trang
         .populate(['room']) // Tham chiếu thông tin phòng
         .sort({created_at: 'desc'}) // Sắp xếp theo thời gian tạo, mới nhất trước
         .exec();

        // Lấy tổng số tài liệu trong bộ sưu tập Booking
        const count = await Booking.find().where(condition).count();

         // Trả về phản hồi với danh sách booking, tổng số trang và trang hiện tại
        const meta = {
            total_page: Math.ceil(count / page_size), // Tổng số trang
            total: count, // Tổng số bản ghi
            current_page: parseInt(page), // Trang hiện tại
            page_size: parseInt(page_size) // Kích thước trang
        }
        const status =  200;
        const data = {
            bookings: bookings// Danh sách booking
        }
        res.json({
            data,
            meta,
            status
        });
    } catch (err) {
        console.error(err.message);
    }
};
// Hàm show để lấy thông tin một đặt phòng theo I
exports.show = async (req, res) => {
    try {
        const service = await Booking.findOne({ _id: req.params.id })// Tìm đặt phòng theo ID.
        return res.status(200).json({ data: service, status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Booking doesn't exist!" })
    }
};
// Hàm delete để xóa một đặt phòng theo ID
exports.delete = async (req, res) => {
    try {
        await Booking.deleteOne({ _id: req.params.id })// Xóa đặt phòng theo ID.
        return res.status(200).json({ data: [], status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Booking doesn't exist!" })
    }
};

// Hàm update để cập nhật thông tin một đặt phòng theo ID
exports.update = async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id })// Tìm đặt phòng theo ID.
        // Cập nhật trạng thái nếu có trong body của yêu cầu
        if (req.body.status) {
            booking.status = req.body.status; // Cập nhật trạng thái
        };
       // Cập nhật các trường khác nếu có (Ví dụ status_payment) 
        if (req.body.status_payment) {
            booking.status_payment = req.body.status_payment; // Cập nhật trạng thái thanh toán
        }//if nay la them

        await booking.save();
        return res.status(200).json({ data: booking, status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Booking doesn't exist!" })
    }
};
