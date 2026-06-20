'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from "sonner";
import { Loader2, Rocket, ShieldCheck, Zap } from "lucide-react";
import { motion } from 'framer-motion';
import { type ElementType } from 'react';

type DonationTier = { amount: number; label: string; description: string; icon: ElementType; color: string; bg: string };

type RazorpayCheckoutOptions = {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: () => void;
  prefill: { name: string; email: string };
  theme: { color: string };
};
type RazorpayInstance = { open: () => void };
type RazorpayWindow = Window & { Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance };

const tiers: DonationTier[] = [
  { amount: 5, label: 'Keep the lights on', description: 'Covers basic hosting.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { amount: 15, label: 'Speed upgrades', description: 'Funds bandwidth spikes.', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  { amount: 40, label: 'Build the future', description: 'Backs new features.', icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-50' },
];

const loadRazorpayScript = () => new Promise<void>((resolve, reject) => {
  if (typeof window === 'undefined') { reject(new Error('No window')); return; }
  if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) { resolve(); return; }
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Failed to load Razorpay'));
  document.body.appendChild(script);
});

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const formattedAmount = useMemo(() => amount.toFixed(2), [amount]);

  const handleDonation = async () => {
    if (amount <= 0 || Number.isNaN(amount)) { toast.error('Enter a valid amount.'); return; }
    setIsLoading(true);
    try {
      await loadRazorpayScript();
      const ctor = (window as RazorpayWindow).Razorpay;
      if (typeof ctor !== 'function') throw new Error('Razorpay unavailable');
      const res = await fetch('/api/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: amount * 100 }) });
      if (!res.ok) throw new Error('Order failed');
      const order = await res.json();
      new ctor({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100),
        currency: 'USD',
        name: 'Sendrn',
        description: 'Support Sendrn',
        order_id: order.id,
        handler: () => { toast.success('Thanks for your support!'); },
        prefill: { name: '', email: '' },
        theme: { color: '#1c1917' },
      }).open();
    } catch { toast.error('Payment failed. Please try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl space-y-8"
      >
        <div className="space-y-3">
          <h1 className="font-display text-4xl text-stone-900">Keep Sendrn running</h1>
          <p className="text-lg text-stone-500">
            Donations cover hosting, bandwidth, and experiments that keep file rooms instant.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <motion.button
                key={tier.amount}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setAmount(tier.amount)}
                className={`glass rounded-3xl p-5 text-left transition-all ${
                  amount === tier.amount ? 'ring-2 ring-stone-900/20 shadow-md' : ''
                }`}
              >
                <div className={`p-2 rounded-xl ${tier.bg} w-fit mb-3`}>
                  <Icon className={`w-4 h-4 ${tier.color}`} />
                </div>
                <p className="font-bold text-stone-900 text-lg">${tier.amount}</p>
                <p className="text-xs text-stone-500 mt-0.5">{tier.label}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="glass rounded-3xl p-6 space-y-4">
          <label htmlFor="custom-amount" className="text-sm font-medium text-stone-500">Custom amount (USD)</label>
          <input
            id="custom-amount"
            type="number"
            min="1"
            value={Number.isNaN(amount) ? '' : amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-shadow"
            placeholder="Enter amount"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDonation}
            disabled={isLoading || amount <= 0 || Number.isNaN(amount)}
            className="w-full py-4 rounded-2xl bg-stone-900 text-white font-medium hover:bg-stone-800 disabled:opacity-40 transition-all shadow-lg shadow-stone-900/10"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              `Donate $${formattedAmount}`
            )}
          </motion.button>
        </div>

        <div className="flex items-center justify-between glass rounded-2xl p-5">
          <p className="text-sm text-stone-400">Want recurring support?</p>
          <Link
            href="mailto:sudhanshu@sendrn.app"
            className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 text-sm font-medium hover:bg-stone-200 transition-colors"
          >
            Email Sudhanshu
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
