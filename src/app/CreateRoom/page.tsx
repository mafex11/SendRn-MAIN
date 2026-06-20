'use client';

import { useState, useEffect } from 'react';
import FileRoom from '../../components/FileRoom';
import { Button } from '../../components/ui/button';
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
      if (urlRoomId) {
        setRoomId(urlRoomId);
      }
    }
  }, []);

  const createRoom = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/room/create', { method: 'POST' });
      const data = await response.json();
      setRoomId(data.roomId);
    } catch {
      // Retry silently
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = () => {
    if (inputRoomId.trim()) {
      setRoomId(inputRoomId.trim());
    }
  };

  if (roomId) {
    return (
      <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4">
        <FileRoom roomId={roomId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Start sharing
          </h1>
          <p className="text-white/50">
            Create a new room or join an existing one
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={createRoom}
            disabled={isCreating}
            className="w-full py-6 rounded-2xl bg-white text-black hover:bg-white/90 font-medium text-base group"
          >
            <Plus className="w-5 h-5 mr-2" />
            {isCreating ? 'Creating...' : 'Create new room'}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-sm">or join existing</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/25 transition-colors"
              placeholder="Enter room code"
            />
            <Button
              onClick={joinRoom}
              disabled={!inputRoomId.trim()}
              className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/15 disabled:opacity-30"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CreateRoom() {
  return <CreateRoomClient />;
}
