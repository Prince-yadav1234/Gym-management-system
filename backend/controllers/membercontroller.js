const Member = require('../models/Member.js');

// @desc    Get all members
// @route   GET /api/members
const getMembers = async (req, res) => {
  const members = await Member.find({});
  res.json(members);
};

// @desc    Create a member
// @route   POST /api/members
const createMember = async (req, res) => {
  const { name, email, phone, membershipType } = req.body;
  const memberExists = await Member.findOne({ email });
  if (memberExists) {
    return res.status(400).json({ message: 'Member already exists' });
  }
  const member = await Member.create({ name, email, phone, membershipType });
  res.status(201).json(member);
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
const deleteMember = async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (member) {
    await member.remove();
    res.json({ message: 'Member removed' });
  } else {
    res.status(404).json({ message: 'Member not found' });
  }
};

module.exports = { getMembers, createMember, deleteMember };