import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Message, FriendRequest, CallState } from '../types';
import { fetchIpInfo } from '../services/ipService';
import toast from 'react-hot-toast';

interface AppContextType {
  isSiteUnlocked: boolean;
  unlockSite: (password: string) => boolean;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  addUser: (user: Partial<User>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  messages: Message[];
  sendMessage: (receiverId: string, content: string, type?: 'text' | 'call_log', callType?: 'audio' | 'video') => void;
  friendRequests: FriendRequest[];
  sendFriendRequest: (toUserId: string) => void;
  respondToFriendRequest: (requestId: string, status: 'accepted' | 'rejected') => void;
  callState: CallState;
  startCall: (receiverId: string, type: 'audio' | 'video') => void;
  endCall: () => void;
  acceptCall: () => void;
  sitePassword: string; // Only for admin display
  setSitePassword: (pwd: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Seed Data
const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  username: 'admin',
  password: '12345',
  role: 'admin',
  status: 'offline',
  lastSeen: new Date().toISOString(),
  ip: 'Unknown',
  location: 'Unknown',
  avatar: 'https://picsum.photos/seed/admin/200/200'
};

const DEFAULT_SITE_PASS = "1234";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Persisted State ---
  const [isSiteUnlocked, setIsSiteUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('site_unlocked') === 'true';
  });
  
  const [sitePassword, setSitePasswordState] = useState<string>(() => {
    return localStorage.getItem('site_password') || DEFAULT_SITE_PASS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('app_users');
    return stored ? JSON.parse(stored) : [DEFAULT_ADMIN];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem('app_messages');
    return stored ? JSON.parse(stored) : [];
  });

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    const stored = localStorage.getItem('app_friend_requests');
    return stored ? JSON.parse(stored) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('current_user');
    return stored ? JSON.parse(stored) : null;
  });

  // --- Volatile State ---
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isIncoming: false,
    type: 'audio'
  });

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('app_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('app_friend_requests', JSON.stringify(friendRequests));
  }, [friendRequests]);
  
  useEffect(() => {
    localStorage.setItem('site_password', sitePassword);
  }, [sitePassword]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('current_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('current_user');
    }
  }, [currentUser]);

  // --- Logic ---

  const setSitePassword = (pwd: string) => {
    setSitePasswordState(pwd);
  };

  const unlockSite = (password: string) => {
    if (password === sitePassword) {
      setIsSiteUnlocked(true);
      sessionStorage.setItem('site_unlocked', 'true');
      return true;
    }
    return false;
  };

  const login = async (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      // Simulate IP Fetch
      const ipInfo = await fetchIpInfo();
      
      const updatedUser = {
        ...user,
        status: 'online' as const,
        lastSeen: new Date().toISOString(),
        ip: ipInfo.ip,
        location: `${ipInfo.city}, ${ipInfo.country}`
      };
      
      // Update user in DB
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      setCurrentUser(updatedUser);
      toast.success(`Welcome back, ${user.username}`);
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    if (currentUser) {
       setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, status: 'offline', lastSeen: new Date().toISOString() } : u));
    }
    setCurrentUser(null);
    toast('Logged out');
  };

  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: userData.username || 'User',
      password: userData.password || '12345',
      role: userData.role || 'user',
      status: 'offline',
      lastSeen: new Date().toISOString(),
      ip: 'Pending',
      location: 'Pending',
      avatar: `https://picsum.photos/seed/${Date.now()}/200/200`
    };

    setUsers(prev => [...prev, newUser]);

    // Auto friend Admin
    const admin = users.find(u => u.role === 'admin');
    if (admin) {
        // Create an accepted friend request immediately to link them
        const reqId = `fr-${Date.now()}`;
        const autoFriend: FriendRequest = {
            id: reqId,
            fromUserId: admin.id,
            toUserId: newUser.id,
            status: 'accepted',
            timestamp: Date.now()
        };
        setFriendRequests(prev => [...prev, autoFriend]);
    }

    toast.success('User created successfully');
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
    toast.success('User updated');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('User deleted');
  };

  const sendMessage = (receiverId: string, content: string, type: 'text' | 'call_log' = 'text', callType?: 'audio' | 'video') => {
    if (!currentUser) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: Date.now(),
      type,
      callType
    };
    setMessages(prev => [...prev, msg]);
  };

  const sendFriendRequest = (toUserId: string) => {
    if (!currentUser) return;
    if (friendRequests.some(r => 
      (r.fromUserId === currentUser.id && r.toUserId === toUserId) ||
      (r.fromUserId === toUserId && r.toUserId === currentUser.id)
    )) {
      toast.error('Request already pending or you are already friends.');
      return;
    }

    const req: FriendRequest = {
      id: `fr-${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId,
      status: 'pending',
      timestamp: Date.now()
    };
    setFriendRequests(prev => [...prev, req]);
    toast.success('Friend request sent');
  };

  const respondToFriendRequest = (requestId: string, status: 'accepted' | 'rejected') => {
    setFriendRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    if (status === 'accepted') toast.success('Friend added!');
  };

  // --- Call Simulation ---
  const startCall = (receiverId: string, type: 'audio' | 'video') => {
    setCallState({
      isActive: true,
      isIncoming: false,
      callerId: currentUser?.id,
      receiverId,
      type
    });
    // Simulate call log message
    sendMessage(receiverId, `Started ${type} call`, 'call_log', type);
  };

  const endCall = () => {
    setCallState({ isActive: false, isIncoming: false, type: 'audio' });
    toast('Call ended');
  };

  const acceptCall = () => {
     setCallState(prev => ({ ...prev, isIncoming: false, startTime: Date.now() }));
  };

  return (
    <AppContext.Provider value={{
      isSiteUnlocked, unlockSite, currentUser, login, logout,
      users, addUser, updateUser, deleteUser,
      messages, sendMessage,
      friendRequests, sendFriendRequest, respondToFriendRequest,
      callState, startCall, endCall, acceptCall,
      sitePassword, setSitePassword
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};