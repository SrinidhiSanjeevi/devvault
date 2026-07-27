import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Code } from 'lucide-react';
import api from '../api';

const Snippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', category: '', programmingLanguage: '', snippetCode: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchSnippets = async () => {
    try {
      const { data } = await api.get('/snippets');
      setSnippets(data);
    } catch (error) {
      console.error('Failed to fetch snippets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/snippets/${editingId}`, formData);
      } else {
        await api.post('/snippets', formData);
      }
      setFormData({ title: '', category: '', programmingLanguage: '', snippetCode: '' });
      setEditingId(null);
      fetchSnippets();
    } catch (error) {
      console.error('Failed to save snippet', error);
    }
  };

  const handleEdit = (snippet) => {
    setFormData({ title: snippet.title, category: snippet.category, programmingLanguage: snippet.programmingLanguage, snippetCode: snippet.snippetCode });
    setEditingId(snippet._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/snippets/${id}`);
      fetchSnippets();
    } catch (error) {
      console.error('Failed to delete snippet', error);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Code Snippets</h1>
      
      <div className="card p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Snippet' : 'Add New Snippet'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Title" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input 
              type="text" 
              placeholder="Category" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input 
              type="text" 
              placeholder="Language (e.g. JavaScript)" 
              value={formData.programmingLanguage}
              onChange={(e) => setFormData({...formData, programmingLanguage: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <textarea 
            placeholder="Paste your code here..." 
            value={formData.snippetCode}
            onChange={(e) => setFormData({...formData, snippetCode: e.target.value})}
            className="w-full p-4 h-48 rounded-lg bg-gray-900 text-green-400 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
            style={{ tabSize: 2 }}
          />
          <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center">
            {editingId ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? 'Update Snippet' : 'Add Snippet'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {snippets.map(snippet => (
          <div key={snippet._id} className="card border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Code className="w-5 h-5" />
                <span className="font-bold text-gray-800 dark:text-white">{snippet.title}</span>
                <span className="text-xs font-semibold px-2 py-1 bg-purple-100 dark:bg-purple-900/40 rounded-full ml-2">{snippet.programmingLanguage}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(snippet)} className="text-gray-400 hover:text-blue-500 transition"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(snippet._id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-4 bg-gray-900 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {snippet.snippetCode}
              </pre>
            </div>
          </div>
        ))}
        {snippets.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No snippets found. Create one above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Snippets;
