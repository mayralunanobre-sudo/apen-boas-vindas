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

  /* ── Tabela principal ── */
  .carta-table {
    width: 210mm;
    margin: 0 auto 32px;
    background: white;
    box-shadow: 0 8px 40px rgba(0,0,0,0.18);
    border-collapse: collapse;
  }

  /* ── CABEÇALHO ── */
  .header-cell {
    padding: 12mm 16mm 8mm;
    border-bottom: 3px solid #162040;
    background: white;
  }
  .carta-header { display: flex; align-items: center; gap: 16px; }
  .carta-header-text { flex: 1; }

  /* ── CONTEÚDO ── */
  .content-cell {
    padding: 10mm 16mm 12mm;
    vertical-align: top;
  }

  /* ── RODAPÉ (tela: no final; print: fixo em toda página) ── */
  .footer-screen {
    background: #162040;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .footer-screen td {
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .footer-inner {
    background: #162040;
    display: flex;
    flex-direction: row;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-footer-fixed { display: none; }

  .footer-label {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-family: 'Dancing Script', cursive;
    font-size: 16px; font-weight: 700;
    color: rgba(255,255,255,0.95);
    padding: 6px 12px;
    border-right: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.15);
    letter-spacing: 0.5px; white-space: nowrap;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .footer-values { flex:1; display:flex; flex-direction:column; gap:4px; padding:6px 10px 6px 8px; }
  .value-item {
    padding: 6px 14px; font-size: 11px; font-weight: 600;
    color: rgba(255,255,255,0.95); letter-spacing: 0.4px; line-height: 1.2;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.22);
    background: rgba(255,255,255,0.06);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── TYPOGRAPHY ── */
  .font-cursive { font-family: 'Dancing Script', cursive; }

  /* ── AVATARS ── */
  .avatar-lg    { width:130px; height:130px; border-radius:50%; object-fit:cover; border:3px solid #162040; flex-shrink:0; }
  .avatar-sm    { width:80px;  height:80px;  border-radius:50%; object-fit:cover; border:3px solid #162040; flex-shrink:0; }
  .avatar-saulo { width:84px;  height:84px;  border-radius:50%; object-fit:cover; border:3px solid #c8a800; flex-shrink:0; }
  .avatar-placeholder { background:#d0d8ee; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#162040; }

  /* ── SAULO ── */
  .saulo-wrap { display:flex; gap:14px; align-items:flex-start; margin-bottom:12px; }
  .saulo-note { flex:1; background:#fffde8; border:1px solid #e8d840; border-radius:6px; padding:12px 14px; box-shadow:3px 3px 10px rgba(0,0,0,0.1); }
  .saulo-note-name { font-family:'Dancing Script',cursive; font-size:17px; color:#162040; margin-bottom:1px; }
  .saulo-note-role { font-size:10px; font-weight:600; color:#1e3260; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
  .saulo-note-text { font-size:11px; line-height:1.65; color:#444; font-style:italic; }

  /* ── FRASES ── */
  .intro-phrase { text-align:center; font-family:'Dancing Script',cursive; font-size:16px; color:#162040; line-height:1.4; margin:10px 0 12px; padding:8px 20px; }
  .family-phrase { text-align:center; font-family:'Dancing Script',cursive; font-size:18px; color:#162040; line-height:1.5; margin:14px 0 16px; padding:0 10px; }

  /* ── COLEGAS ── */
  .colleague-list { display:flex; flex-direction:column; }
  .colleague-block { display:flex; gap:14px; align-items:flex-start; padding:8px 0; border-bottom:1px solid #edf0f5; break-inside:avoid; }
  .colleague-block:last-child { border-bottom:none; }
  .colleague-body { flex:1; }
  .colleague-name { font-family:'Dancing Script',cursive; font-size:17px; color:#162040; margin-bottom:1px; line-height:1.2; }
  .colleague-role { font-size:10px; font-weight:700; color:#1e3260; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:5px; border-bottom:1.5px solid #1e3260; display:inline-block; padding-bottom:1px; }
  .colleague-message { font-size:11px; line-height:1.65; color:#333; }

  /* ── FAMÍLIA ── */
  .family-grid { columns:2; gap:12px; margin-bottom:20px; }
  .family-card { background:#fffde8; border:1px solid #e8d840; border-radius:6px; padding:10px 12px; margin-bottom:10px; box-shadow:2px 2px 6px rgba(0,0,0,0.09); break-inside:avoid; }
  .family-card-name { font-family:'Dancing Script',cursive; font-size:14px; color:#162040; margin-bottom:4px; }
  .family-card-message { font-size:10.5px; line-height:1.6; color:#333; }

  /* ── FOTOS ── */
  .photos-title { font-family:'Dancing Script',cursive; font-size:17px; color:#162040; margin-bottom:10px; margin-top:6px; }
  .photos-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
  .photo-img { width:100%; height:190px; object-fit:cover; border-radius:8px; border:2px solid #1e3260; break-inside:avoid; }

  /* ── PRINT ── */
  @media print {
    body { background: white !important; margin: 0; padding: 0; }
    .preview-root { background: white; padding: 0; }
    .no-print { display: none !important; }

    .carta-table { width: 100%; box-shadow: none; margin: 0; }

    /* thead do Chrome: repete cabeçalho em cada página automaticamente */
    thead { display: table-header-group; }
    .header-cell {
      background: white !important;
      -webkit-print-color-adjust: exact;
    }

    /* Rodapé: fixo no fundo de cada página */
    .footer-screen { display: none !important; }
    .print-footer-fixed {
      display: flex !important;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 9999;
      flex-direction: row;
      background: #162040 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-footer-fixed .footer-label {
      background: rgba(0,0,0,0.15) !important;
      -webkit-print-color-adjust: exact !important;
    }
    .print-footer-fixed .value-item {
      background: rgba(255,255,255,0.06) !important;
      -webkit-print-color-adjust: exact !important;
    }

    /* Espaço após cabeçalho (em todas as páginas que ele repete) */
    .header-cell { padding-bottom: 10mm !important; }

    /* Espaço no fundo do conteúdo para não ficar atrás do rodapé fixo */
    .content-cell { padding-top: 0 !important; padding-bottom: 55mm !important; }
  }

  @page { size: A4; margin: 0; }
`

export default function PreviewContent({ carta }: { carta: CartaComContribuicoes }) {
  const familyContribs = carta.contribuicoes.filter((c) => c.pagina === 2)
  const apenContribs = carta.contribuicoes.filter((c) => c.pagina === 1)
  const allPhotos = familyContribs.flatMap((c) => c.fotos_familia_urls ?? [])

  const fixedColleagues = [
    { name: 'Mayra Luna', role: 'Diretora de Operações', message: carta.mensagem_admin, photo: '/images/mayra-luna.jpg' },
    { name: 'Túlio Cavalcanti', role: 'Diretor de Consultoria e Alocação', message: carta.mensagem_tulio, photo: '/images/tulio-cavalcanti.jpg' },
  ]

  function Avatar({ src, name, size }: { src?: string | null; name: string; size: 'lg' | 'sm' | 'saulo' }) {
    const borderColor = size === 'saulo' ? '#c8a800' : '#162040'
    const sizes = { lg: 130, sm: 80, saulo: 84 }
    const px = sizes[size]
    if (src) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={name} className={`avatar-${size}`} style={{ width: px, height: px, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${borderColor}`, flexShrink: 0 }} />
    }
    return (
      <div className={`avatar-${size} avatar-placeholder`} style={{ width: px, height: px, borderRadius: '50%', border: `3px solid ${borderColor}`, background: '#d0d8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#162040', fontSize: px * 0.3, flexShrink: 0 }}>
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }

  const FooterInner = () => (
    <div className="footer-inner">
      <div className="footer-label">Valores da Åpen</div>
      <div className="footer-values">
        {APEN_VALUES.map((v, i) => <div key={i} className="value-item">{v}</div>)}
      </div>
    </div>
  )

  return (
    <div className="preview-root">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <PrintButton />

      {/* Rodapé fixo — só aparece no print, em TODAS as páginas */}
      <div className="print-footer-fixed">
        <div style={{
          backgroundColor: '#162040',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          WebkitPrintColorAdjust: 'exact',
        } as React.CSSProperties}>
          <FooterInner />
        </div>
      </div>

      {/* Tabela principal */}
      <table className="carta-table">

        {/* THEAD: Chrome repete automaticamente em todas as páginas no print */}
        <thead>
          <tr>
            <td className="header-cell">
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
            </td>
          </tr>
        </thead>

        {/* TFOOT: aparece no final (tela) */}
        <tfoot className="footer-screen">
          <tr>
            <td><FooterInner /></td>
          </tr>
        </tfoot>

        {/* TBODY: todo o conteúdo */}
        <tbody>
          <tr>
            <td className="content-cell">

              {/* Saulo */}
              <div className="saulo-wrap">
                <Avatar src="/images/saulo-godoy.jpg" name="Saulo Godoy" size="saulo" />
                <div className="saulo-note">
                  <div className="saulo-note-name">Saulo Godoy</div>
                  <div className="saulo-note-role">Sócio Fundador</div>
                  <p className="saulo-note-text">{carta.mensagem_saulo}</p>
                </div>
              </div>

              <div className="intro-phrase">{INTRO_PHRASE}</div>

              {/* Time Åpen */}
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

              {/* Família */}
              {familyContribs.length > 0 && (
                <>
                  <p className="family-phrase">{FAMILY_PHRASE}</p>
                  {familyContribs.some((c) => c.mensagem?.trim()) && (
                    <div className="family-grid">
                      {familyContribs.filter((c) => c.mensagem?.trim()).map((c) => (
                        <div key={c.id} className="family-card">
                          <div className="family-card-name">{c.nome_remetente}</div>
                          <p className="family-card-message">{c.mensagem}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Fotos */}
              {allPhotos.length > 0 && (
                <>
                  <p className="photos-title">Fotos</p>
                  <div className="photos-grid">
                    {allPhotos.map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={url} alt="Foto" className="photo-img" />
                    ))}
                  </div>
                </>
              )}

            </td>
          </tr>
        </tbody>

      </table>
    </div>
  )
}
