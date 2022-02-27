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
});

module.exports = mongoose.model("Doctor", doctorSchema, "doctor");
