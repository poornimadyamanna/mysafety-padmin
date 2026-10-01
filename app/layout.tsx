import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
// import { Toaster } from "react-hot-toast";
import GoogleTranslateFix from "@/components/GoogleTranslateFix"
import { Toaster } from "@/components/ui/toaster"
import { LocationProvider } from "@/context/location-context";

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "mySafety24x7 Admin Panel",
  description: "Comprehensive admin dashboard for vehicle safety management",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/my-safety-logo.svg",
        // media: "(prefers-color-scheme: light)",
      },
      // {
      //   url: "/icon-dark-32x32.png",
      //   media: "(prefers-color-scheme: dark)",
      // },
      // {
      //   url: "/icon.svg",
      //   type: "image/svg+xml",
      // },
    ],
    // apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <GoogleTranslateFix />
        <LocationProvider>
          {children}
        </LocationProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
