import { Link, useLocation } from 'react-router-dom';
import { Home, Code, Link as LinkIcon, Terminal, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Snippets', path: '/snippets', icon: Code },
    { name: 'Resources', path: '/resources', icon: LinkIcon },
    { name: 'Commands', path: '/commands', icon: Terminal },
    { name: 'Notes', path: '/notes', icon: Code }, // Reusing Code icon or similar
  ];

  return (
    <div className="flex flex-col w-64 h-full px-4 py-8 overflow-y-auto border-r bg-[var(--surface-color)] border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">DevVault</h2>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <nav>
          <Link
            to="/profile"
            className="flex items-center px-4 py-3 rounded-xl transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Settings className="w-5 h-5 mr-3" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
