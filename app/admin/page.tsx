import { supabaseAdmin } from '@/lib/supabase-admin'
import AdminListClient from './AdminListClient'

export const dynamic = 'force-dynamic'

async function getCartas() {
  const { data: cartas, error: e1 } = await supabaseAdmin
    .from('cartas')
    .select('id, nome_colaborador, criado_em')
    .order('criado_em', { ascending: false })

  const { data: contribs, error: e2 } = await supabaseAdmin
    .from('contribuicoes')
    .select('id, carta_id, pagina, fotos_familia_urls')

  console.log('[admin] cartas:', cartas?.length, 'error:', e1?.message)
  console.log('[admin] contribs:', contribs?.length, 'error:', e2?.message)

  return (cartas ?? []).map((carta) => ({
    ...carta,
    contribuicoes: (contribs ?? []).filter((c) => c.carta_id === carta.id),
  }))
}

export default async function AdminPage() {
  const cartas = await getCartas()
  console.log('[admin] total cartas retornadas:', cartas.length)
  return <AdminListClient cartas={cartas} debug={`cartas: ${cartas.length}`} />
}
