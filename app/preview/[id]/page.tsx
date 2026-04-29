import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { CartaComContribuicoes } from '@/lib/types'
import PreviewContent from '@/app/preview/PreviewContent'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

async function getCarta(id: string): Promise<CartaComContribuicoes | null> {
  const { data: carta, error } = await supabaseAdmin
    .from('cartas')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !carta) return null

  const { data: contribuicoes } = await supabaseAdmin
    .from('contribuicoes')
    .select('*')
    .eq('carta_id', id)
    .order('criado_em', { ascending: true })

  return { ...carta, contribuicoes: contribuicoes ?? [] }
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
