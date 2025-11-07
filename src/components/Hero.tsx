'use client';

import { Button } from './ui/button';
import Link from 'next/link';
import { Spotlight } from './ui/spotlight-new';
import Prism from './Prism';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative flex-1 flex items-center justify-center pt-32 pb-20 px-4 min-h-screen w-full">
      {/* Prism Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <Prism 
          animationType="rotate"
          transparent={true}
          scale={1.5}
          glow={1.5}
          noise={0.2}
          timeScale={0.8}
          bloom={1.2}
          height={5}
          baseWidth={8}
        />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 via-white to-neutral-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            >
              Share Files Across Devices
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-xl md:text-2xl text-neutral-300 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            >
              Transfer files between your devices instantly. No sign-up, no hassle, just simple file sharing.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="/CreateRoom">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 rounded-full"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>
      <Spotlight />
    </section>
  );
}

