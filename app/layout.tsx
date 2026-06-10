import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-navy">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
