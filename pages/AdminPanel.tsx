import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, UserPlus, Monitor, MapPin, Key } from 'lucide-react';
import { User } from '../types';

const AdminPanel = () => {
  const { users, deleteUser, addUser, updateUser } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ username: '', password: '' });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserForm.username && newUserForm.password) {
      addUser({
        username: newUserForm.username,
        password: newUserForm.password,
        role: 'user'
      });
      setShowAddModal(false);
      setNewUserForm({ username: '', password: '' });
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center font-medium shadow-lg transition-all"
        >
          <UserPlus size={20} className="mr-2" /> Create User
        </button>
      </div>

      {/* User Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-700/50 text-slate-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">IP Address</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Password</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="p-4">
                            <div className="flex items-center">
                                <img src={user.avatar} className="w-10 h-10 rounded-full mr-3" alt="" />
                                <div>
                                    <div className="font-medium text-white">{user.username}</div>
                                    <div className="text-xs text-slate-500">{user.role}</div>
                                </div>
                            </div>
                        </td>
                        <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === 'online' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-600 text-slate-300'
                            }`}>
                                {user.status === 'online' ? 'Active' : 'Offline'}
                            </span>
                        </td>
                        <td className="p-4 text-slate-300 text-sm font-mono">
                           <div className="flex items-center">
                                <Monitor size={14} className="mr-2 text-slate-500" />
                                {user.ip || '---'}
                           </div>
                        </td>
                        <td className="p-4 text-slate-300 text-sm">
                            <div className="flex items-center">
                                <MapPin size={14} className="mr-2 text-slate-500" />
                                {user.location || '---'}
                           </div>
                        </td>
                        <td className="p-4 text-slate-400 text-sm font-mono">
                             <div className="flex items-center group cursor-pointer relative">
                                <Key size={14} className="mr-2" />
                                <span className="blur-sm group-hover:blur-none transition-all">{user.password}</span>
                             </div>
                        </td>
                        <td className="p-4 text-right">
                            {user.role !== 'admin' && (
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete User"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-6">Create New User</h2>
                <form onSubmit={handleCreateUser}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                            <input
                                type="text"
                                required
                                value={newUserForm.username}
                                onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Initial Password</label>
                            <input
                                type="text"
                                required
                                value={newUserForm.password}
                                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;