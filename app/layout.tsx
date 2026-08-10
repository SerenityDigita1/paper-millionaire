import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: 'Paper Millionaire — The $100K Experiment',
  description: 'Documenting a $100K paper portfolio every week. Real decisions, real data, no sponsored picks.',
  openGraph: {
    title: 'Paper Millionaire — The $100K Experiment',
    description: 'Can disciplined, non-professional investing build real wealth? We\'re finding out live.',
    url: 'https://changemytrajectory.com',
    siteName: 'Change My Trajectory',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paper Millionaire — The $100K Experiment',
    description: 'Documenting a $100K paper portfolio every week.',
  },
}

// Set NEXT_PUBLIC_GA_ID in Vercel (Settings > Environment Variables) to the GA4
// Measurement ID, e.g. G-XXXXXXXXXX. Left unset, the GA tag simply isn't
// rendered, so nothing breaks in local dev or before the property exists.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-navy">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Vercel Analytics: zero config, works the moment this deploys.
            Google Analytics: richer data, and it joins up with Search Console. */}
        <Analytics />
        <SpeedInsights />
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  )
}
