import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Briefcase, ListTodo, CheckCircle2, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Projects', value: stats?.projects || 0, icon: Briefcase, color: 'bg-blue-500' },
    { title: 'Assigned to Me', value: stats?.assignedTasks || 0, icon: ListTodo, color: 'bg-purple-500' },
    { title: 'In Progress', value: stats?.issuesByStatus['In Progress'] || 0, icon: Clock, color: 'bg-amber-500' },
    { title: 'Completed', value: stats?.issuesByStatus['Done'] || 0, icon: CheckCircle2, color: 'bg-emerald-500' },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="overflow-hidden rounded-xl bg-gray-800 p-6 shadow-lg">
              <div className="flex items-center">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color} bg-opacity-20`}>
                  <Icon className={`h-6 w-6 text-${stat.color.split('-')[1]}-500`} />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-400">{stat.title}</h2>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-xl bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>
        <div className="flex space-x-4">
          <Link
            to="/projects"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
