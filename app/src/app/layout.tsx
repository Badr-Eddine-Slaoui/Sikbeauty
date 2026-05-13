import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://sikbeauty.com"),

    title: {
        default: "Sikbeauty",
        template: "%s | Sikbeauty",
    },

    description:
        "Discover premium skincare and beauty products at Sikbeauty.",

    keywords: [
        "beauty",
        "skincare",
        "cosmetics",
        "makeup",
        "Sikbeauty",
        "Morocco beauty store",
    ],

    authors: [
        {
            name: "Sikbeauty",
        },
    ],

    creator: "Sikbeauty",

    publisher: "Sikbeauty",

    applicationName: "Sikbeauty",

    category: "Beauty",

    robots: {
        index: true,
        follow: true,

        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    alternates: {
        canonical: "https://sikbeauty.com",
    },

    openGraph: {
        title: "Sikbeauty",
        description:
            "Discover premium skincare and beauty products.",

        url: "https://sikbeauty.com",

        siteName: "Sikbeauty",

        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Sikbeauty",
            },
        ],

        locale: "fr_FR",

        type: "website",
    },

    twitter: {
        card: "summary_large_image",

        title: "Sikbeauty",

        description:
            "Discover premium skincare and beauty products.",

        images: ["/og-image.jpg"],
    },

    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },

    manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
