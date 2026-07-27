import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Terminal } from 'lucide-react';
import api from '../api';

const Commands = () => {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', command: '', category: '', tags: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCommands = async () => {
    try {
      const { data } = await api.get('/commands');
      setCommands(data);
    } catch (error) {
      console.error('Failed to fetch commands', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags
      };
      if (editingId) {
        await api.put(`/commands/${editingId}`, payload);
      } else {
        await api.post('/commands', payload);
      }
      setFormData({ title: '', command: '', category: '', tags: '', description: '' });
      setEditingId(null);
      fetchCommands();
    } catch (error) {
      console.error('Failed to save command', error);
    }
  };

  const handleEdit = (cmd) => {
    setFormData({ 
      title: cmd.title, 
      command: cmd.command, 
      category: cmd.category, 
      tags: cmd.tags ? cmd.tags.join(', ') : '', 
      description: cmd.description 
    });
    setEditingId(cmd._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/commands/${id}`);
      fetchCommands();
    } catch (error) {
      console.error('Failed to delete command', error);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quick Commands</h1>
      
      <div className="card p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Command' : 'Add New Command'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Title (e.g. Restart Pods)" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input 
              type="text" 
              placeholder="Category (e.g. Kubernetes, Docker)" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input 
              type="text" 
              placeholder="Tags (comma separated)" 
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text" 
              placeholder="Short Description" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea 
            placeholder="kubectl rollout restart deployment <name>" 
            value={formData.command}
            onChange={(e) => setFormData({...formData, command: e.target.value})}
            className="w-full p-4 h-24 rounded-lg bg-gray-900 text-green-400 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
            {editingId ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? 'Update Command' : 'Add Command'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commands.map(cmd => (
          <div key={cmd._id} className="card p-5 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Terminal className="w-5 h-5" />
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded-full">{cmd.category}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cmd)} className="text-gray-400 hover:text-blue-500 transition"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(cmd._id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">{cmd.title}</h3>
            {cmd.description && <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{cmd.description}</p>}
            <div className="mt-auto bg-gray-900 p-3 rounded-lg overflow-x-auto">
              <code className="text-green-400 font-mono text-sm whitespace-pre-wrap">{cmd.command}</code>
            </div>
            {cmd.tags && cmd.tags.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {cmd.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {commands.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No commands found. Add your first quick command above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Commands;
