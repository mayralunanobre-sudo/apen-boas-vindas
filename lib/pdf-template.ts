import type { CartaComContribuicoes } from './types'

const TULIO_MESSAGE = `O melhor começo de carreira do mundo é aquele que tem muito problema pra resolver. Por isso, garanto: vocês estão no lugar certo! Sei o quanto a Åpen pode marcar a carreira de cada um de vocês, contem comigo nessa jornada... Tenho certeza de que a curiosidade intelectual e a vontade de trabalhar vão fazer toda a diferença para o crescimento de vocês lá na frente. Sejam muito bem-vindos. Vamos juntos! Abraços!`

const SAULO_MESSAGE = `Que alegria! A sua chegada representa energia nova para uma empresa que há 6 anos vive o propósito de ser o braço direito dos clientes. Temos orgulho de ser a maior consultoria financeira do Norte e Nordeste e sabemos que isso se deve a todos os que estão aqui. Escolher cada um de vocês foi sentir que estamos construindo o futuro com ainda mais excelência, impacto e legado. Sejam muito bem-vindos. Contem comigo! Saulo Godoy`

const FAMILY_PHRASE = `Você já tem uma família linda, esperamos, sinceramente, que aqui você também encontre uma segunda família super especial!`

const APEN_VALUES = [
  'TODOS POR TODOS',
  'ESPÍRITO DE DONO E INCONFORMISMO',
  'FOCO NO CLIENTE E NO SERVIÇO IMPECÁVEL',
  'DECISÕES ORIENTADAS POR DADOS COM ESPÍRITO INOVADOR',
  'RESPONSABILIDADE COM OS SONHOS DOS CLIENTES E DO NOSSO TIME',
]

async function toBase64(url: string): Promise<string> {
  try {
    const res = await fetch(url)
    const buf = await res.arrayBuffer()
    const base64 = Buffer.from(buf).toString('base64')
    const mime = res.headers.get('content-type') || 'image/jpeg'
    return `data:${mime};base64,${base64}`
  } catch {
    return ''
  }
}

function avatar(src: string, size = 90): string {
  if (!src) {
    return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#d1e8de;border:3px solid #2d7a5f;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:24px;color:#1a4a3a;">👤</div>`
  }
  return `<img src="${src}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;border:3px solid #2d7a5f;flex-shrink:0;" />`
}

function messageBlock(
  index: number,
  name: string,
  role: string,
  message: string | null,
  photoSrc: string
): string {
  const isEven = index % 2 === 0
  const pendente = !message
    ? `<em style="color:#999;">Mensagem ainda não enviada</em>`
    : message.replace(/\n/g, '<br/>')

  const photoDiv = avatar(photoSrc, 80)
  const textDiv = `
    <div style="flex:1;">
      <div style="font-family:'Dancing Script',cursive;font-size:18px;color:#1a4a3a;margin-bottom:2px;">${name}</div>
      <div style="font-weight:700;text-decoration:underline;text-decoration-color:#2d7a5f;font-size:12px;color:#2d7a5f;margin-bottom:8px;">${role}</div>
      <p style="font-size:12px;line-height:1.6;color:#333;margin:0;">${pendente}</p>
    </div>`

  return `
  <div style="display:flex;flex-direction:${isEven ? 'row' : 'row-reverse'};gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid #e8f0ed;">
    ${photoDiv}
    ${textDiv}
  </div>`
}

export async function generatePDFHTML(
  carta: CartaComContribuicoes,
  baseUrl: string
): Promise<string> {
  const mayraSrc = await toBase64(`${baseUrl}/images/mayra-luna.jpg`).catch(() => '')
  const tulioSrc = await toBase64(`${baseUrl}/images/tulio-cavalcanti.jpg`).catch(() => '')
  const colaboradorSrc = carta.foto_colaborador_url
    ? await toBase64(carta.foto_colaborador_url)
    : ''
  const adminSrc = carta.foto_admin_url ? await toBase64(carta.foto_admin_url) : ''
  const p1Src = carta.pessoa1_foto_url ? await toBase64(carta.pessoa1_foto_url) : ''
  const p2Src = carta.pessoa2_foto_url ? await toBase64(carta.pessoa2_foto_url) : ''

  const familyContribs = carta.contribuicoes.filter((c) => c.pagina === 2)
  const p1Contribs = carta.contribuicoes.filter((c) => c.pagina === 1)

  const familyFotos: string[] = []
  for (const c of familyContribs) {
    if (c.fotos_familia_urls) {
      for (const url of c.fotos_familia_urls) {
        const b64 = await toBase64(url)
        if (b64) familyFotos.push(b64)
      }
    }
  }

  const p1Contrib = p1Contribs[0]

  const blocks = [
    { name: 'Mayra Luna', role: 'Diretora de Operações', message: carta.mensagem_admin, src: mayraSrc },
    { name: 'Túlio Cavalcanti', role: 'Diretor de Consultoria e Alocação', message: TULIO_MESSAGE, src: tulioSrc },
    { name: carta.pessoa1_nome, role: carta.pessoa1_cargo, message: carta.pessoa1_mensagem, src: p1Src },
    { name: carta.pessoa2_nome, role: carta.pessoa2_cargo, message: carta.pessoa2_mensagem, src: p2Src },
    { name: carta.nome_admin, role: carta.cargo_admin, message: p1Contrib?.mensagem ?? carta.mensagem_admin, src: adminSrc },
  ]

  const blocksHTML = blocks
    .map((b, i) => messageBlock(i, b.name, b.role, b.message, b.src))
    .join('')

  const valuesHTML = APEN_VALUES.map(
    (v) => `<div style="text-align:center;font-size:10px;font-weight:600;padding:4px 8px;border-right:1px solid rgba(255,255,255,0.3);flex:1;">${v}</div>`
  ).join('')

  const familyCardsHTML = familyContribs
    .map(
      (c) => `
    <div style="background:#fffacd;border:1px solid #f0e070;border-radius:4px;padding:12px;box-shadow:2px 2px 6px rgba(0,0,0,0.1);break-inside:avoid;">
      <div style="font-family:'Dancing Script',cursive;font-size:15px;color:#1a4a3a;margin-bottom:6px;">${c.nome_remetente}</div>
      <p style="font-size:11px;line-height:1.6;color:#333;margin:0;">${c.mensagem.replace(/\n/g, '<br/>')}</p>
    </div>`
    )
    .join('')

  const familyFotosHTML =
    familyFotos.length > 0
      ? `<div style="margin-top:24px;">
          <h3 style="font-family:'Dancing Script',cursive;font-size:18px;color:#1a4a3a;margin-bottom:12px;">Fotos da Família</h3>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            ${familyFotos
              .map(
                (src) =>
                  `<img src="${src}" style="width:100%;height:120px;object-fit:cover;border-radius:6px;border:2px solid #2d7a5f;" />`
              )
              .join('')}
          </div>
        </div>`
      : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Carta de Boas-Vindas — ${carta.nome_colaborador}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Inter',sans-serif; background:#fff; color:#222; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { width:210mm; min-height:297mm; padding:14mm 16mm; position:relative; page-break-after:always; }
    .page:last-child { page-break-after:avoid; }
    @page { size:A4; margin:0; }
  </style>
</head>
<body>

<!-- ===================== PÁGINA 1 ===================== -->
<div class="page">

  <!-- Cabeçalho com foto e nome do colaborador -->
  <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;padding-bottom:14px;border-bottom:3px solid #1a4a3a;">
    ${avatar(colaboradorSrc, 90)}
    <div>
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#2d7a5f;font-weight:600;">Bem-vindo(a) à Åpen Capital</div>
      <div style="font-family:'Dancing Script',cursive;font-size:38px;color:#1a4a3a;line-height:1.1;">${carta.nome_colaborador}</div>
    </div>
    <div style="margin-left:auto;">
      <img src="${baseUrl}/images/logo-apen.png" style="height:50px;opacity:0.85;" onerror="this.style.display='none'"/>
    </div>
  </div>

  <!-- Sticky note Saulo Godoy -->
  <div style="background:#fffacd;border:1px solid #f0e070;border-radius:4px;padding:14px 18px;margin-bottom:18px;box-shadow:3px 3px 8px rgba(0,0,0,0.12);position:relative;transform:rotate(-0.5deg);">
    <div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);width:20px;height:16px;background:#f0e000;clip-path:polygon(50% 0%,100% 100%,0% 100%);opacity:0.8;"></div>
    <p style="font-size:11.5px;line-height:1.7;color:#444;">${SAULO_MESSAGE}</p>
  </div>

  <!-- Blocos de mensagem alternados -->
  ${blocksHTML}

  <!-- Rodapé com valores -->
  <div style="position:absolute;bottom:0;left:0;right:0;background:#1a4a3a;padding:10px 16mm;display:flex;align-items:stretch;">
    ${valuesHTML}
  </div>
</div>

<!-- ===================== PÁGINA 2 ===================== -->
<div class="page">

  <!-- Cabeçalho página 2 -->
  <div style="display:flex;align-items:center;gap:18px;margin-bottom:14px;padding-bottom:14px;border-bottom:3px solid #1a4a3a;">
    ${avatar(colaboradorSrc, 80)}
    <div>
      <div style="font-family:'Dancing Script',cursive;font-size:32px;color:#1a4a3a;">${carta.nome_colaborador}</div>
      <div style="font-size:12px;color:#2d7a5f;margin-top:4px;font-style:italic;">${FAMILY_PHRASE}</div>
    </div>
  </div>

  <!-- Cards da família -->
  ${
    familyContribs.length > 0
      ? `<div style="columns:2;gap:12px;margin-bottom:20px;">${familyCardsHTML}</div>`
      : `<div style="text-align:center;padding:40px;color:#999;font-style:italic;">Ainda não há mensagens de família registradas.</div>`
  }

  <!-- Fotos da família -->
  ${familyFotosHTML}

  <!-- Rodapé com valores -->
  <div style="position:absolute;bottom:0;left:0;right:0;background:#1a4a3a;padding:10px 16mm;display:flex;align-items:stretch;">
    ${valuesHTML}
  </div>
</div>

</body>
</html>`
}
