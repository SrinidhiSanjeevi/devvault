import { Sun, Moon, LogOut, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ darkMode, setDarkMode, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--bg-color)] border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <input 
            type="text" 
            className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 border-none dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Search snippets, resources, commands..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button 
          onClick={handleLogout}
          className="flex items-center p-2 text-gray-500 rounded-lg hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 focus:outline-none"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
        
        <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-transform">
          U
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
