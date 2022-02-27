const mongoose = require('mongoose');
const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    location : {
        type: String,
        required: true
    },

    email : {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    doctors : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Doctor"
        }
    ]
});

module.exports = new mongoose.model('hospital',hospitalSchema);