import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MessageSquare, Users, Settings, LogOut, Shield } from 'lucide-react';
import CallModal from './CallModal';

const DashboardLayout = () => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar Navigation */}
      <div className="w-20 lg:w-64 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0">
        <div className="p-4 flex items-center justify-center lg:justify-start lg:space-x-3 border-b border-slate-700 h-16">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
            SC
          </div>
          <span className="hidden lg:block font-bold text-xl tracking-tight">SecureChat</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-2 px-2">
          <NavLink 
            to="/chat" 
            className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}
          >
            <MessageSquare size={24} className="shrink-0" />
            <span className="hidden lg:block ml-3 font-medium">Chats</span>
          </NavLink>
          
          <NavLink 
            to="/friends" 
            className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}
          >
            <Users size={24} className="shrink-0" />
            <span className="hidden lg:block ml-3 font-medium">Friends</span>
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}
          >
            <Settings size={24} className="shrink-0" />
            <span className="hidden lg:block ml-3 font-medium">Profile</span>
          </NavLink>

          {currentUser?.role === 'admin' && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-slate-700 text-red-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-red-200'}`}
            >
              <Shield size={24} className="shrink-0" />
              <span className="hidden lg:block ml-3 font-medium">Admin Panel</span>
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center lg:justify-start w-full p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/30 rounded-lg transition-colors"
          >
            <LogOut size={24} className="shrink-0" />
            <span className="hidden lg:block ml-3 font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white">
                {currentUser?.username} 
                <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 uppercase">{currentUser?.role}</span>
            </h2>
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${currentUser?.status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                <span className="text-sm text-slate-400 capitalize">{currentUser?.status}</span>
            </div>
        </header>
        <main className="flex-1 overflow-hidden relative bg-slate-900">
          <Outlet />
        </main>
      </div>

      <CallModal />
    </div>
  );
};

export default DashboardLayout;