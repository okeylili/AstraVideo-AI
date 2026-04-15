import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AstraVideo AI - Text to Video Generation',
  description: 'Generate stunning videos from text using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
