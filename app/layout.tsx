import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'GranaFlow - Controle Financeiro',
  description: 'Aplicativo para controle financeiro pessoal',
  icons: {
    icon: [
      {
        url: '/granaflow-icon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/granaflow-icon.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/granaflow-icon.png',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster theme='light' richColors={true} />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
