import { NextResponse } from 'next/server'
import { supabaseAdmin, uploadFromFormFile } from '@/lib/supabase-admin'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const id = uuidv4()
    const nomeColaborador = formData.get('nome_colaborador') as string
    const nomeAdmin = formData.get('nome_admin') as string
    const cargoAdmin = formData.get('cargo_admin') as string
    const mensagemAdmin = formData.get('mensagem_admin') as string
    const pessoa1Nome = formData.get('pessoa1_nome') as string
    const pessoa1Cargo = formData.get('pessoa1_cargo') as string
    const pessoa2Nome = formData.get('pessoa2_nome') as string
    const pessoa2Cargo = formData.get('pessoa2_cargo') as string

    let fotoColaboradorUrl: string | null = null
    let fotoAdminUrl: string | null = null

    const fotoColab = formData.get('foto_colaborador') as File | null
    if (fotoColab && fotoColab.size > 0) {
      fotoColaboradorUrl = await uploadFromFormFile(
        'fotos_colaboradores',
        `${id}/colaborador`,
        fotoColab
      )
    }

    const fotoAdmin = formData.get('foto_admin') as File | null
    if (fotoAdmin && fotoAdmin.size > 0) {
      fotoAdminUrl = await uploadFromFormFile(
        'fotos_colaboradores',
        `${id}/admin`,
        fotoAdmin
      )
    }

    const { data, error } = await supabaseAdmin
      .from('cartas')
      .insert({
        id,
        nome_colaborador: nomeColaborador,
        foto_colaborador_url: fotoColaboradorUrl,
        nome_admin: nomeAdmin,
        cargo_admin: cargoAdmin,
        mensagem_admin: mensagemAdmin,
        foto_admin_url: fotoAdminUrl,
        pessoa1_nome: pessoa1Nome,
        pessoa1_cargo: pessoa1Cargo,
        pessoa2_nome: pessoa2Nome,
        pessoa2_cargo: pessoa2Cargo,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id, carta: data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
