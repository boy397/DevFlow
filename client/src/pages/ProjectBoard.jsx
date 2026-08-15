import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axios';
import { Plus } from 'lucide-react';

const COLUMNS = ['Backlog', 'Todo', 'In Progress', 'Done'];

const ProjectBoard = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Issue Modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');

  const fetchBoardData = async () => {
    try {
      const [projRes, issueRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/issues/project/${id}`)
      ]);
      setProject(projRes.data);
      setIssues(issueRes.data);
    } catch (error) {
      console.error('Error fetching board data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, [id]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    setIssues((prev) => 
      prev.map(issue => issue._id === draggableId ? { ...issue, status: newStatus } : issue)
    );

    try {
      await api.put(`/issues/${draggableId}`, { status: newStatus });
    } catch (error) {
      console.error('Error updating issue status', error);
      // Revert on error
      fetchBoardData();
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/issues', {
        title: issueTitle,
        projectId: id,
        status: 'Backlog',
      });
      setShowIssueModal(false);
      setIssueTitle('');
      fetchBoardData();
    } catch (error) {
      console.error('Error creating issue', error);
    }
  };

  if (loading) return <div className="text-gray-400">Loading board...</div>;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{project?.name}</h1>
          <p className="mt-1 text-sm text-gray-400">Kanban Board</p>
        </div>
        <button
          onClick={() => setShowIssueModal(true)}
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Issue
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-1 gap-6 overflow-x-auto pb-4">
          {COLUMNS.map(column => {
            const columnIssues = issues.filter(issue => issue.status === column);
            
            return (
              <div key={column} className="flex min-w-[320px] max-w-[320px] flex-col rounded-xl bg-gray-950 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-300">{column}</h3>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-gray-400">
                    {columnIssues.length}
                  </span>
                </div>

                <Droppable droppableId={column}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-gray-800/50' : 'bg-transparent'}`}
                    >
                      {columnIssues.map((issue, index) => (
                        <Draggable key={issue._id} draggableId={issue._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm transition-all ${
                                snapshot.isDragging ? 'rotate-2 scale-105 border-blue-500 shadow-xl shadow-blue-500/20' : 'hover:border-gray-600 hover:shadow-md'
                              }`}
                            >
                              <h4 className="font-medium text-white">{issue.title}</h4>
                              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                                <span className={`rounded px-2 py-1 font-medium ${
                                  issue.priority === 'High' || issue.priority === 'Urgent' 
                                  ? 'bg-red-500/10 text-red-500' 
                                  : 'bg-gray-700 text-gray-300'
                                }`}>
                                  {issue.priority}
                                </span>
                                <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Basic Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gray-800 p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-white">Create New Issue</h2>
            <form onSubmit={handleCreateIssue}>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-gray-300">Issue Title</label>
                <input
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
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

export default ProjectBoard;
