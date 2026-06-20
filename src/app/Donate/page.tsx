'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Rocket, ShieldCheck, Zap } from "lucide-react";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { type ElementType } from 'react';

type DonationTier = {
  amount: number;
  label: string;
  description: string;
  icon: ElementType;
};

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
type RazorpayWindow = Window & {
  Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
};

const tiers: DonationTier[] = [
  {
    amount: 5,
    label: 'Keep the lights on',
    description: 'Covers basic hosting that keeps Sendrn online.',
    icon: ShieldCheck,
  },
  {
    amount: 15,
    label: 'Speed upgrades',
    description: 'Funds bandwidth spikes during peak usage.',
    icon: Zap,
  },
  {
    amount: 40,
    label: 'Build the future',
    description: 'Backs features like reusable rooms and better pairing.',
    icon: Rocket,
  },
];

const presetAmounts = tiers.map((t) => t.amount);

const loadRazorpayScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') { reject(new Error('No window')); return; }
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(); return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
};

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(presetAmounts[0]);
  const [isLoading, setIsLoading] = useState(false);

  const formattedAmount = useMemo(() => amount.toFixed(2), [amount]);

  const handleDonation = async () => {
    if (amount <= 0 || Number.isNaN(amount)) {
      toast.error('Enter an amount greater than zero.');
      return;
    }

    setIsLoading(true);
    try {
      await loadRazorpayScript();
      const razorpayCtor = (window as RazorpayWindow).Razorpay;
      if (typeof razorpayCtor !== 'function') throw new Error('Razorpay unavailable');

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100 }),
      });
      if (!res.ok) throw new Error('Order creation failed');
      const order = await res.json();

      const options: RazorpayCheckoutOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100),
        currency: 'USD',
        name: 'Sendrn',
        description: 'Support Sendrn',
        order_id: order.id,
        handler: () => { toast.success('Thanks for your support!'); },
        prefill: { name: '', email: '' },
        theme: { color: '#ffffff' },
      };

      new razorpayCtor(options).open();
    } catch {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full text-white flex items-center justify-center px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl space-y-8"
      >
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Keep Sendrn running
          </h1>
          <p className="text-lg text-white/50">
            Donations cover hosting, bandwidth, and experiments that keep file rooms instant.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <button
                key={tier.amount}
                onClick={() => setAmount(tier.amount)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  amount === tier.amount
                    ? 'bg-white/[0.08] border-white/20'
                    : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]'
                }`}
              >
                <div className="p-2 rounded-xl bg-white/[0.06] w-fit mb-3">
                  <Icon className="w-4 h-4 text-white/70" />
                </div>
                <p className="font-semibold text-white">${tier.amount}</p>
                <p className="text-sm text-white/50 mt-1">{tier.label}</p>
              </button>
            );
          })}
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <Label htmlFor="custom-amount" className="text-sm text-white/50">Custom amount (USD)</Label>
          <input
            id="custom-amount"
            type="number"
            min="1"
            value={Number.isNaN(amount) ? '' : amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/25 transition-colors"
            placeholder="Enter amount"
          />
          <Button
            onClick={handleDonation}
            disabled={isLoading || amount <= 0 || Number.isNaN(amount)}
            className="w-full py-5 rounded-xl bg-white text-black hover:bg-white/90 font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              `Donate $${formattedAmount}`
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <p className="text-sm text-white/40">
            Want recurring support?
          </p>
          <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 text-white/70 hover:bg-white/10" asChild>
            <Link href="mailto:sudhanshu@sendrn.app">Email Sudhanshu</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
