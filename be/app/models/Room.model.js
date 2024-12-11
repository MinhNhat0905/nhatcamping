const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const roomSchema = new Schema(
    {
        name: {// Tên phòng
            type: String,
            required: 'name cannot be blank'// Bắt buộc phải có tên
        },
        avatar: { // Hình đại diện của phòng
            type: String,
        },
        room_code: {// Mã phòng
            type: String,
        },
        status: {// Trạng thái phòng
            type: String,
            default: "EMPTY"
        },
        
        floors: {
            type: Number,
        },
        quantity: {//
            type: Number,//
        },//
        address: {// Địa chỉ
            type: String,
           
        },
        price: {
            type: Number,
        },
        size: {
            type: Number,
        },
        bed: {
            type: Number,
        },
        total_vote: { // Tổng số đánh giá
            type: Number,
        },
        total_star: {// Tổng số sao
            type: Number,
        },
        description: {
            type: String,
        },
        room_content: {
            type: String,
        },
        category_id: {// ID danh mục phòng
            type: String, 
            required: 'category_id cannot be blank'},// Bắt buộc phải có ID danh mục
        category: {// Tham chiếu tới danh mục
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        facilities: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Facility'
            }
        ],
        albums: {
            type: Array
        },
        location: { // Sửa lại để lưu trữ tọa độ theo GeoJSON format
            type: {
                type: String,
                enum: ['Point'], // Đảm bảo rằng kiểu là 'Point'
                required: true
            },
            coordinates: {
                type: [Number], // Array of numbers: [longitude, latitude]
                required: true
            }
        },
        created_at : { type: Date, default: Date.now }
    },
    { collection: 'rooms' }
);
// Tạo chỉ mục geospatial để MongoDB có thể xử lý các truy vấn về vị trí
roomSchema.index({ location: '2dsphere' }); // Chỉ mục 2dsphere cho geospatial queries
module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);
