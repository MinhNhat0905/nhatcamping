const mongoose = require('mongoose');

const { Schema } = mongoose;

const voteSchema = new Schema(
    {
        vote_content: {// Nội dung đánh giá
            type: String,
            required: 'vote_content cannot be blank'// Bắt buộc phải có nội dung đánh giá
        },
        vote_number : {type: Number},// Số điểm đánh giá
        user_id : {type: String},// ID người dùng thực hiện đánh giá
        room_id : {type: String},// ID phòng mà đánh giá thuộc về
        user: {// Tham chiếu tới mô hình User
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        room: {// Tham chiếu tới mô hình Room
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        },
        created_at : { type: Date, default: Date.now },// Thời gian tạo đánh giá, mặc định là thời gian hiện tại
    },
    { collection: 'votes' }
);

module.exports = mongoose.models.Vote || mongoose.model('Vote', voteSchema);
