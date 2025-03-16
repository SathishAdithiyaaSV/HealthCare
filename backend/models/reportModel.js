import mongoose from 'mongoose';
import Patient from './patientModel.js';
import Doctor from './doctorModel.js';

const reportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  date: String,
  description: String,
  symptoms: String,
  name: String,
  pdf: Buffer,
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
