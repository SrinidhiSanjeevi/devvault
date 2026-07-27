import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import api from '../api';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', url: '', category: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchResources = async () => {
    try {
      const { data } = await api.get('/resources');
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/resources/${editingId}`, formData);
      } else {
        await api.post('/resources', formData);
      }
      setFormData({ title: '', url: '', category: '', description: '' });
      setEditingId(null);
      fetchResources();
    } catch (error) {
      console.error('Failed to save resource', error);
    }
  };

  const handleEdit = (resource) => {
    setFormData({ title: resource.title, url: resource.url, category: resource.category, description: resource.description });
    setEditingId(resource._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error('Failed to delete resource', error);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">IDE & Tool Resources</h1>
      
      <div className="card p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Resource' : 'Add New Resource'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Title (e.g. VS Code Setup)" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input 
              type="url" 
              placeholder="URL Link" 
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input 
              type="text" 
              placeholder="Category (e.g. IDE, CLI, Extension)" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input 
              type="text" 
              placeholder="Short Description" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center">
            {editingId ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? 'Update Resource' : 'Add Resource'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <div key={resource._id} className="card p-5 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <LinkIcon className="w-5 h-5" />
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/40 rounded-full">{resource.category}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(resource)} className="text-gray-400 hover:text-blue-500 transition"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(resource._id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">{resource.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{resource.description}</p>
            <div className="mt-auto">
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600">
                Visit Link <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        ))}
        {resources.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No resources found. Create one above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
