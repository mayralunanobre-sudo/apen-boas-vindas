import { supabaseAdmin } from '@/lib/supabase-admin'
import AdminListClient from './AdminListClient'

export const dynamic = 'force-dynamic'

async function getCartas() {
  const { data: cartas } = await supabaseAdmin
    .from('cartas')
    .select('id, nome_colaborador, criado_em')
    .order('criado_em', { ascending: false })

  const { data: contribs } = await supabaseAdmin
    .from('contribuicoes')
    .select('id, carta_id, pagina, fotos_familia_urls')

  return (cartas ?? []).map((carta) => ({
    ...carta,
    contribuicoes: (contribs ?? []).filter((c) => c.carta_id === carta.id),
  }))
}

export default async function AdminPage() {
  const cartas = await getCartas()
  return <AdminListClient cartas={cartas} />
}
