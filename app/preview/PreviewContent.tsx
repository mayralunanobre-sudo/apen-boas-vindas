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
    background: white;
    margin: 0 auto 32px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.18);
    display: flex;
    flex-direction: column;
  }

  /* ── HEADER (aparece na tela e é fixo no print) ── */
  .carta-header-wrapper {
    padding: 12mm 16mm 8mm;
    border-bottom: 3px solid #162040;
    background: white;
  }
  .carta-header {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .carta-header-text { flex: 1; }

  /* ── BODY ───────────────────────────────────────── */
  .page-body {
    padding: 8mm 16mm 6mm;
    flex: 1;
  }

  /* ── FOOTER VALORES (azul + amarelo) ─────────────── */
  .values-footer {
    border-top: 3px solid #c8a800;
    background: white;
    padding: 7px 16mm;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .footer-label-text {
    font-family: 'Dancing Script', cursive;
    color: #162040;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    margin-right: 6px;
    flex-shrink: 0;
  }
  .value-pill {
    color: #162040;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.35px;
    padding: 3px 9px;
    border-radius: 20px;
    border: 1.5px solid #c8a800;
    background: rgba(200,168,0,0.07);
    white-space: nowrap;
  }

  /* ── TYPOGRAPHY ──────────────────────────────────── */
  .font-cursive { font-family: 'Dancing Script', cursive; }

  /* ── AVATARS ─────────────────────────────────────── */
  .avatar-lg  { width:130px; height:130px; border-radius:50%; object-fit:cover; border:3px solid #162040; flex-shrink:0; }
  .avatar-sm  { width:80px;  height:80px;  border-radius:50%; object-fit:cover; border:3px solid #162040; flex-shrink:0; }
  .avatar-saulo { width:84px; height:84px; border-radius:50%; object-fit:cover; border:3px solid #c8a800; flex-shrink:0; }
  .avatar-placeholder {
    background:#d0d8ee; display:flex; align-items:center; justify-content:center;
    font-weight:bold; color:#162040;
  }

  /* ── SAULO ───────────────────────────────────────── */
  .saulo-wrap { display:flex; gap:14px; align-items:flex-start; margin-bottom:10px; }
  .saulo-note { flex:1; background:#fffde8; border:1px solid #e8d840; border-radius:6px; padding:12px 14px; box-shadow:3px 3px 10px rgba(0,0,0,0.1); }
  .saulo-note-name { font-family:'Dancing Script',cursive; font-size:17px; color:#162040; margin-bottom:1px; }
  .saulo-note-role { font-size:10px; font-weight:600; color:#1e3260; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
  .saulo-note-text { font-size:11px; line-height:1.65; color:#444; font-style:italic; }

  /* ── INTRO / FAMILY PHRASES ──────────────────────── */
  .intro-phrase {
    text-align:center; font-family:'Dancing Script',cursive; font-size:15px;
    color:#162040; line-height:1.4; margin:8px 0 10px; padding:6px 20px;
  }
  .family-phrase {
    text-align:center; font-family:'Dancing Script',cursive; font-size:17px;
    color:#162040; line-height:1.5; margin:14px 0 12px; padding:0 10px;
    border-top: 1px dashed #c8a800; padding-top: 12px;
  }

  /* ── COLLEAGUES ──────────────────────────────────── */
  .colleague-list { display:flex; flex-direction:column; gap:0; }
  .colleague-block { display:flex; gap:14px; align-items:flex-start; padding:8px 0; border-bottom:1px solid #edf0f5; break-inside:avoid; }
  .colleague-block:last-child { border-bottom:none; }
  .colleague-body { flex:1; }
  .colleague-name { font-family:'Dancing Script',cursive; font-size:17px; color:#162040; margin-bottom:1px; line-height:1.2; }
  .colleague-role { font-size:10px; font-weight:700; color:#1e3260; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:5px; border-bottom:1.5px solid #1e3260; display:inline-block; padding-bottom:1px; }
  .colleague-message { font-size:11px; line-height:1.65; color:#333; }

  /* ── FAMILY CARDS ────────────────────────────────── */
  .family-grid { columns:2; gap:12px; margin-bottom:16px; }
  .family-card { background:#fffde8; border:1px solid #e8d840; border-radius:6px; padding:10px 12px; margin-bottom:10px; box-shadow:2px 2px 6px rgba(0,0,0,0.09); break-inside:avoid; }
  .family-card-name { font-family:'Dancing Script',cursive; font-size:14px; color:#162040; margin-bottom:4px; }
  .family-card-message { font-size:10.5px; line-height:1.6; color:#333; }

  /* ── PHOTOS ──────────────────────────────────────── */
  .photos-title { font-family:'Dancing Script',cursive; font-size:17px; color:#162040; margin-bottom:10px; }
  .photos-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
  .photo-item { width:100%; height:180px; object-fit:cover; border-radius:8px; border:2px solid #1e3260; break-inside:avoid; }

  /* ── PRINT ───────────────────────────────────────── */
  @media print {
    body { background:white !important; margin:0; }
    .preview-root { background:white; padding:0; }
    .no-print { display:none !important; }
    .page { width:100%; box-shadow:none; margin:0; }

    /* Header fixo em todas as páginas */
    .carta-header-wrapper {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 6mm 16mm 4mm;
    }

    /* Footer fixo em todas as páginas */
    .values-footer {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 100;
      padding: 5px 16mm;
    }

    /* Espaço para não sobrepor header/footer */
    .page-body {
      padding-top: 38mm;
      padding-bottom: 28mm;
    }
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
    const cls = `avatar-${size}`
    const borderColor = size === 'saulo' ? '#c8a800' : '#162040'
    const sizes = { lg: 130, sm: 80, saulo: 84 }
    const px = sizes[size]
    if (src) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={name} className={cls} style={{ width: px, height: px, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${borderColor}`, flexShrink: 0 }} />
    }
    return (
      <div className={`${cls} avatar-placeholder`} style={{ width: px, height: px, borderRadius: '50%', border: `3px solid ${borderColor}`, background: '#d0d8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#162040', fontSize: px * 0.3, flexShrink: 0 }}>
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }

  const Header = () => (
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
  )

  const ValuesFooter = () => (
    <div className="values-footer">
      <span className="footer-label-text">Valores da Åpen</span>
      {APEN_VALUES.map((v, i) => (
        <span key={i} className="value-pill">{v}</span>
      ))}
    </div>
  )

  return (
    <div className="preview-root">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <PrintButton />

      <div className="page">

        {/* Header — aparece na tela E fixo no print */}
        <div className="carta-header-wrapper">
          <Header />
        </div>

        {/* Conteúdo principal */}
        <div className="page-body">

          {/* Saulo */}
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

          {/* Time Åpen — Mayra, Túlio + contribuições */}
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

          {/* Família — logo na sequência */}
          {(familyContribs.length > 0 || allPhotos.length > 0) && (
            <>
              <p className="family-phrase">{FAMILY_PHRASE}</p>

              {familyContribs.length > 0 && (
                <div className="family-grid">
                  {familyContribs.map((c) => (
                    <div key={c.id} className="family-card">
                      <div className="family-card-name">{c.nome_remetente}</div>
                      <p className="family-card-message">{c.mensagem}</p>
                    </div>
                  ))}
                </div>
              )}

              {allPhotos.length > 0 && (
                <>
                  <p className="photos-title">Fotos</p>
                  <div className="photos-grid">
                    {allPhotos.map((url, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={url} alt="Foto" className="photo-item" />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

        </div>

        {/* Rodapé valores */}
        <ValuesFooter />

      </div>
    </div>
  )
}
