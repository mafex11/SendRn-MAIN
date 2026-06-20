'use client';

import Link from 'next/link';
import { type ElementType } from 'react';
import { Github, Linkedin, Mail, Send, Timer, Users } from 'lucide-react';
import { motion } from 'framer-motion';

type Highlight = { title: string; description: string; icon: ElementType; color: string; bg: string };

const highlights: Highlight[] = [
  {
    title: 'Why Sendrn exists',
    description: 'You needed a way to move a file from your phone to an unfamiliar machine without logging into anything. Sendrn gives you a disposable room so you can print, send, or present on the spot.',
    icon: Send,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    title: 'Built for borrowed devices',
    description: 'Every room stays private. When done, close the room and walk away — nothing sticks around on that shared PC.',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    title: 'Shipped fast',
    description: 'The first version shipped in under 24 hours. Continuous tweaks keep it fast and reliable when you need it most.',
    icon: Timer,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl space-y-8"
      >
        <div className="space-y-3">
          <h1 className="font-display text-4xl text-stone-900">
            Built for real-world file hops
          </h1>
          <p className="text-lg text-stone-500 max-w-2xl">
            I'm Sudhanshu Pandit, a Final Year CSE student tired of logging into WhatsApp Web on every public computer to print a file. Sendrn is the practical fix.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Founder', value: 'Sudhanshu Pandit' },
            { label: 'Origin', value: 'College, 2024' },
            { label: 'Focus', value: 'Fast file transfer' },
          ].map(item => (
            <div key={item.label} className="glass rounded-2xl p-4">
              <p className="text-xs uppercase tracking-wider text-stone-400 font-medium">{item.label}</p>
              <p className="mt-1 text-stone-800 font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-3xl p-6 space-y-3"
              >
                <div className={`p-2.5 rounded-xl ${h.bg} w-fit`}>
                  <Icon className={`w-5 h-5 ${h.color}`} />
                </div>
                <h3 className="font-semibold text-stone-900">{h.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{h.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="glass rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-900">Get in touch</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: 'https://github.com/mafex11', label: 'GitHub', icon: Github },
              { href: 'https://www.linkedin.com/in/sudhanshu-pandit-17a126240/', label: 'LinkedIn', icon: Linkedin },
              { href: 'mailto:sudhanshu@sendrn.app', label: 'Email', icon: Mail },
            ].map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 text-stone-600 text-sm font-medium hover:bg-stone-200 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between glass rounded-2xl p-5">
          <p className="text-sm text-stone-400">Stress-tested on real printer-shop workflows.</p>
          <Link href="/CreateRoom">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Create room
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
