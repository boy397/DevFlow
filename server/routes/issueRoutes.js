const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssuesByProject,
  updateIssue,
  deleteIssue
} = require('../controllers/issueController');
const { verifyToken } = require('../middleware/authMiddleware');

// All issue routes require authentication
router.use(verifyToken);

// @route   POST /api/issues
// @desc    Create a new issue
router.post('/', createIssue);

// @route   GET /api/issues/project/:projectId
// @desc    Get all issues for a project (optionally filter by status via query)
router.get('/project/:projectId', getIssuesByProject);

// @route   PUT /api/issues/:id
// @desc    Update an issue (e.g. changing status for drag and drop)
router.put('/:id', updateIssue);

// @route   DELETE /api/issues/:id
// @desc    Delete an issue
router.delete('/:id', deleteIssue);

module.exports = router;
