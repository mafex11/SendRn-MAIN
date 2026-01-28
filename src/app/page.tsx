// src/app/page.tsx
'use client';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Link from 'next/link';
import Hero from '../components/Hero';
import SpotlightCard from '../components/SpotlightCard';
import { ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  FastWindIcon, 
  AnonymousIcon, 
  LaptopPhoneSyncIcon, 
  UserRemove01Icon 
} from '@hugeicons/core-free-icons';

const features = [
  {
    icon: FastWindIcon,
    title: "Lightning Fast",
    description: "Transfer files instantly across devices without delays or complications."
  },
  {
    icon: AnonymousIcon,
    title: "Secure & Private",
    description: "Your files are protected with secure rooms that only you can access."
  },
  {
    icon: LaptopPhoneSyncIcon,
    title: "Cross-Platform",
    description: "Works seamlessly on any device - desktop, tablet, or mobile."
  },
  {
    icon: UserRemove01Icon,
    title: "No Sign-Up Required",
    description: "Start sharing immediately without creating accounts or passwords."
  }
];

export default function Home() {
  return (
    <div className="w-full bg-zinc-950 text-white antialiased relative overflow-x-hidden">
      <div className="min-h-screen flex flex-col relative z-10 w-full">

        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section id="features" className="py-24 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                Why Choose Sendrn
              </h2>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                Everything you need for seamless file sharing
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <SpotlightCard 
                      className="h-full flex flex-col !bg-zinc-900/50 backdrop-blur-xl !border !border-white/20"
                      spotlightColor="rgba(255, 255, 255, 0.4)"
                    >
                      <div className="flex flex-col h-full">
                        <div className="mb-8 mt-4">
                          <div className="w-12 h-12 rounded-lg  flex items-center justify-center">
                            <HugeiconsIcon icon={feature.icon} className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-neutral-400 text-base flex-1 mb-6">
                          {feature.description}
                        </p>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative z-10 w-full ">
          <div className="w-full max-w-7xl mx-auto relative overflow-hidden rounded-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative overflow-hidden"
            >
              <Card className="border-neutral-800 bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 backdrop-blur-sm w-full relative z-10 ">
                <CardHeader className="text-center space-y-4">
                  <CardTitle className="text-3xl md:text-4xl font-bold text-white">
                    Ready to Get Started?
                  </CardTitle>
                  <CardDescription className="text-lg text-neutral-300">
                    Create a room and start sharing files across your devices in seconds.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-4">
                  <Link href="/CreateRoom">
                    <Button size="lg" className="text-lg px-8 py-6 group">
                      Create Your First Room
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              
              {/* White Glowing Ball */}
              <div className="absolute -right-50 top-1/2 -translate-y-1/2 blur-2xl">
              <div className="absolute right-16 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/90 blur-xl opacity-100 pointer-events-none"></div>
              <div className="absolute right-16 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-white/90 blur-2xl opacity-100 pointer-events-none"></div>
              <div className="absolute right-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/60 blur-xl opacity-100 pointer-events-none"></div>
              <div className="absolute right-16 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/80 blur-lg opacity-100 pointer-events-none"></div>
              <div className="absolute right-16 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white blur-md opacity-100 pointer-events-none"></div>
              </div>
              
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="py-12 px-4 border-t border-neutral-800"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-neutral-400">
                  Made by{' '}
                  <a 
                    href="https://github.com/mafex11" 
                    className="underline hover:text-white transition-colors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    @mafex11
                  </a>
                </p>
              </div>
              <div className="text-neutral-500 text-sm">
                © 2025 Mafex Inc. All rights reserved.
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}