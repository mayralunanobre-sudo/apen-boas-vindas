import { NextResponse } from 'next/server'
import { supabaseAdmin, uploadFromFormFile } from '@/lib/supabase-admin'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const cartaId = formData.get('carta_id') as string
    const senderType = formData.get('sender_type') as 'pessoa1' | 'pessoa2' | 'familia' | 'outro'
    const nomeRemetente = formData.get('nome_remetente') as string
    const mensagem = formData.get('mensagem') as string

    const contribId = uuidv4()
    let fotoRemetenteUrl: string | null = null
    const fotosFamiliaUrls: string[] = []

    const fotoRemetente = formData.get('foto_remetente') as File | null
    if (fotoRemetente && fotoRemetente.size > 0) {
      fotoRemetenteUrl = await uploadFromFormFile(
        'fotos_contribuicoes',
        `${cartaId}/${contribId}-remetente`,
        fotoRemetente
      )
    }

    const fotosFam = formData.getAll('fotos_familia') as File[]
    for (let i = 0; i < fotosFam.length; i++) {
      const f = fotosFam[i]
      if (f && f.size > 0) {
        const url = await uploadFromFormFile(
          'fotos_contribuicoes',
          `${cartaId}/${contribId}-familia-${i}`,
          f
        )
        if (url) fotosFamiliaUrls.push(url)
      }
    }

    // Pessoa Extra 1 ou 2: atualiza campos na tabela cartas
    if (senderType === 'pessoa1' || senderType === 'pessoa2') {
      const prefix = senderType === 'pessoa1' ? 'pessoa1' : 'pessoa2'
      const { error } = await supabaseAdmin
        .from('cartas')
        .update({
          [`${prefix}_foto_url`]: fotoRemetenteUrl,
          [`${prefix}_mensagem`]: mensagem,
        })
        .eq('id', cartaId)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }

    // Família → página 2 | Outra pessoa → página 1
    const pagina = senderType === 'familia' ? 2 : 1

    const { data, error } = await supabaseAdmin
      .from('contribuicoes')
      .insert({
        id: contribId,
        carta_id: cartaId,
        nome_remetente: nomeRemetente,
        mensagem,
        foto_remetente_url: fotoRemetenteUrl,
        fotos_familia_urls: fotosFamiliaUrls.length > 0 ? fotosFamiliaUrls : null,
        pagina,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, contribuicao: data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
