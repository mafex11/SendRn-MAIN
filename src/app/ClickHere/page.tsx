'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
// import PrismaticBurst from '../../components/PrismaticBurst';

type DonationItem = {
  name: string;
  amount: number;
  impact: string;
};

type RazorpayPrefill = {
  name: string;
  email: string;
};

type RazorpayTheme = {
  color: string;
};

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
};

type RazorpayCheckoutOptions = {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayHandlerResponse) => void;
  prefill: RazorpayPrefill;
  theme: RazorpayTheme;
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

const donationItems: DonationItem[] = [
  { name: 'Printer shop sprint', amount: 10, impact: 'Covers the snacks and travel fuel that powered the first Sendrn launch night.' },
  { name: 'Bandwidth boost', amount: 20, impact: 'Pays for file transfer bandwidth spikes during peak exam weeks.' },
  { name: 'GPU experiment', amount: 35, impact: 'Funds experiments with faster encryption and room creation.' },
  { name: 'Keep Sendrn free', amount: 50, impact: 'Offsets storage and infrastructure fees so every user keeps instant access.' },
  // { name: 'Back the roadmap', amount: 100, impact: 'Invests in features like reusable rooms and richer device history.' },
];

const sortItems = (order: 'asc' | 'desc', items: DonationItem[]) => {
  return [...items].sort((a, b) => (order === 'asc' ? a.amount - b.amount : b.amount - a.amount));
};

export default function ClickHerePage() {
  const [displayItems, setDisplayItems] = useState(() => sortItems('asc', donationItems));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDisplayItems(sortItems('asc', donationItems));
  }, []);

  const sortedBy = useMemo(() => ({ asc: 'Price: Low to High', desc: 'Price: High to Low' }), []);

  const handleSort = (order: string) => {
    if (order !== 'asc' && order !== 'desc') {
      return;
    }
    setDisplayItems(sortItems(order, donationItems));
  };

  const loadRazorpayScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is undefined'));
        return;
      }

      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  };

  const handleDonation = async (amount: number) => {
    if (typeof window === 'undefined') {
      return;
    }

    setIsLoading(true);
    try {
      await loadRazorpayScript();

      if (typeof window.Razorpay !== 'function') {
        throw new Error('Razorpay is unavailable');
      }

      const options: RazorpayCheckoutOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'USD',
        name: 'Sendrn',
        description: 'Direct support for Sendrn upkeep and growth.',
        handler: () => {
          toast.success('Thanks for backing Sendrn. Your support fuels better file sharing.');
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again or reach out.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white">
      {/*
      <div className="absolute inset-0 z-0">
        <PrismaticBurst
          intensity={2.5}
          speed={0.5}
          animationType="rotate3d"
          mixBlendMode="screen"
          colors={["#ffffff", "#34d399", "#60a5fa", "#facc15"]}
          rayCount={8}
          distort={5}
        />
      </div>
      */}

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-28">
        <div className="w-full max-w-4xl space-y-10 rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl">
          <Card className="border-white/20 bg-black/60 text-white">
            <CardHeader className="space-y-4">
              <CardTitle className="text-4xl font-bold tracking-tight">Back the Sendrn mission</CardTitle>
              <CardDescription className="text-lg text-neutral-300">
                Every dollar keeps Sendrn snappy for anyone who needs to move files across random devices without headaches.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-wide text-neutral-400">Sort options</p>
                <Select onValueChange={handleSort} defaultValue="asc">
                  <SelectTrigger className="mt-3 w-full border-white/20 bg-black/40 text-white">
                    <SelectValue placeholder="Sort by amount" />
                  </SelectTrigger>
                  <SelectContent className="border-white/20 bg-black/90 text-white">
                    <SelectItem value="asc">{sortedBy.asc}</SelectItem>
                    <SelectItem value="desc">{sortedBy.desc}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-300">
                Your support covers infrastructure, improves encryption experiments, and keeps Sendrn free to use when you are racing to print.
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {displayItems.map((item) => (
              <Card key={item.name} className="border-white/15 bg-black/60 text-white">
                <CardHeader className="space-y-2">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <span>{item.name}</span>
                    <span className="text-lg font-semibold text-emerald-300">${item.amount}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-neutral-300">{item.impact}</p>
                  <Button
                    onClick={() => handleDonation(item.amount)}
                    disabled={isLoading}
                    className="w-full rounded-full bg-white/20 text-white hover:bg-white/30"
                  >
                    {isLoading ? 'Processing...' : 'Donate now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-white/10 bg-transparent text-neutral-300">
            <CardContent className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-sm">
                Want a different amount or recurring plan? Email Sudhanshu and we will set something up.
              </p>
              <Button variant="outline" className="rounded-full border-white/30 bg-white/10 px-8 text-white hover:bg-white/20" asChild>
                <Link href="mailto:sudhanshu@sendrn.app">Email Sudhanshu</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
