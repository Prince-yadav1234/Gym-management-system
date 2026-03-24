const express = require('express');
const { getMembers, createMember, deleteMember } = require('../controllers/membercontroller.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/')
  .get(protect, getMembers)
  .post(protect, admin, createMember);

router.route('/:id')
  .delete(protect, admin, deleteMember);

module.exports = router;