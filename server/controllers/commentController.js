const Comment = require('../models/Comment');

// Add a comment to an issue
const addComment = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { text } = req.body;

    const newComment = new Comment({
      text,
      author: req.user.id,
      issue: issueId
    });

    const savedComment = await newComment.save();
    
    // Populate author before returning
    await savedComment.populate('author', 'username avatar');
    
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all comments for an issue
const getCommentsByIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const comments = await Comment.find({ issue: issueId })
      .populate('author', 'username avatar')
      .sort({ createdAt: 1 }); // Oldest first for chat flow

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addComment,
  getCommentsByIssue,
  deleteComment
};
