const mongoose = require('mongoose');

const { Schema } = mongoose;

const voteSchema = new Schema(
    {
        vote_content: {
            type: String,
            required: 'vote_content cannot be blank'
        },
        vote_number : {type: Number},
        user_id : {type: String},
        room_id : {type: String},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        },
        created_at : { type: Date, default: Date.now },
    },
    { collection: 'votes' }
);

module.exports = mongoose.models.Vote || mongoose.model('Vote', voteSchema);
