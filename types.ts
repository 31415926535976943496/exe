export interface User {
  id: string;
  username: string;
  password?: string; // Only stored in local state/simulated DB, not exposed to frontend normally
  role: 'admin' | 'user';
  status: 'online' | 'offline';
  lastSeen: string;
  ip?: string;
  location?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string; // 'group' or userId
  content: string;
  timestamp: number;
  type: 'text' | 'call_log';
  callType?: 'audio' | 'video';
  callDuration?: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

export interface CallState {
  isActive: boolean;
  isIncoming: boolean;
  callerId?: string;
  receiverId?: string; // Who I am calling
  type: 'audio' | 'video';
  startTime?: number;
}