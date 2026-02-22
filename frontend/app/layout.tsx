import type { Metadata } from 'next'
import './globals.css'
import LanguageProvider from '@/components/LanguageProvider'

export const metadata: Metadata = {
  title: 'Axentralab - Website Maintenance & Security SaaS',
  description: 'Keep your website alive, secure, and fast with automated monitoring, daily backups, and security protection.',
  keywords: ['website maintenance', 'uptime monitoring', 'website backup', 'security scan', 'website protection'],
  authors: [{ name: 'Axentralab' }],
  openGraph: {
    title: 'Axentralab - Website Maintenance & Security SaaS',
    description: 'Automated website monitoring, backups, and security protection for businesses.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axentralab - Website Maintenance & Security SaaS',
    description: 'Automated website monitoring, backups, and security protection.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
