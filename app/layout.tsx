import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Åpen Capital — Carta de Boas-Vindas',
  description: 'Gere cartas de boas-vindas personalizadas para novos colaboradores da Åpen Capital.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
