import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      return NextResponse.json({ error: 'Variáveis de ambiente não configuradas' }, { status: 500 })
    }

    const headers = {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    }

    const [cartasRes, contribsRes] = await Promise.all([
      fetch(`${url}/rest/v1/cartas?select=id,nome_colaborador,criado_em&order=criado_em.desc`, { headers, cache: 'no-store' }),
      fetch(`${url}/rest/v1/contribuicoes?select=id,carta_id,pagina,fotos_familia_urls`, { headers, cache: 'no-store' }),
    ])

    if (!cartasRes.ok) return NextResponse.json({ error: await cartasRes.text() }, { status: 500 })
    if (!contribsRes.ok) return NextResponse.json({ error: await contribsRes.text() }, { status: 500 })

    const cartas = await cartasRes.json()
    const contribs = await contribsRes.json()

    const result = cartas.map((carta: { id: string; nome_colaborador: string; criado_em: string }) => ({
      ...carta,
      contribuicoes: contribs.filter((c: { carta_id: string }) => c.carta_id === carta.id),
    }))

    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
