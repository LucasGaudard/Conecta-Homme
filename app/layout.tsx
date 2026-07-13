import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CONDOTECH",
    template: "%s | CONDOTECH",
  },
  description: "Gestão inteligente do seu condomínio",
  manifest: "/manifest.webmanifest",
  applicationName: "CONDOTECH",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CONDOTECH",
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { rel: "icon", url: "/favicon.png", type: "image/png" },
      { rel: "icon", url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#031326",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
