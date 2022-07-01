const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  availaible:{
    type:Boolean,
    default:true
  }
});

module.exports = mongoose.model("Doctor", doctorSchema, "doctor");
