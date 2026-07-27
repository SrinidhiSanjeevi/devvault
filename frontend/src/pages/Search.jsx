import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { Code, Terminal, Link as LinkIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ snippets: [], commands: [], resources: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const [snippetsRes, commandsRes, resourcesRes] = await Promise.all([
          api.get('/snippets'),
          api.get('/commands'),
          api.get('/resources')
        ]);

        const q = query.toLowerCase();

        const filterItems = (items) => items.filter(item => 
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
        );

        setResults({
          snippets: filterItems(snippetsRes.data),
          commands: filterItems(commandsRes.data),
          resources: filterItems(resourcesRes.data)
        });
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (query) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  if (loading) return <div className="flex justify-center mt-20"><div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Search Results</h1>
        <p className="text-gray-500">Showing results for "{query}"</p>
      </div>

      {results.snippets.length === 0 && results.commands.length === 0 && results.resources.length === 0 && (
        <div className="card p-10 text-center text-gray-500 border border-gray-200 dark:border-gray-800">
          No results found. Try a different keyword.
        </div>
      )}

      {results.snippets.length > 0 && (
        <div>
          <h2 className="flex items-center text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-800 pb-2"><Code className="w-5 h-5 mr-2 text-purple-500"/> Snippets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.snippets.map(s => (
              <div key={s._id} className="card p-4 border border-gray-200 dark:border-gray-800 flex flex-col">
                <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-2 flex-1">{s.description}</p>
                <div className="bg-gray-900 p-2 rounded overflow-x-auto mt-2">
                  <code className="text-green-400 text-xs font-mono">{s.snippetCode}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.commands.length > 0 && (
        <div>
          <h2 className="flex items-center text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-800 pb-2"><Terminal className="w-5 h-5 mr-2 text-blue-500"/> Commands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.commands.map(c => (
              <div key={c._id} className="card p-4 border border-gray-200 dark:border-gray-800 flex flex-col">
                <h3 className="font-bold text-lg mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-2 flex-1">{c.description}</p>
                <div className="bg-gray-900 p-2 rounded overflow-x-auto mt-2">
                  <code className="text-green-400 text-xs font-mono">{c.command}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.resources.length > 0 && (
        <div>
          <h2 className="flex items-center text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-800 pb-2"><LinkIcon className="w-5 h-5 mr-2 text-green-500"/> Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.resources.map(r => (
              <div key={r._id} className="card p-4 border border-gray-200 dark:border-gray-800 flex flex-col">
                <h3 className="font-bold text-lg mb-1">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-2 flex-1">{r.description}</p>
                <div className="mt-2">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">{r.url}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Search;
