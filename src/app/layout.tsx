import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Discord bot dashboard",
  description:
    "Discord bot management platform with intuitive UI and powerful customization features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
