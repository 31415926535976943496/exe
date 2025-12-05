import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const LockScreen = () => {
  const [password, setPassword] = useState('');
  const { unlockSite } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockSite(password)) {
      toast.success('Access Granted');
    } else {
      toast.error('Access Denied');
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-blue-600 rounded-full mb-4 animate-pulse">
            <Lock size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-center">System Locked</h2>
          <p className="mt-2 text-center text-slate-400">Enter startup password to proceed</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter Password"
            />
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
          >
            Unlock System
          </button>
        </form>
      </div>
    </div>
  );
};

export default LockScreen;