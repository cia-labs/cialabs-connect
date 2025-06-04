import { Inter } from "next/font/google"
import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils"
import PlausibleProvider from "next-plausible"
const inter = Inter({ subsets: ["latin"] })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata = {
  title: "CIA Labs",
  description:
    "At CIA Labs, we the students, are driven by a simple belief: Engineering is more than just exams.It’s creativity, hands-on building, collaboration, and problem-solving – and we’re here to bring that spirit back to life. Anybody irrespective of their departmental background or the clubs they belong to can be a part of this community and grow together.What is CIA Labs?CIA Labs was once an active and passionate student community at Atria. It stood for innovation, collaboration, and technical growth – building a space where engineering wasn’t just studied but experienced."
}

const plausibleSite = process.env.NEXT_PUBLIC_PLAUSIBLE_SITE
const plausibleURL = process.env.NEXT_PUBLIC_PLAUSIBLE_URL

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn("bg-background", inter.className)}>
      <PlausibleProvider
          domain={plausibleSite || "localhost"}
          selfHosted={true}
          customDomain={`${plausibleURL || "http://localhost"}`}
        >
        {children}
        </PlausibleProvider>
        </body>
    </html>
  )
}
