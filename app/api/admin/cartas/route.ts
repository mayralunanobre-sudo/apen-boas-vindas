import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data: cartas, error } = await supabaseAdmin
      .from('cartas')
      .select('id, nome_colaborador, criado_em')
      .order('criado_em', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: contribs, error: err2 } = await supabaseAdmin
      .from('contribuicoes')
      .select('id, carta_id, pagina, fotos_familia_urls')

    if (err2) return NextResponse.json({ error: err2.message }, { status: 500 })

    const result = (cartas ?? []).map((carta) => ({
      ...carta,
      contribuicoes: (contribs ?? []).filter((c) => c.carta_id === carta.id),
    }))

    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
