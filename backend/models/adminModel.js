import mongoose from 'mongoose';

const Admin = mongoose.model('Admin', new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  }));

export default Admin;