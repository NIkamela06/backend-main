import mongoose from 'mongoose';

const freelancerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  skills:   { type: [String], required: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['freelancer', 'customer'], default: 'freelancer', required: true }
});

export default mongoose.model('Freelancer', freelancerSchema);

