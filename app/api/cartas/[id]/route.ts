import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { mensagem_admin, mensagem_saulo, mensagem_tulio } = body

  const { data, error } = await supabaseAdmin
    .from('cartas')
    .update({ mensagem_admin, mensagem_saulo, mensagem_tulio })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  // Busca por slug (links novos) ou por UUID (links antigos)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)
  const query = supabaseAdmin.from('cartas').select('*')
  const { data: carta, error } = await (isUuid ? query.eq('id', params.id) : query.eq('slug', params.id)).single()

  if (error || !carta) {
    return NextResponse.json({ error: 'Carta não encontrada' }, { status: 404 })
  }

  const { data: contribuicoes } = await supabaseAdmin
    .from('contribuicoes')
    .select('*')
    .eq('carta_id', params.id)
    .order('criado_em', { ascending: true })

  return NextResponse.json(
    { ...carta, contribuicoes: contribuicoes ?? [] },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
