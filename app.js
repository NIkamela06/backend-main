import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Freelancer from './models/freelancer.js';
import bcrypt from 'bcrypt';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  mongoose.connect('mongodb+srv://melazzdeen:123@cluster0.mrliikr.mongodb.net/freelancer?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB connected!'))
    .catch(err => {
      console.error('DB connection error:', err.message);
      process.exit(1);
    });
});

app.get('/freelancers', async (req, res) => {
  try {
    const freelancers = await Freelancer.find({ role: 'freelancer' });
    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/freelancers/:id', async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (freelancer) {
      res.json(freelancer);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, skills, password, role } = req.body;
    const existingUser = await Freelancer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newFreelancer = new Freelancer({
      username,
      email,
      skills,
      password: hashedPassword,
      role
    });
    await newFreelancer.save();
    res.status(201).json({ message: 'Registration successful', userType: role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Freelancer.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const userObj = user.toObject();
    delete userObj.password;
    let userType = user.role === 'freelancer' ? 'freelancer' : 'customer';
    res.json({ freelancer: userObj, userType });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

app.put('/freelancers/:id', async (req, res) => {
  try {
    const updatedFreelancer = await Freelancer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedFreelancer) {
      res.json(updatedFreelancer);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/freelancers/:id', async (req, res) => {
  try {
    await Freelancer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


  app.delete('/api/freelancer/:id', async (req, res) => {
  try {
    await Freelancer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Freelancer.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ freelancer: user, userType: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});
