// src/app/createroom/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import FileRoom from '../../components/FileRoom';
import { Button } from '../../components/ui/button';
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';
// import PrismaticBurst from '../../components/PrismaticBurst';

// Create a separate client component for handling URL parameters
function CreateRoomClient() {
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const { setTheme } = useTheme();

  // Use useEffect with window.location instead of useSearchParams
  useEffect(() => {
    // Check for roomId in URL parameters using window.location
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRoomId = urlParams.get('roomId');
      if (urlRoomId) {
        setRoomId(urlRoomId);
      }
    }
  }, []);

  const createRoom = async () => {
    const response = await axios.post('/api/room/create');
    setRoomId(response.data.roomId);
  };

  const joinRoom = () => {
    setRoomId(inputRoomId);
  };

  return (
    <div className="min-h-screen w-full relative bg-zinc-950 flex flex-col overflow-x-hidden">
      {/*
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <PrismaticBurst
          intensity={2}
          speed={0.5}
          animationType="rotate3d"
          mixBlendMode="lighten"
          colors={[]}
          rayCount={0}
        />
      </div>
      */}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 pt-20 overflow-y-auto mt-6 z-10 relative">
        {!roomId ? (
          <div className="w-full max-w-2xl space-y-8 bg-white/10 dark:bg-gray-900/20 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/30">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-white to-gray-300 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Secure Sharing Room
              </h1>
              <div className="relative flex justify-center group">
                <h2
                  className="scroll-m-20 border-b border-white/20 dark:border-gray-600/30 text-center pb-4 text-xl font-medium tracking-wide text-gray-200 dark:text-gray-300"
                >
                  Create a private space for your personal content.
                </h2>
                <Image
                  src="/sus.png"
                  alt="Suspicious image"
                  width={100}
                  height={100}
                  className="hidden md:block absolute top-full mt-2 left-1/2 md:translate-x-60 -translate-y-18 opacity-0 group-hover:opacity-100 group-hover:animate-fadeInOut transition-opacity duration-200"
                />
              </div>
            </div>
            <div className="space-y-6 pt-4">
              <Button
                onClick={createRoom}
                className="w-full py-6 px-6 bg-white/20 text-white border border-white/30 hover:bg-zinc-800/50 font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                Create a New Room
              </Button>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <span className="text-gray-400 dark:text-gray-500 font-medium">OR</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
              <div className="space-y-4">
                <label className="block text-2xl font-semibold text-gray-400">
                  Already have a Room ID?
                </label>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="text"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value)}
                    className="flex-1 px-6 py-4 bg-white/20 border border-white/30 rounded-full text-white focus:bg-zinc-800/50 placeholder-gray-300  backdrop-blur-sm text-xl"
                    placeholder="Enter room ID"
                  />
                  <button
                    onClick={joinRoom}
                    className="px-8 py-4 bg-white/30 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg hover:bg-zinc-800/50 border border-white/30 sm:w-auto w-full"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <FileRoom roomId={roomId} />
        )}
        
      </main>
      <footer className="mt-8 text-center text-gray-600 dark:text-gray-400 relative z-10">
        Made by <a href="https://github.com/mafex11" className="underline" target="_blank" rel="noopener noreferrer">@mafex11</a> in a day. &lt;3
      </footer>

      <h1 className='text center flex-col mx-auto mb-6 mt-2 text-gray-500 relative z-10'>
      &copy;2025, Mafex Inc.
      </h1>
    
    </div>
  );
}

// Main component that renders the client component
export default function CreateRoom() {
  return <CreateRoomClient />;
}