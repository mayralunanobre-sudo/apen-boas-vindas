import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin
    .from('contribuicoes')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const { pagina } = body as { pagina: 1 | 2 }

  if (pagina !== 1 && pagina !== 2) {
    return NextResponse.json({ error: 'pagina deve ser 1 ou 2' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('contribuicoes')
    .update({ pagina })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
