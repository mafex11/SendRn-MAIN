'use client';

import Link from 'next/link';
import Hero from '../components/Hero';
import { ArrowRight, Zap, Shield, Monitor, UserX } from "lucide-react";
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: "Instant Transfer",
    description: "Upload on one device, download on the other. Zero waiting.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Shield,
    title: "Private Rooms",
    description: "Each room has a unique code. Only people with it can access files.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Monitor,
    title: "Any Device",
    description: "Phone, tablet, laptop, library PC — if it has a browser, it works.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: UserX,
    title: "Zero Accounts",
    description: "No sign-up, no passwords, no email. Just open and share.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  }
];

const steps = [
  { num: "1", title: "Create a room", desc: "One click generates a unique room code" },
  { num: "2", title: "Share the code", desc: "Scan the QR or type the 6-char code on your other device" },
  { num: "3", title: "Transfer", desc: "Drop files or paste text — grab them on the other side" },
];

export default function Home() {
  return (
    <div className="w-full antialiased relative overflow-x-hidden">
      <Hero />

      {/* How it works */}
      <section id="how" className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl text-stone-900 mb-3">
              Three steps. That&apos;s it.
            </h2>
            <p className="text-stone-500 text-lg max-w-md mx-auto">
              No downloads, no accounts, no friction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-3xl p-7 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-1.5">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl text-stone-900 mb-3">
              Built for real life
            </h2>
            <p className="text-stone-500 text-lg max-w-md mx-auto">
              No more emailing yourself or battling cloud drive logins on public machines.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-3xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${feature.bg}`}>
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-stone-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center glass-strong rounded-[2rem] p-10 space-y-5"
          >
            <h2 className="font-display text-2xl md:text-3xl text-stone-900">
              Ready to transfer?
            </h2>
            <p className="text-stone-500 max-w-sm mx-auto">
              Create a room in one click. Share the code or scan the QR on your other device.
            </p>
            <Link href="/CreateRoom">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-stone-900 text-white font-medium shadow-lg shadow-stone-900/10 hover:bg-stone-800 transition-colors mt-2"
              >
                Create a room
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-5 border-t border-black/[0.04]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-400 text-sm">
            Made by{' '}
            <a
              href="https://github.com/mafex11"
              className="text-stone-600 hover:text-stone-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              @mafex11
            </a>
          </p>
          <p className="text-stone-300 text-xs">
            © 2025 Sendrn
          </p>
        </div>
      </footer>
    </div>
  );
}
