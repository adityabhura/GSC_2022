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
    ],

    //Overall report
    patient_complete_record:[
      {
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
      }
    ],

    //Daily report i.e. tommowrow's booking
    today_record :  {
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
    }



});

module.exports = new mongoose.model('hospital',hospitalSchema);