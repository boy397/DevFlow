const express = require('express');
const router = express.Router();
const {
  addComment,
  getCommentsByIssue,
  deleteComment
} = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// @route   POST /api/comments/issue/:issueId
// @desc    Add a comment to an issue
router.post('/issue/:issueId', addComment);

// @route   GET /api/comments/issue/:issueId
// @desc    Get comments for an issue
router.get('/issue/:issueId', getCommentsByIssue);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
router.delete('/:id', deleteComment);

module.exports = router;
