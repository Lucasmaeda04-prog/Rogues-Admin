import type { Metadata } from "next";
import { Campton } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "Rogues Carrot Bar - Admin Panel",
  description: "Admin panel for managing tasks, shop items, badges and administrators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Campton.className} ${Campton.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
