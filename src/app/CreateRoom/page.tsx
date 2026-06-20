'use client';

import { useState, useEffect } from 'react';
import FileRoom from '../../components/FileRoom';
import { motion } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';

function CreateRoomClient() {
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRoomId = urlParams.get('roomId');
      if (urlRoomId) setRoomId(urlRoomId);
    }
  }, []);

  const createRoom = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/room/create', { method: 'POST' });
      const data = await response.json();
      setRoomId(data.roomId);
    } catch { /* retry */ }
    finally { setIsCreating(false); }
  };

  const joinRoom = () => {
    if (inputRoomId.trim()) setRoomId(inputRoomId.trim());
  };

  if (roomId) {
    return (
      <div className="min-h-screen w-full flex flex-col pt-28 pb-12 px-5">
        <FileRoom roomId={roomId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl text-stone-900">Start sharing</h1>
          <p className="text-stone-500">Create a new room or join an existing one</p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createRoom}
            disabled={isCreating}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-stone-900 text-white font-medium text-base shadow-lg shadow-stone-900/10 hover:bg-stone-800 transition-colors disabled:opacity-60"
          >
            <Plus className="w-5 h-5" />
            {isCreating ? 'Creating...' : 'Create new room'}
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-stone-400 text-sm">or join existing</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
              className="flex-1 px-4 py-3 rounded-xl glass text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-shadow border-0"
              placeholder="Enter room code"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={joinRoom}
              disabled={!inputRoomId.trim()}
              className="px-4 py-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-30 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CreateRoom() {
  return <CreateRoomClient />;
}
