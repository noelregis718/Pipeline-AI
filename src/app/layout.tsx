import type { Metadata } from "next";
import AriaAnnouncer from "../components/AriaAnnouncer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokémon Explorer",
  description: "A beautiful Pokémon Explorer built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <AriaAnnouncer />
        {children}
      </body>
    </html>
  );
}
