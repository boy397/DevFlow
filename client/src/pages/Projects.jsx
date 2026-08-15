import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Users, Briefcase } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Project Form State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description });
      setShowModal(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  if (loading) return <div className="text-gray-400">Loading projects...</div>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/project/${project._id}`}
            className="group rounded-xl border border-gray-700 bg-gray-800 p-6 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <h2 className="mb-2 text-xl font-bold text-white group-hover:text-blue-500">
              {project.name}
            </h2>
            <p className="mb-4 line-clamp-2 text-sm text-gray-400">
              {project.description || 'No description provided.'}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="mr-2 h-4 w-4" />
              {project.members.length} member{project.members.length !== 1 && 's'}
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 py-20 text-center">
          <Briefcase className="mb-4 h-12 w-12 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-300">No projects yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gray-800 p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-white">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-300">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-24 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg px-4 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
