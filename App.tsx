import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './components/Login';
import LockScreen from './components/LockScreen';
import DashboardLayout from './components/DashboardLayout';
import AdminPanel from './pages/AdminPanel';
import ChatPage from './pages/ChatPage';
import FriendsPage from './pages/FriendsPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser, isSiteUnlocked } = useAppContext();

  if (!isSiteUnlocked) {
    return <Navigate to="/lock" replace />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { isSiteUnlocked } = useAppContext();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-900 text-white">
      <Routes>
        <Route path="/lock" element={isSiteUnlocked ? <Navigate to="/login" /> : <LockScreen />} />
        <Route path="/login" element={!isSiteUnlocked ? <Navigate to="/lock" /> : <Login />} />
        
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/chat" />} />
          <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#334155',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </HashRouter>
  );
}