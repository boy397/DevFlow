const Project = require('../models/Project');
const Issue = require('../models/Issue');
const mongoose = require('mongoose');

const getDashboardStats = async (req, res) => {
  try {
    // Number of projects the user is part of
    const projectCount = await Project.countDocuments({ 'members.user': req.user.id });

    // We need to find all projects the user is part of to aggregate their issues
    const userProjects = await Project.find({ 'members.user': req.user.id }).select('_id');
    const projectIds = userProjects.map(p => p._id);

    // Aggregate issues for these projects by status
    const issueStats = await Issue.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Aggregate tasks specifically assigned to the current user
    const assignedTasks = await Issue.countDocuments({ assignee: req.user.id });

    // Format the response nicely
    const formattedStats = {
      projects: projectCount,
      assignedTasks,
      issuesByStatus: {
        'Backlog': 0,
        'Todo': 0,
        'In Progress': 0,
        'Done': 0
      }
    };

    issueStats.forEach(stat => {
      formattedStats.issuesByStatus[stat._id] = stat.count;
    });

    res.status(200).json(formattedStats);
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ message: 'Server error getting analytics' });
  }
};

module.exports = { getDashboardStats };
