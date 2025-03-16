import mongoose from 'mongoose';

const Prescription = mongoose.model("Prescription", new mongoose.Schema({
    date: String,
    illness: String,
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    doctorName: String,
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    patientName: String,
    medications: [{medication: String,
    frequency: String,
    days: String}],
  }));

export default Prescription;