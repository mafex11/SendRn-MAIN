'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-screen pt-28 pb-20 px-5">
      <div className="max-w-3xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-stone-600 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            No sign-up needed
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] text-stone-900"
          >
            Send files between
            <br />
            <span className="text-orange-500">any device</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-stone-500 max-w-md mx-auto leading-relaxed"
          >
            Open a room, scan the code, transfer. Works on any browser, any device, no apps to install.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <Link href="/CreateRoom">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-stone-900 text-white font-medium text-base shadow-lg shadow-stone-900/10 hover:bg-stone-800 transition-colors"
              >
                Start sharing
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl glass text-stone-700 font-medium text-base hover:bg-white/70 transition-colors"
            >
              How it works
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
