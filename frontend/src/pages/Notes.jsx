import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, FileText } from 'lucide-react';
import api from '../api';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', content: '', topic: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/notes');
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/notes/${editingId}`, formData);
      } else {
        await api.post('/notes', formData);
      }
      setFormData({ title: '', content: '', topic: '' });
      setEditingId(null);
      fetchNotes();
    } catch (error) {
      console.error('Failed to save note', error);
    }
  };

  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content, topic: note.topic });
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notes & Documents</h1>
      
      <div className="card p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Note' : 'Create New Note'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Topic / Category" 
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <textarea 
            placeholder="Content / Commands..." 
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full p-3 h-32 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
            {editingId ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {editingId ? 'Update Note' : 'Add Note'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div key={note._id} className="card p-5 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <FileText className="w-5 h-5" />
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/40 rounded-full">{note.topic}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(note)} className="text-gray-400 hover:text-blue-500 transition"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(note._id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">{note.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm flex-1 whitespace-pre-wrap">{note.content}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            No notes found. Create one above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
