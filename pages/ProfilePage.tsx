import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Save, Lock, MapPin, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { currentUser, updateUser, sitePassword, setSitePassword } = useAppContext();
  const [newPassword, setNewPassword] = useState('');
  const [newSitePassword, setNewSitePassword] = useState('');
  
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (newPassword.length < 3) {
      toast.error('Password too short');
      return;
    }
    updateUser(currentUser.id, { password: newPassword });
    setNewPassword('');
    toast.success('Your password has been updated');
  };

  const handleUpdateSitePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSitePassword.length < 3) return;
    setSitePassword(newSitePassword);
    setNewSitePassword('');
    toast.success('System Start Password updated');
  };

  if (!currentUser) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-white">My Profile</h1>

      {/* User Info Card */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
        <div className="flex items-center space-x-6">
            <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-700" />
            <div>
                <h2 className="text-xl font-bold text-white">{currentUser.username}</h2>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300 uppercase font-semibold tracking-wider">
                    {currentUser.role}
                </span>
                <div className="mt-4 flex items-center text-slate-400 text-sm">
                    <MapPin size={16} className="mr-1" /> {currentUser.location || 'Location Unknown'}
                </div>
                 <div className="mt-1 flex items-center text-slate-400 text-sm">
                    <Monitor size={16} className="mr-1" /> IP: {currentUser.ip || 'Unknown'}
                </div>
            </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Lock size={20} className="mr-2 text-blue-400" /> Change My Password
        </h3>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter new password"
                />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium flex items-center">
                <Save size={16} className="mr-2" /> Update Password
            </button>
        </form>
      </div>

      {/* Admin Settings */}
      {currentUser.role === 'admin' && (
        <div className="bg-slate-800 rounded-xl p-6 border border-red-900/50 shadow-lg">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
                <Lock size={20} className="mr-2" /> Admin System Settings
            </h3>
            <div className="mb-4 p-3 bg-slate-900 rounded border border-slate-700">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Current System Start Password</p>
                <p className="font-mono text-xl text-white tracking-widest">{sitePassword}</p>
            </div>
            <form onSubmit={handleUpdateSitePassword} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Update System Start Password</label>
                    <input
                        type="text"
                        value={newSitePassword}
                        onChange={(e) => setNewSitePassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                        placeholder="New system lock password"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium flex items-center">
                    <Save size={16} className="mr-2" /> Update System Lock
                </button>
            </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;