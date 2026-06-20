'use client';

import { Button } from '../components/ui/button';
import Link from 'next/link';
import Hero from '../components/Hero';
import { ArrowRight, Zap, Shield, Monitor, UserX } from "lucide-react";
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: "Instant Transfer",
    description: "Upload on one device, download on the other. No waiting, no complications."
  },
  {
    icon: Shield,
    title: "Private Rooms",
    description: "Each room is isolated with a unique code. Only people with the code can access files."
  },
  {
    icon: Monitor,
    title: "Any Device",
    description: "Works in any browser — phone, tablet, laptop, library PC. No app needed."
  },
  {
    icon: UserX,
    title: "Zero Accounts",
    description: "No sign-up, no passwords, no email verification. Just open and share."
  }
];

export default function Home() {
  return (
    <div className="w-full text-white antialiased relative overflow-x-hidden">
      <div className="min-h-screen flex flex-col relative z-10 w-full">
        <Hero />

        {/* Features */}
        <section id="features" className="py-24 px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                Built for real-world file sharing
              </h2>
              <p className="text-lg text-white/50 max-w-lg mx-auto">
                No more emailing yourself or logging into cloud drives on public machines.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-white/[0.06]">
                      <feature.icon className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">
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
        <section className="py-24 px-4 relative z-10 w-full">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center space-y-6 p-10 rounded-3xl bg-white/[0.03] border border-white/[0.08]"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Ready to transfer?
              </h2>
              <p className="text-white/50 max-w-md mx-auto">
                Create a room in one click. Share the code or scan the QR on your other device.
              </p>
              <Link href="/CreateRoom">
                <Button size="lg" className="text-base px-7 py-6 rounded-full bg-white text-black hover:bg-white/90 font-medium group mt-4">
                  Create a room
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-sm">
              Made by{' '}
              <a
                href="https://github.com/mafex11"
                className="text-white/60 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                @mafex11
              </a>
            </p>
            <p className="text-white/30 text-xs">
              © 2025 Sendrn
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
