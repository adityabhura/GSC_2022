const mongoose = require('mongoose');
const recordSchema = new mongoose.Schema({
    date:{
        type:Date
      },
      info:[
        {
          doctor_info:{
              type: mongoose.Schema.Types.ObjectId,
              ref: "Doctor"
          },
          patient_info:[
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Patient"
            }
          ]
        }
      ]
});

module.exports = new mongoose.model('record',recordSchema);