import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GoTogether - Find Your Event Squad",
  description: "Discover events and find the perfect companions to attend with. Connect with like-minded people for concerts, festivals, movies, and more.",
  keywords: ["events", "social", "meetup", "companions", "concerts", "festivals", "movies", "Gen Z"],
  authors: [{ name: "GoTogether Team" }],
  openGraph: {
    title: "GoTogether - Find Your Event Squad",
    description: "Never go to events alone again. Connect with like-minded people for concerts, festivals, movies, and more.",
    url: "https://gotogether.app",
    siteName: "GoTogether",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GoTogether - Find Your Event Squad",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        <SessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
