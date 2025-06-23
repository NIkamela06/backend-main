import Freelancer from "../models/freelancer.js";

export const getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find();
    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFreelancerById = async (req, res) => {
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
};

export const createFreelancer = async (req, res) => {
  try {
    const newFreelancer = new Freelancer(req.body);
    await newFreelancer.save();
    res.status(201).json(newFreelancer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateFreelancer = async (req, res) => {
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
};

export const deleteFreelancer = async (req, res) => {
  try {
    await Freelancer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
    res.status(400).json({ error: error.message });



