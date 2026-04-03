import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Space Mission Tracker',
  description: 'Real-time 3D visualization of crewed space missions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden bg-black">{children}</body>
    </html>
  );
}
