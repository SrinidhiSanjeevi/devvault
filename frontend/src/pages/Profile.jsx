import { useState, useEffect } from 'react';
import { User as UserIcon, Mail } from 'lucide-react';
import api from '../api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="flex justify-center mt-20"><div className="w-10 h-10 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Profile</h1>
      {profile && (
        <div className="card p-8 flex flex-col items-center sm:flex-row sm:items-start gap-8 border border-gray-200 dark:border-gray-800">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              <div className="flex items-center justify-center sm:justify-start text-gray-500 dark:text-gray-400 mt-2">
                <Mail className="w-4 h-4 mr-2" />
                <span>{profile.email}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <UserIcon className="w-4 h-4 mr-2" />
                <span>Account ID: {profile._id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
