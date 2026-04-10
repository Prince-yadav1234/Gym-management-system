const Member = require('../models/Member.js');

// @desc    Get all members
// @route   GET /api/members
const getMembers = async (req, res) => {
  try {
    const members = await Member.find({});
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a member
// @route   POST /api/members
const createMember = async (req, res) => {
  try {
    const { name, email, phone, campus, membershipType } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const memberExists = await Member.findOne({ email });
    if (memberExists) {
      return res.status(400).json({ message: 'Member already exists' });
    }
    const member = await Member.create({ name, email, phone, campus, membershipType });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (member) {
      await Member.deleteOne({ _id: req.params.id });
      res.json({ message: 'Member removed' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMembers, createMember, deleteMember };