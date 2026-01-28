'use client';

import Link from 'next/link';
import { type ElementType } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
// import PrismaticBurst from '../../components/PrismaticBurst';
import { Github, Linkedin, Mail, Send, Timer, Users } from 'lucide-react';

type Highlight = {
  title: string;
  description: string;
  icon: ElementType;
};

type Snapshot = {
  label: string;
  value: string;
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
    title: 'Ship speed',
    description:
      'The first version shipped in under 24 hours because the pain was real. Continuous tweaks keep it fast and reliable the moment you need it.',
    icon: Timer,
  },
];

const snapshots: Snapshot[] = [
  { label: 'Founder', value: 'Sudhanshu Pandit' },
  { label: 'Origin', value: 'College, 2024' },
  { label: 'Core focus', value: 'Fast file transfer' },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white">
      {/*
      <div className="absolute inset-0 z-0">
        <PrismaticBurst
          intensity={2.2}
          speed={0.45}
          animationType="rotate3d"
          mixBlendMode="screen"
          colors={["#ffffff", "#38bdf8", "#a855f7", "#f97316"]}
          rayCount={10}
          distort={6}
        />
      </div>
      */}

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-28">
        <div className="w-full max-w-4xl space-y-10 rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl">
          <Card className="border-white/20 bg-black/50 text-white">
            <CardHeader className="space-y-4">
              <CardTitle className="text-4xl font-bold tracking-tight">Sendrn is built for your real-world file hops</CardTitle>
              <CardDescription className="text-lg text-neutral-300">
                I am Sudhanshu Pandit, a Final Year CSE student who was tired of logging into web whatsapp on every public computer to print a simple file. Sendrn is the practical fix for that scramble.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              {snapshots.map((snapshot) => (
                <div key={snapshot.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-sm uppercase tracking-wide text-neutral-400">{snapshot.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{snapshot.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <Card key={highlight.title} className="border-white/15 bg-black/60 text-white">
                  <CardHeader className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{highlight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-neutral-300">{highlight.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-white/20 bg-black/60 text-white">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Stay in the loop</CardTitle>
              <CardDescription className="text-neutral-300">
                Reach out if you have feedback or want to pair on the next upgrade.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row">
              <Button variant="outline" className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20" asChild>
                <Link href="mailto:sudhanshu@sendrn.app" aria-label="Email Sudhanshu">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Sudhanshu
                </Link>
              </Button>
              <Button variant="outline" className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20" asChild>
                <Link href="https://www.linkedin.com/in/sudhanshu-pandit-17a126240/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                  <Linkedin className="mr-2 h-5 w-5" />
                  LinkedIn
                </Link>
              </Button>
              <Button variant="outline" className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20" asChild>
                <Link href="https://github.com/mafex11" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-transparent text-neutral-300">
            <CardContent className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-sm">
                Every feature is stress-tested on real printer-shop workflows so you spend time printing, not juggling accounts.
              </p>
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href="/CreateRoom">Create your room</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
