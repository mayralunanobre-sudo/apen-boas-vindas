import { NextResponse } from 'next/server'
import { supabaseAdmin, uploadFromFormFile } from '@/lib/supabase-admin'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const { data: cartas, error } = await supabaseAdmin
      .from('cartas')
      .select(`
        id, nome_colaborador, criado_em,
        pessoa1_nome, pessoa1_mensagem,
        pessoa2_nome, pessoa2_mensagem,
        contribuicoes ( id, pagina, fotos_familia_urls )
      `)
      .order('criado_em', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(cartas)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const id = uuidv4()
    const nomeColaborador = formData.get('nome_colaborador') as string
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
