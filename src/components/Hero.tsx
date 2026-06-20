'use client';

import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative flex-1 flex items-center justify-center pt-32 pb-20 px-4 min-h-screen w-full">
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            No sign-up required
          </motion.div>

          <div className="space-y-5">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white"
            >
              Send files between
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400">
                any device
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed"
            >
              Open a room, scan the QR code, and transfer. No accounts, no apps, just instant file sharing.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <Link href="/CreateRoom">
              <Button size="lg" className="text-base px-7 py-6 rounded-full bg-white text-black hover:bg-white/90 font-medium group">
                Start sharing
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-7 py-6 rounded-full border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white font-medium"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              How it works
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
