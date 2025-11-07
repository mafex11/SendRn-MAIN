"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-4 left-0 right-0 w-[95%] md:w-3/4 mx-auto max-w-4xl z-50"
      >
        <div className="rounded-full bg-gray-950/20 backdrop-blur-sm border border-white/30 px-4 md:px-6 py-4 shadow-lg ">
          <div className="flex items-center justify-between">
            {/* Left Side - Brand */}
            <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
              <div className="w-8 h-8 relative">
                <Image
                  src="/Flow.png"
                  alt="Sendrn Logo"
                  width={30}
                  height={30}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <span className="text-xl font-semibold text-white">Sendrn</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="/About"
                className="text-white hover:opacity-80 transition-opacity"
              >
                About
              </Link>
              <Link 
                href="/ClickHere"
                className="text-white hover:opacity-80 transition-opacity"
              >
                Click Here
              </Link>
              <Link 
                href="/Donate"
                className="text-white hover:opacity-80 transition-opacity"
              >
                Donate
              </Link>
              <Link href="/CreateRoom">
                <Button
                  variant="outline"
                  className="bg-zinc-950 border-white/50 text-white hover:bg-zinc-800/50 rounded-full"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white p-2 hover:opacity-80 transition-opacity"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-md"
          >
            <div className="flex flex-col items-end justify-start h-full gap-6 pr-8 pt-40">
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                onClick={closeMenu}
                className="absolute top-7 right-6 text-white p-2 hover:opacity-80 transition-opacity"
                aria-label="Close menu"
              >
                <X className="w-8 h-8" />
              </motion.button>

              {/* Navigation Links */}
              {[
                { href: "/About", label: "About" },
                { href: "/ClickHere", label: "Click Here" },
                { href: "/Donate", label: "Donate" },
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="text-white text-3xl font-semibold hover:opacity-80 transition-opacity"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link href="/CreateRoom" onClick={closeMenu}>
                  <Button
                    variant="outline"
                    className="bg-zinc-950 border-white/50 text-white hover:bg-zinc-800/50 rounded-full text-2xl px-8 py-6"
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

