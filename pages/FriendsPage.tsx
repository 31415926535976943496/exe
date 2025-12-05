import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserPlus, Check, X, Clock } from 'lucide-react';

const FriendsPage = () => {
  const { users, currentUser, friendRequests, sendFriendRequest, respondToFriendRequest } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Users who are not me, and not already my friend, and no pending request
  const availableUsers = users.filter(u => {
    if (u.id === currentUser?.id) return false;
    // Check if relation exists
    const hasRelation = friendRequests.some(r => 
      (r.fromUserId === currentUser?.id && r.toUserId === u.id) ||
      (r.fromUserId === u.id && r.toUserId === currentUser?.id)
    );
    return !hasRelation;
  }).filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

  const pendingRequests = friendRequests.filter(r => r.toUserId === currentUser?.id && r.status === 'pending');
  const mySentRequests = friendRequests.filter(r => r.fromUserId === currentUser?.id && r.status === 'pending');

  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Friends & Requests</h1>

      {/* Incoming Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-emerald-400 flex items-center">
             Pending Requests <span className="ml-2 bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingRequests.map(req => {
              const requester = users.find(u => u.id === req.fromUserId);
              return (
                <div key={req.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                   <div className="flex items-center">
                     <img src={requester?.avatar} alt="" className="w-10 h-10 rounded-full mr-3" />
                     <span className="font-medium text-white">{requester?.username}</span>
                   </div>
                   <div className="flex space-x-2">
                     <button 
                        onClick={() => respondToFriendRequest(req.id, 'accepted')}
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white"
                     >
                       <Check size={18} />
                     </button>
                     <button 
                        onClick={() => respondToFriendRequest(req.id, 'rejected')}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                     >
                       <X size={18} />
                     </button>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Friends */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-white">Add New Friends</h2>
        <input 
            type="text" 
            placeholder="Search username..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableUsers.map(user => (
                <div key={user.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center hover:border-slate-500 transition-colors">
                    <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full mb-3" />
                    <h3 className="font-medium text-white mb-1">{user.username}</h3>
                    <p className="text-xs text-slate-400 mb-4">{user.status === 'online' ? 'Online' : 'Offline'}</p>
                    <button 
                        onClick={() => sendFriendRequest(user.id)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white flex items-center justify-center"
                    >
                        <UserPlus size={16} className="mr-2" /> Add Friend
                    </button>
                </div>
            ))}
            {availableUsers.length === 0 && (
                <p className="text-slate-500 col-span-full text-center py-4">No new users found.</p>
            )}
        </div>
      </div>

       {/* Sent Requests */}
       {mySentRequests.length > 0 && (
        <div className="opacity-75">
            <h2 className="text-sm font-semibold mb-3 text-slate-400 uppercase tracking-wider">Sent Requests</h2>
            <div className="grid gap-2 md:grid-cols-2">
                {mySentRequests.map(req => {
                    const target = users.find(u => u.id === req.toUserId);
                    return (
                        <div key={req.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between text-sm">
                            <div className="flex items-center text-slate-300">
                                <Clock size={14} className="mr-2" />
                                Waiting for {target?.username}...
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;