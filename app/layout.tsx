import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Åpen Capital — Carta de Boas-Vindas',
  description: 'Gere cartas de boas-vindas personalizadas para novos colaboradores da Åpen Capital.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
