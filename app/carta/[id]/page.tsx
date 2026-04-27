import { notFound } from 'next/navigation'
import CartaColaborativa from './CartaColaborativa'
import type { Carta, Contribuicao } from '@/lib/types'

async function getCarta(id: string): Promise<(Carta & { contribuicoes: Contribuicao[] }) | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/cartas/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function CartaPage({ params }: { params: { id: string } }) {
  const carta = await getCarta(params.id)
  if (!carta) notFound()

  return <CartaColaborativa carta={carta} />
}
