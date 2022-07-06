const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hospital:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  specialization: {
    type: String,
    required: true,
  },
  registration: {
    type: String,
  },
  Max_no_of_patient: {
    type: Number,
    required: true,
  },
  count_of_patient:{
    type: Number,
    default:0
  },
  check_max_patient:{
    type:Boolean,
    default:false
  },
  available:{
    type:Boolean,
    default:true
  },
  booked_info:[{
    booking_date:{
      type:String
    },
    visiting_date:{
      type:String
    },
    patient_info:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient"
      } 
  }
  ]
});

module.exports = mongoose.model("Doctor", doctorSchema, "doctor");
