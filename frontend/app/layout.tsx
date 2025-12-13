/**
 * 🎯 ROOT LAYOUT - VIRAL ENGINE PRO
 * Built: December 13, 2025
 * Company: RJ Business Solutions
 */

import type { Metadata } from 'next'
import { Inter, Montserrat, Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
const poppins = Poppins({ 
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['latin'], 
  variable: '--font-poppins' 
})

export const metadata: Metadata = {
  title: 'Viral Engine Pro | AI-Powered Viral Video Generation',
  description: 'Create viral TikTok, Instagram Reels, and YouTube Shorts in minutes. 150+ done-for-you templates. Unlimited exports. Built by RJ Business Solutions.',
  keywords: 'viral videos, AI video generator, TikTok creator, Instagram Reels, YouTube Shorts, video automation, content creation',
  authors: [{ name: 'Rick Jefferson', url: 'https://rickjeffersonsolutions.com' }],
  creator: 'RJ Business Solutions',
  publisher: 'RJ Business Solutions',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://viralengine.pro',
    title: 'Viral Engine Pro | AI-Powered Viral Video Generation',
    description: 'Create viral TikTok, Instagram Reels, and YouTube Shorts in minutes. 150+ done-for-you templates.',
    siteName: 'Viral Engine Pro',
    images: [{
      url: 'https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg',
      width: 1200,
      height: 630,
      alt: 'Viral Engine Pro'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viral Engine Pro | AI-Powered Viral Video Generation',
    description: 'Create viral videos in minutes with AI',
    creator: '@ricksolutions1',
    images: ['https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg']
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} ${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
