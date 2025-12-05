import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, Phone, Video, Search, User as UserIcon } from 'lucide-react';
import { User, Message, FriendRequest } from '../types';

const ChatPage = () => {
  const { currentUser, users, messages, sendMessage, startCall, friendRequests } = useAppContext();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter friends: users where there is an 'accepted' friend request with current user
  const friends = users.filter(u => {
    if (u.id === currentUser?.id) return false;
    // Check friendship
    const isFriend = friendRequests.some(r => 
      r.status === 'accepted' && 
      ((r.fromUserId === currentUser?.id && r.toUserId === u.id) || 
       (r.fromUserId === u.id && r.toUserId === currentUser?.id))
    );
    return isFriend;
  }).filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

  const selectedUser = users.find(u => u.id === selectedUserId);

  const currentChatMessages = messages.filter(m => 
    (m.senderId === currentUser?.id && m.receiverId === selectedUserId) ||
    (m.senderId === selectedUserId && m.receiverId === currentUser?.id)
  ).sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !messageInput.trim()) return;
    sendMessage(selectedUserId, messageInput);
    setMessageInput('');
  };

  return (
    <div className="flex h-full">
      {/* Friend List */}
      <div className="w-full md:w-80 border-r border-slate-700 bg-slate-800/50 flex flex-col">
        <div className="p-4 border-b border-slate-700">
            <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search friends..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {friends.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-sm">
                    No friends found. Go to 'Friends' tab to add people.
                </div>
            ) : (
                friends.map(friend => (
                    <div 
                        key={friend.id}
                        onClick={() => setSelectedUserId(friend.id)}
                        className={`p-4 flex items-center cursor-pointer hover:bg-slate-700/50 transition-colors ${selectedUserId === friend.id ? 'bg-slate-700' : ''}`}
                    >
                        <div className="relative shrink-0">
                            <img src={friend.avatar} alt={friend.username} className="w-10 h-10 rounded-full bg-slate-600 object-cover" />
                            {friend.status === 'online' && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-800 rounded-full"></span>
                            )}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <h4 className="text-sm font-medium text-white truncate">{friend.username}</h4>
                            <p className="text-xs text-slate-400 truncate">
                                {friend.status === 'online' ? 'Active now' : `Last seen: ${new Date(friend.lastSeen).toLocaleTimeString()}`}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900">
        {selectedUser ? (
            <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
                    <div className="flex items-center">
                        <img src={selectedUser.avatar} alt={selectedUser.username} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                            <h3 className="font-semibold text-white">{selectedUser.username}</h3>
                            <span className={`text-xs ${selectedUser.status === 'online' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {selectedUser.status === 'online' ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => startCall(selectedUser.id, 'audio')} className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors">
                            <Phone size={20} />
                        </button>
                        <button onClick={() => startCall(selectedUser.id, 'video')} className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-blue-400 transition-colors">
                            <Video size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentChatMessages.map((msg) => {
                        const isMe = msg.senderId === currentUser?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                                    msg.type === 'call_log' 
                                        ? 'bg-slate-800 text-slate-400 italic border border-slate-700 mx-auto'
                                        : isMe 
                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                            : 'bg-slate-700 text-slate-200 rounded-bl-none'
                                }`}>
                                    {msg.content}
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-700 bg-slate-800/30">
                    <form onSubmit={handleSend} className="flex space-x-2">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                        <button 
                            type="submit" 
                            disabled={!messageInput.trim()}
                            className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <UserIcon size={32} />
                </div>
                <p>Select a friend to start chatting</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;