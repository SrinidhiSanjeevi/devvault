import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md card p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">DevVault</h1>
          <p className="text-gray-500">Sign in to your knowledge vault</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm text-center">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required
              className="input-field" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="w-full btn btn-primary py-3 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
