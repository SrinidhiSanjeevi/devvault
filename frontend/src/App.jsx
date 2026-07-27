import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import Resources from './pages/Resources';
import Snippets from './pages/Snippets';
import Profile from './pages/Profile';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-color)]">
      {isAuthenticated && <Sidebar />}
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {isAuthenticated && (
          <Navbar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            setIsAuthenticated={setIsAuthenticated}
          />
        )}
        
        <main className="w-full grow p-6">
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
            />
            
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/snippets" 
              element={isAuthenticated ? <Snippets /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/resources" 
              element={isAuthenticated ? <Resources /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/commands" 
              element={isAuthenticated ? <div className="text-xl font-bold text-gray-500">Commands Module Coming Soon</div> : <Navigate to="/login" />} 
            />
            <Route 
              path="/notes" 
              element={isAuthenticated ? <Notes /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
