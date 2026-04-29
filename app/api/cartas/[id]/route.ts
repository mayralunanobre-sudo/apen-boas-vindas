import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { data: carta, error } = await supabaseAdmin
    .from('cartas')
    .select('*')
    .eq('id', params.id)
    .single()

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
