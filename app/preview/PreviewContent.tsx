import type { CartaComContribuicoes } from '@/lib/types'
import PrintButton from './[id]/PrintButton'

const INTRO_PHRASE = `Mas não é apenas Saulo que quer te desejar boas-vindas! Tem um time inteiro muito ansioso pra escrever com você esse novo capítulo!`

const FAMILY_PHRASE = `Você já tem uma família linda, esperamos, sinceramente, que aqui você também encontre uma segunda família super especial!`

const APEN_VALUES = [
  'TODOS POR TODOS',
  'ESPÍRITO DE DONO E INCONFORMISMO',
  'FOCO NO CLIENTE E NO SERVIÇO IMPECÁVEL',
  'DECISÕES ORIENTADAS POR DADOS COM ESPÍRITO INOVADOR',
  'RESPONSABILIDADE COM OS SONHOS DOS CLIENTES E DO NOSSO TIME',
]

const PRINT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; }

  .preview-root {
    font-family: 'Inter', sans-serif;
    background: #e8ecf1;
    min-height: 100vh;
    padding: 30px 0 60px;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    background: white;
    margin: 0 auto 32px;
    position: relative;
    box-shadow: 0 8px 40px rgba(0,0,0,0.18);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .page-content {
    padding: 14mm 16mm 52mm;
    flex: 1;
  }

  /* Elementos fixos para print — ocultos na tela */
  .print-fixed-header,
  .print-fixed-footer { display: none; }

  @media print {
    body { background: white !important; }
    .preview-root { background: white; padding: 0; }
    .page { margin: 0; box-shadow: none; page-break-after: always; overflow: visible; }
    .page:last-child { page-break-after: avoid; }
    .no-print { display: none !important; }

    /* Cabeçalho fixo em todas as páginas */
    .print-fixed-header {
      display: flex;
      position: fixed;
      top: 0; left: 0; right: 0;
      background: white;
      z-index: 100;
      align-items: center;
      gap: 14px;
      padding: 7mm 16mm 5mm;
      border-bottom: 3px solid #162040;
    }
    .print-fixed-header .avatar-sm-print {
      width: 70px; height: 70px;
      border-radius: 50%; object-fit: cover;
      border: 3px solid #162040; flex-shrink: 0;
    }
    .print-fixed-header .avatar-placeholder-sm {
      width: 70px; height: 70px;
      border-radius: 50%; border: 3px solid #162040;
      background: #d0d8ee; display: flex; align-items: center;
      justify-content: center; font-weight: bold; color: #162040;
      font-size: 22px; flex-shrink: 0;
    }

    /* Rodapé fixo em todas as páginas */
    .print-fixed-footer {
      display: flex;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: #162040;
      z-index: 100;
      flex-direction: row;
    }

    /* Esconde cabeçalho/rodapé embutidos nas páginas (evita duplicar) */
    .carta-header { display: none !important; }
    .navy-footer { display: none !important; }

    /* Ajusta padding do conteúdo para não sobrepor com fixos */
    .page-content {
      padding-top: 35mm !important;
      padding-bottom: 48mm !important;
    }
  }

  @page { size: A4; margin: 0; }

  /* ── TYPOGRAPHY ──────────────────────────────── */
  .font-cursive { font-family: 'Dancing Script', cursive; }

  /* ── HEADER ──────────────────────────────────── */
  .carta-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 14px;
    margin-bottom: 14px;
    border-bottom: 3px solid #162040;
  }
  .carta-header-text { flex: 1; }

  /* ── AVATARS ─────────────────────────────────── */
  .avatar-lg {
    width: 130px; height: 130px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #162040;
    flex-shrink: 0;
  }
  .avatar-md {
    width: 90px; height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #162040;
    flex-shrink: 0;
  }
  .avatar-sm {
    width: 80px; height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #162040;
    flex-shrink: 0;
  }
  .avatar-saulo {
    width: 84px; height: 84px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #c8a800;
    flex-shrink: 0;
  }
  .avatar-placeholder {
    background: #d0d8ee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #162040;
    font-size: 22px;
  }

  /* ── SAULO NOTE ──────────────────────────────── */
  .saulo-wrap {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .saulo-note {
    flex: 1;
    background: #fffde8;
    border: 1px solid #e8d840;
    border-radius: 6px;
    padding: 12px 14px;
    box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
  }
  .saulo-note-body { flex: 1; }
  .saulo-note-name {
    font-family: 'Dancing Script', cursive;
    font-size: 17px;
    color: #162040;
    margin-bottom: 1px;
  }
  .saulo-note-role {
    font-size: 10px;
    font-weight: 600;
    color: #1e3260;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }
  .saulo-note-text {
    font-size: 11px;
    line-height: 1.65;
    color: #444;
    font-style: italic;
  }

  /* ── INTRO PHRASE ────────────────────────────── */
  .intro-phrase {
    text-align: center;
    font-family: 'Dancing Script', cursive;
    font-size: 16px;
    color: #162040;
    line-height: 1.4;
    margin: 10px 0 12px;
    padding: 8px 20px;
  }

  /* ── COLLEAGUE BLOCKS ────────────────────────── */
  .colleague-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .colleague-block {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 8px 0;
    border-bottom: 1px solid #edf0f5;
  }
  .colleague-block:last-child { border-bottom: none; }
  .colleague-body { flex: 1; }
  .colleague-name {
    font-family: 'Dancing Script', cursive;
    font-size: 17px;
    color: #162040;
    margin-bottom: 1px;
    line-height: 1.2;
  }
  .colleague-role {
    font-size: 10px;
    font-weight: 700;
    color: #1e3260;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-bottom: 5px;
    border-bottom: 1.5px solid #1e3260;
    display: inline-block;
    padding-bottom: 1px;
  }
  .colleague-message {
    font-size: 11px;
    line-height: 1.65;
    color: #333;
  }

  /* ── NAVY FOOTER ─────────────────────────────── */
  .navy-footer {
    background: #162040;
    color: white;
    position: absolute;
    bottom: 7mm; left: 0; right: 0;
    display: flex;
    flex-direction: row;
  }
  .footer-label {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-family: 'Dancing Script', cursive;
    font-size: 16px;
    font-weight: 700;
    color: rgba(255,255,255,0.95);
    padding: 6px 12px;
    border-right: 1px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.15);
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
  .footer-values {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px 10px 6px 8px;
  }
  .value-item {
    padding: 6px 14px;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.95);
    letter-spacing: 0.4px;
    line-height: 1.2;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.22);
    background: rgba(255,255,255,0.06);
  }

  /* ── PAGE 2 FAMILY ───────────────────────────── */
  .family-phrase {
    text-align: center;
    font-family: 'Dancing Script', cursive;
    font-size: 18px;
    color: #162040;
    line-height: 1.5;
    margin: 6px 0 16px;
    padding: 0 10px;
  }
  .family-card {
    background: #fffde8;
    border: 1px solid #e8d840;
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 10px;
    box-shadow: 2px 2px 6px rgba(0,0,0,0.09);
    break-inside: avoid;
  }
  .family-card-name {
    font-family: 'Dancing Script', cursive;
    font-size: 14px;
    color: #162040;
    margin-bottom: 4px;
  }
  .family-card-message {
    font-size: 10.5px;
    line-height: 1.6;
    color: #333;
  }
`

export default function PreviewContent({ carta }: { carta: CartaComContribuicoes }) {
  const familyContribs = carta.contribuicoes.filter((c) => c.pagina === 2)
  const apenContribs = carta.contribuicoes.filter((c) => c.pagina === 1)

  const fixedColleagues = [
    { name: 'Mayra Luna', role: 'Diretora de Operações', message: carta.mensagem_admin, photo: '/images/mayra-luna.jpg' },
    { name: 'Túlio Cavalcanti', role: 'Diretor de Consultoria e Alocação', message: carta.mensagem_tulio, photo: '/images/tulio-cavalcanti.jpg' },
  ]

  function Avatar({ src, name, size }: { src?: string | null; name: string; size: 'lg' | 'md' | 'sm' | 'saulo' }) {
    const cls = `avatar-${size}`
    const borderColor = size === 'saulo' ? '#c8a800' : '#162040'
    const sizes = { lg: 130, md: 130, sm: 80, saulo: 84 }
    const px = sizes[size]
    if (src) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={name} className={cls} style={{ width: px, height: px, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${borderColor}`, flexShrink: 0 }} />
    }
    return (
      <div className={`${cls} avatar-placeholder`} style={{ width: px, height: px, borderRadius: '50%', border: `3px solid ${borderColor}`, background: '#d0d8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#162040', fontSize: px * 0.32, flexShrink: 0 }}>
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className="preview-root">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <PrintButton />

      {/* ── Cabeçalho fixo (só aparece no print) ── */}
      <div className="print-fixed-header">
        {carta.foto_colaborador_url
          ? <img src={carta.foto_colaborador_url} alt={carta.nome_colaborador} className="avatar-sm-print" />
          : <div className="avatar-placeholder-sm">{carta.nome_colaborador.charAt(0).toUpperCase()}</div>
        }
        <div className="carta-header-text">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-apen.png" alt="Åpen Capital" style={{ height: '16px', marginBottom: '3px', display: 'block' }} />
          <div className="font-cursive" style={{ fontSize: '28px', color: '#162040', lineHeight: 1.1 }}>
            {carta.nome_colaborador}
          </div>
        </div>
      </div>

      {/* ── Rodapé fixo (só aparece no print) ── */}
      <div className="print-fixed-footer">
        <div className="footer-label">Valores da Åpen</div>
        <div className="footer-values">
          {APEN_VALUES.map((v, i) => (
            <div key={i} className="value-item">{v}</div>
          ))}
        </div>
      </div>

      {/* ════════════════ PÁGINA 1 ════════════════ */}
      <div className="page">
        <div className="page-content">

          {/* Header */}
          <div className="carta-header">
            <Avatar src={carta.foto_colaborador_url} name={carta.nome_colaborador} size="lg" />
            <div className="carta-header-text">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-apen.png" alt="Åpen Capital" style={{ height: '20px', marginBottom: '4px', display: 'block' }} />
              <div className="font-cursive" style={{ fontSize: '36px', color: '#162040', lineHeight: 1.1 }}>
                {carta.nome_colaborador}
              </div>
            </div>
          </div>

          {/* Saulo — foto fora do bilhetinho, alinhada com os colegas */}
          <div className="saulo-wrap">
            <Avatar src="/images/saulo-godoy.jpg" name="Saulo Godoy" size="saulo" />
            <div className="saulo-note">
              <div className="saulo-note-name">Saulo Godoy</div>
              <div className="saulo-note-role">Sócio Fundador</div>
              <p className="saulo-note-text">{carta.mensagem_saulo}</p>
            </div>
          </div>

          {/* Frase de transição */}
          <div className="intro-phrase">{INTRO_PHRASE}</div>

          {/* Colegas fixos (Mayra e Túlio) */}
          <div className="colleague-list">
            {fixedColleagues.map((c, i) => (
              <div key={i} className="colleague-block">
                <Avatar src={c.photo} name={c.name} size="sm" />
                <div className="colleague-body">
                  <div className="colleague-name">{c.name}</div>
                  <div className="colleague-role">{c.role}</div>
                  <p className="colleague-message">
                    {c.message ?? <em style={{ color: '#aaa' }}>Mensagem ainda não enviada</em>}
                  </p>
                </div>
              </div>
            ))}
            {/* Colegas do time Åpen que enviaram via link */}
            {apenContribs.map((c) => (
              <div key={c.id} className="colleague-block">
                <Avatar src={c.foto_remetente_url} name={c.nome_remetente} size="sm" />
                <div className="colleague-body">
                  <div className="colleague-name">{c.nome_remetente}</div>
                  <div className="colleague-role">{c.cargo_remetente ?? ''}</div>
                  <p className="colleague-message">{c.mensagem}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Rodapé com valores */}
        <div className="navy-footer">
          <div className="footer-label">Valores da Åpen</div>
          <div className="footer-values">
            {APEN_VALUES.map((v, i) => (
              <div key={i} className="value-item">{v}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════ PÁGINA 2 ════════════════ */}
      <div className="page">
        <div className="page-content">

          {/* Header página 2 — idêntico à página 1 */}
          <div className="carta-header">
            <Avatar src={carta.foto_colaborador_url} name={carta.nome_colaborador} size="lg" />
            <div className="carta-header-text">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-apen.png" alt="Åpen Capital" style={{ height: '20px', marginBottom: '4px', display: 'block' }} />
              <div className="font-cursive" style={{ fontSize: '36px', color: '#162040', lineHeight: 1.1 }}>
                {carta.nome_colaborador}
              </div>
            </div>
          </div>

          {/* Frase da família — livre, sem caixa */}
          <p className="family-phrase">{FAMILY_PHRASE}</p>

          {/* Mensagens da família */}
          {familyContribs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#aaa', fontStyle: 'italic', fontSize: '12px' }}>
              Ainda não há mensagens de família registradas.
            </div>
          ) : (
            <div style={{ columns: 2, gap: '12px', marginBottom: '24px' }}>
              {familyContribs.map((c) => (
                <div key={c.id} className="family-card">
                  <div className="family-card-name">{c.nome_remetente}</div>
                  <p className="family-card-message">{c.mensagem}</p>
                </div>
              ))}
            </div>
          )}

          {/* Fotos da família */}
          {familyContribs.some((c) => c.fotos_familia_urls?.length) && (
            <div>
              <h3 className="font-cursive" style={{ fontSize: '17px', color: '#162040', marginBottom: '10px' }}>
                Fotos da Família
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                {familyContribs.flatMap((c) => c.fotos_familia_urls ?? []).map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt="Foto" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #1e3260' }} />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Rodapé com valores */}
        <div className="navy-footer">
          <div className="footer-label">Valores da Åpen</div>
          <div className="footer-values">
            {APEN_VALUES.map((v, i) => (
              <div key={i} className="value-item">{v}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
