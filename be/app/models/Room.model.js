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
        created_at : { type: Date, default: Date.now }
    },
    { collection: 'rooms' }
);

module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);
