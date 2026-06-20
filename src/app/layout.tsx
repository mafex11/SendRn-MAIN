import './globals.css';
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="page-bg" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,0,0,0.06)',
              color: '#1c1917',
            },
          }}
        />
      </body>
    </html>
  );
}
