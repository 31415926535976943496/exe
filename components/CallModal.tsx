import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Phone, Video, PhoneOff, Mic, MicOff, VideoOff } from 'lucide-react';

const CallModal = () => {
  const { callState, endCall, acceptCall, users } = useAppContext();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [duration, setDuration] = useState(0);

  const otherUserId = callState.receiverId;
  const otherUser = users.find(u => u.id === otherUserId);

  useEffect(() => {
    let interval: any;
    if (callState.isActive && !callState.isIncoming) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [callState.isActive, callState.isIncoming]);

  if (!callState.isActive) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col items-center p-8 space-y-8 relative">
        
        {/* Status */}
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-slate-700 mx-auto mb-4 overflow-hidden border-4 border-slate-600">
            <img src={otherUser?.avatar || 'https://picsum.photos/200'} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-bold text-white">{otherUser?.username || 'Unknown User'}</h3>
          <p className="text-emerald-400 animate-pulse mt-2">
            {callState.isIncoming ? 'Incoming Call...' : callState.type === 'video' ? 'Video Call...' : 'Audio Call...'}
          </p>
          {!callState.isIncoming && <p className="text-slate-400 mt-1">{formatTime(duration)}</p>}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
            {!callState.isIncoming && (
                <>
                <button 
                    onClick={() => setMicOn(!micOn)} 
                    className={`p-4 rounded-full transition-colors ${micOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500/20 text-red-500'}`}
                >
                    {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                {callState.type === 'video' && (
                    <button 
                        onClick={() => setCamOn(!camOn)} 
                        className={`p-4 rounded-full transition-colors ${camOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500/20 text-red-500'}`}
                    >
                        {camOn ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>
                )}
                </>
            )}

            {callState.isIncoming ? (
                <>
                    <button 
                        onClick={endCall} 
                        className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-transform hover:scale-110"
                    >
                        <PhoneOff size={28} />
                    </button>
                    <button 
                        onClick={acceptCall} 
                        className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-transform hover:scale-110 animate-bounce"
                    >
                        <Phone size={28} />
                    </button>
                </>
            ) : (
                <button 
                    onClick={endCall} 
                    className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-transform hover:scale-110"
                >
                    <PhoneOff size={28} />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default CallModal;