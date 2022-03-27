const mongoose = require('mongoose');
const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    address : {
        type: String,
        required: true
      },
      
      city : {
        type: String,
        required: true
      },
      
      state : {
        type: String,
        required: true
      },
      
      pin : {
        type: Number,
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