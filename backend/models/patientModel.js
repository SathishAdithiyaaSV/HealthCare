import mongoose from 'mongoose';

const Patient = mongoose.model('Patient', new mongoose.Schema({
    name: String,
    age: Number,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    bloodPressure: String,
    glucose: String,
    weight: String,
    heartRate: String,
  }));

export default Patient;