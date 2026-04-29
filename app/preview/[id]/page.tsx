import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { CartaComContribuicoes } from '@/lib/types'
import PreviewContent from '@/app/preview/PreviewContent'

async function getCarta(id: string): Promise<CartaComContribuicoes | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/cartas/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const carta = await getCarta(params.id)
  return { title: carta ? `Preview — ${carta.nome_colaborador}` : 'Preview' }
}

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const carta = await getCarta(params.id)
  if (!carta) notFound()

  return <PreviewContent carta={carta} />
}
