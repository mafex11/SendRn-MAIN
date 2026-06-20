'use client';

import Link from 'next/link';
import { type ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Send, Timer, Users } from 'lucide-react';
import { motion } from 'framer-motion';

type Highlight = {
  title: string;
  description: string;
  icon: ElementType;
};

const highlights: Highlight[] = [
  {
    title: 'Why Sendrn exists',
    description:
      'You needed a way to move a file from your phone to an unfamiliar machine without logging into anything. Sendrn gives you a disposable room and a quick code so you can print, send, or present on the spot.',
    icon: Send,
  },
  {
    title: 'Built for borrowed devices',
    description:
      'Every room stays private to people you invite. When the job is done, close the room and walk away knowing nothing sticks around on that shared PC.',
    icon: Users,
  },
  {
    title: 'Shipped fast',
    description:
      'The first version shipped in under 24 hours because the pain was real. Continuous tweaks keep it fast and reliable the moment you need it.',
    icon: Timer,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full text-white flex items-center justify-center px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Built for real-world file hops
          </h1>
          <p className="text-lg text-white/50 max-w-2xl">
            I'm Sudhanshu Pandit, a Final Year CSE student tired of logging into WhatsApp Web on every public computer to print a file. Sendrn is the practical fix.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Founder', value: 'Sudhanshu Pandit' },
            { label: 'Origin', value: 'College, 2024' },
            { label: 'Focus', value: 'Fast file transfer' },
          ].map(item => (
            <div key={item.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <p className="text-xs uppercase tracking-wider text-white/40">{item.label}</p>
              <p className="mt-1 text-white font-medium">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="p-2.5 rounded-xl bg-white/[0.06] w-fit">
                  <Icon className="w-5 h-5 text-white/70" />
                </div>
                <h3 className="font-semibold text-white">{h.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{h.description}</p>
              </div>
            );
          })}
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <h2 className="text-xl font-semibold text-white">Get in touch</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" asChild>
              <Link href="https://github.com/mafex11" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" asChild>
              <Link href="https://www.linkedin.com/in/sudhanshu-pandit-17a126240/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Link>
            </Button>
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white" asChild>
              <Link href="mailto:sudhanshu@sendrn.app">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <p className="text-sm text-white/40">
            Stress-tested on real printer-shop workflows.
          </p>
          <Link href="/CreateRoom">
            <Button size="sm" className="rounded-xl bg-white text-black hover:bg-white/90">
              Create room
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
