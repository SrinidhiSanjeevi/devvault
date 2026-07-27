import { useState, useEffect } from 'react';
import api from '../api';
import { Code, Link as LinkIcon, Terminal, Star, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totals: { snippets: 0, resources: 0, commands: 0 },
    favourites: { snippets: 0, resources: 0, commands: 0 },
    recent: { snippets: [], resources: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        // Structure returned by API: { totals, favourites, recent, categoryStats }
        setStats({
          totals: data.totals || { snippets: 0, resources: 0, commands: 0 },
          favourites: data.favourites || { snippets: 0, resources: 0, commands: 0 },
          recent: data.recent || { snippets: [], resources: [] }
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Stat Cards */}
        <div className="card flex items-center p-6 border-l-4 border-l-blue-500">
          <div className="p-3 mr-4 bg-blue-100 rounded-full dark:bg-blue-900/50">
            <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Snippets</p>
            <p className="text-2xl font-bold">{stats.totals.snippets}</p>
          </div>
        </div>

        <div className="card flex items-center p-6 border-l-4 border-l-green-500">
          <div className="p-3 mr-4 bg-green-100 rounded-full dark:bg-green-900/50">
            <LinkIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Resources</p>
            <p className="text-2xl font-bold">{stats.totals.resources}</p>
          </div>
        </div>

        <div className="card flex items-center p-6 border-l-4 border-l-purple-500">
          <div className="p-3 mr-4 bg-purple-100 rounded-full dark:bg-purple-900/50">
            <Terminal className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Commands</p>
            <p className="text-2xl font-bold">{stats.totals.commands}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="flex items-center mb-4 text-lg font-bold"><Clock className="w-5 h-5 mr-2" /> Recent Snippets</h2>
          <ul className="space-y-3">
            {stats.recent.snippets.map(s => (
              <li key={s._id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="font-medium">{s.title}</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">DevOps</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="flex items-center mb-4 text-lg font-bold"><Star className="w-5 h-5 mr-2 text-yellow-500" /> Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <span>Favourite Snippets</span>
              <span className="font-bold">{stats.favourites.snippets}</span>
            </div>
            <div className="flex justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <span>Favourite Resources</span>
              <span className="font-bold">{stats.favourites.resources}</span>
            </div>
            <div className="flex justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <span>Favourite Commands</span>
              <span className="font-bold">{stats.favourites.commands}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
