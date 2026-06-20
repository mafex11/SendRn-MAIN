import './globals.css';
import { ThemeProvider } from "../components/theme-provider"
import { Navbar } from "../components/Navbar"
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Sendrn — Instant File Sharing',
  description: 'Share files across devices instantly. No sign-up, no hassle.',
  icons: {
    icon: '/Flow.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="mesh-gradient" aria-hidden="true" />
          <div className="noise-overlay" aria-hidden="true" />
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'oklch(0.15 0.015 260)',
                border: '1px solid oklch(0.25 0.02 260)',
                color: 'oklch(0.9 0.01 260)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
