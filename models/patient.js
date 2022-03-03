const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  identification_nmbr: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema, "doctor");
