import { NextResponse } from 'next/server'
import { supabaseAdmin, uploadFromFormFile } from '@/lib/supabase-admin'
import { v4 as uuidv4 } from 'uuid'

function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function GET() {
  try {
    const { data: cartas, error } = await supabaseAdmin
      .from('cartas')
      .select('id, nome_colaborador, criado_em')
      .order('criado_em', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: contribs } = await supabaseAdmin
      .from('contribuicoes')
      .select('id, carta_id, pagina, fotos_familia_urls')

    const result = (cartas ?? []).map((carta) => ({
      ...carta,
      contribuicoes: (contribs ?? []).filter((c) => c.carta_id === carta.id),
    }))

    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const id = uuidv4()
    const nomeColaborador = formData.get('nome_colaborador') as string

    // Gera slug único a partir do nome
    let slug = generateSlug(nomeColaborador)
    const { data: existing } = await supabaseAdmin
      .from('cartas')
      .select('slug')
      .like('slug', `${slug}%`)
    const slugCount = (existing ?? []).filter((c: { slug: string }) => c.slug === slug || c.slug?.startsWith(slug + '-')).length
    if (slugCount > 0) slug = `${slug}-${slugCount + 1}`
    const mensagemAdmin = formData.get('mensagem_admin') as string
    const mensagemSaulo = formData.get('mensagem_saulo') as string
    const mensagemTulio = formData.get('mensagem_tulio') as string

    let fotoColaboradorUrl: string | null = null

    const fotoColab = formData.get('foto_colaborador') as File | null
    if (fotoColab && fotoColab.size > 0) {
      fotoColaboradorUrl = await uploadFromFormFile(
        'fotos_colaboradores',
        `${id}/colaborador`,
        fotoColab
      )
    }

    const { data, error } = await supabaseAdmin
      .from('cartas')
      .insert({
        id,
        slug,
        nome_colaborador: nomeColaborador,
        foto_colaborador_url: fotoColaboradorUrl,
        nome_admin: 'Mayra Luna',
        cargo_admin: 'Diretora de Operações',
        mensagem_admin: mensagemAdmin,
        foto_admin_url: null,
        mensagem_saulo: mensagemSaulo,
        mensagem_tulio: mensagemTulio,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id, carta: data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
