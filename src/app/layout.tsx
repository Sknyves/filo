import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ThemeToggle from "@/components/ui/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RequestFlow | Plateforme 3D",
  description: "Plateforme immersive pour demandes de services communication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
