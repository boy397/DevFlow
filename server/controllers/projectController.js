const Project = require('../models/Project');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'Admin' }]
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all projects for current user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.user.id })
      .populate('owner', 'username email avatar')
      .populate('members.user', 'username email avatar');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project details
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username email avatar')
      .populate('members.user', 'username email avatar');
      
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Ensure the user is a member
    const isMember = project.members.some(member => member.user._id.toString() === req.user.id);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a member to a project
const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Check if requester is Admin of the project
    const requester = project.members.find(member => member.user.toString() === req.user.id);
    if (!requester || requester.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Admins can add members' });
    }

    // Check if user already in project
    if (project.members.some(member => member.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push({ user: userId, role: role || 'Developer' });
    await project.save();
    
    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('members.user', 'username email');

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  addMember
};
