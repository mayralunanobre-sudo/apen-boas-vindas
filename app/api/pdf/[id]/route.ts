import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { generatePDFHTML } from '@/lib/pdf-template'
import type { CartaComContribuicoes } from '@/lib/types'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
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

    const cartaCompleta: CartaComContribuicoes = {
      ...carta,
      contribuicoes: contribuicoes ?? [],
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const html = await generatePDFHTML(cartaCompleta, baseUrl)

    // Tenta usar puppeteer para gerar PDF server-side
    let pdfBuffer: Buffer | null = null
    try {
      const puppeteer = await import('puppeteer')
      const browser = await puppeteer.default.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      })
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })
      pdfBuffer = Buffer.from(
        await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        })
      )
      await browser.close()
    } catch (puppeteerErr) {
      console.error('Puppeteer error:', puppeteerErr)
      // Fallback: retorna o HTML para o browser imprimir
      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-PDF-Fallback': 'true',
        },
      })
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="carta-${carta.nome_colaborador.replace(/\s+/g, '-').toLowerCase()}.pdf"`,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
