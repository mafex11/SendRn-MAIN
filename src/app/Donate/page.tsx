'use client';

import { useMemo, useState } from 'react';
import { type ElementType } from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Rocket, ShieldCheck, Zap } from "lucide-react";
import { Button } from '@/components/ui/button';
// import PrismaticBurst from '../../components/PrismaticBurst';

type DonationTier = {
  amount: number;
  label: string;
  description: string;
  icon: ElementType;
};

type RazorpayPrefill = {
  name: string;
  email: string;
};

type RazorpayTheme = {
  color: string;
};

type RazorpayOrderResponse = {
  id: string;
};

type RazorpayCheckoutOptions = {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: () => void;
  prefill: RazorpayPrefill;
  theme: RazorpayTheme;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayWindow = Window & {
  Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
};

const tiers: DonationTier[] = [
  {
    amount: 5,
    label: 'Keep the lights on',
    description: 'Covers the basic hosting costs that keep Sendrn online for quick file hops.',
    icon: ShieldCheck,
  },
  {
    amount: 15,
    label: 'Speed upgrades',
    description: 'Funds bandwidth spikes and helps stress-test rooms during exam seasons.',
    icon: Zap,
  },
  {
    amount: 40,
    label: 'Build the next release',
    description: 'Backs deeper features like reusable rooms and better device pairing.',
    icon: Rocket,
  },
];

const presetAmounts = tiers.map((tier) => tier.amount);

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

const createOrder = async (amount: number) => {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: amount * 100 }),
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  const order = (await response.json()) as RazorpayOrderResponse;

  if (!order.id) {
    throw new Error('Order response missing id');
  }

  return order.id;
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

      if (typeof razorpayCtor !== 'function') {
        throw new Error('Razorpay is unavailable');
      }

      const orderId = await createOrder(amount);

      const options: RazorpayCheckoutOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100),
        currency: 'USD',
        name: 'Sendrn',
        description: 'Support Sendrn and keep file rooms fast.',
        order_id: orderId,
        handler: () => {
          toast.success('Thanks for donating. Sendrn will stay fast for your next file hop.');
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new razorpayCtor(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again or reach out to Sudhanshu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white">
      {/*
      <div className="absolute inset-0 z-0">
        <PrismaticBurst
          intensity={2.4}
          speed={0.55}
          animationType="rotate3d"
          mixBlendMode="screen"
          colors={["#ffffff", "#f472b6", "#38bdf8", "#facc15"]}
          rayCount={12}
          distort={7}
        />
      </div>
      */}

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-28">
        <div className="w-full max-w-4xl space-y-10 rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl">
          <Card className="border-white/20 bg-black/60 text-white">
            <CardHeader className="space-y-4">
              <CardTitle className="text-4xl font-bold tracking-tight">Keep Sendrn shipping</CardTitle>
              <CardDescription className="text-lg text-neutral-300">
                Donations cover hosting, bandwidth, and experiments that make file rooms instant when you are racing against a deadline.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <Card key={tier.amount} className="border-white/15 bg-black/70 text-white">
                    <CardHeader className="space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">${tier.amount} · {tier.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-neutral-300">{tier.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-white/20 bg-black/60 text-white">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Choose your amount</CardTitle>
              <CardDescription className="text-neutral-300">
                Pick a preset or enter a custom number. Every bit keeps Sendrn ready for your next transfer sprint.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    className={`rounded-full border-white/30 bg-white/10 px-6 text-white hover:bg-white/20 ${amount === preset ? 'bg-white/20' : ''}`}
                    onClick={() => setAmount(preset)}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom amount (USD)</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  value={Number.isNaN(amount) ? '' : amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="border-white/20 bg-black/40 text-white placeholder:text-neutral-500"
                  placeholder="Enter an amount"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full rounded-full"
                onClick={handleDonation}
                disabled={isLoading || amount <= 0 || Number.isNaN(amount)}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Donate $${formattedAmount}`
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-white/10 bg-transparent text-neutral-300">
            <CardContent className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <p className="text-sm">
                Want a custom sponsorship or recurring backing? Email Sudhanshu and we will build it together.
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