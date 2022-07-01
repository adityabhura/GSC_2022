const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true,
  },

  email : {
    type: String,
    required: true
},

password: {
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

});

module.exports = mongoose.model("Patient", patientSchema, "patient");
