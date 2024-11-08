const mongoose = require('mongoose');

const { Schema } = mongoose;

const facilitySchema = new Schema(
    {
        name: {
            type: String,
            required: 'name cannot be blank'
        },
        created_at: { type: Date, default: Date.now }
    },
    { collection: 'facilities' }
);

module.exports = mongoose.model('Facility', facilitySchema);
