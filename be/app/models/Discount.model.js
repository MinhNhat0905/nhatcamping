const mongoose = require('mongoose');

const { Schema } = mongoose;

const discountSchema = new Schema(
    {
        name: {
            type: String,
            required: 'name cannot be blank'
        },
        price: {
            type: Number,
        },
        status: {
            type: Number,
            default: 1
        },
        created_at : { type: Date, default: Date.now }
    },
    { collection: 'discounts' }
);

module.exports = mongoose.model('discount', discountSchema);
