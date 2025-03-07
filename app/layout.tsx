import Providers from "@/app/providers";
import bgPattern from "@/public/bg-pattern-transparent.png";
import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import "./globals.css";


let title = "SnapFrame – Lightning-Fast AI Imagery";
let description = "Generate images with AI in a milliseconds";
let url = "https://sanp-frame.vercel.app/";
let ogimage = "https://github.com/cyber-bytezz/videodubber-ai/blob/main/export.png?raw=true";
let sitename = "sanp-frame.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="color-scheme" content="dark" />
        {/* uses plausible analytics where owner can track number of users and views have gone  */}
        <PlausibleProvider domain="sanp-frame.vercel.app" /> 
      </head>
      <body
        className={`dark h-full min-h-full bg-[length:6px] font-mono text-gray-100 antialiased`}
        style={{ backgroundImage: `url(${bgPattern.src}` }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
