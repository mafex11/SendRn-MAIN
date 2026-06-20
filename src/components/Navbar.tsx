"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/About", label: "About" },
  { href: "/Donate", label: "Support" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-5 left-0 right-0 z-50 mx-auto w-[90%] max-w-lg"
      >
        <div className="glass-strong rounded-2xl px-5 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/Flow.png" alt="Sendrn" width={26} height={26} className="rounded-full" />
              <span className="text-lg font-semibold text-stone-900">Sendrn</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-black/[0.04] transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/CreateRoom" className="ml-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium shadow-sm hover:bg-stone-800 transition-colors"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-stone-700 p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-stone-600 p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            {navLinks.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-display text-stone-800 hover:text-orange-600 transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Link href="/CreateRoom" onClick={() => setIsOpen(false)}>
                <button className="rounded-2xl bg-stone-900 text-white text-xl px-8 py-4 font-medium">
                  Get Started
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
