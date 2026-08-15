const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  addMember
} = require('../controllers/projectController');
const { verifyToken } = require('../middleware/authMiddleware');

// All project routes require authentication
router.use(verifyToken);

// @route   POST /api/projects
// @desc    Create a new project
router.post('/', createProject);

// @route   GET /api/projects
// @desc    Get all projects for user
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @desc    Get single project
router.get('/:id', getProjectById);

// @route   POST /api/projects/:id/members
// @desc    Add member to a project
router.post('/:id/members', addMember);

module.exports = router;
