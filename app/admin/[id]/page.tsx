import { notFound } from 'next/navigation'
import AdminPanel from './AdminPanel'
import type { CartaComContribuicoes } from '@/lib/types'
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

export default async function AdminPage({ params }: { params: { id: string } }) {
  const carta = await getCarta(params.id)
  if (!carta) notFound()
  return <AdminPanel carta={carta} />
}
