const Issue = require('../models/Issue');
const Project = require('../models/Project');

// Create issue
const createIssue = async (req, res) => {
  try {
    const { title, description, status, priority, assignee, projectId } = req.body;
    
    // Verify project exists and user is a member
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const isMember = project.members.some(member => member.user.toString() === req.user.id);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    const newIssue = new Issue({
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      assignee,
      project: projectId,
      reporter: req.user.id
    });

    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get issues for a project (with optional status filtering)
const getIssuesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;

    const query = { project: projectId };
    if (status) query.status = status;

    const issues = await Issue.find(query)
      .populate('assignee', 'username avatar')
      .populate('reporter', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an issue
const updateIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const updates = req.body;

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      { $set: updates },
      { new: true, runValidators: true }
    )
    .populate('assignee', 'username avatar')
    .populate('reporter', 'username avatar');

    if (!updatedIssue) return res.status(404).json({ message: 'Issue not found' });

    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an issue
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createIssue,
  getIssuesByProject,
  updateIssue,
  deleteIssue
};
