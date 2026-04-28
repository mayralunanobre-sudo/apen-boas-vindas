import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { CartaComContribuicoes } from '@/lib/types'
import PrintButton from './PrintButton'

const FAMILY_PHRASE = `Você já tem uma família linda, esperamos, sinceramente, que aqui você também encontre uma segunda família super especial!`

const APEN_VALUES = [
  'TODOS POR TODOS',
  'ESPÍRITO DE DONO E INCONFORMISMO',
  'FOCO NO CLIENTE E NO SERVIÇO IMPECÁVEL',
  'DECISÕES ORIENTADAS POR DADOS COM ESPÍRITO INOVADOR',
  'RESPONSABILIDADE COM OS SONHOS DOS CLIENTES E DO NOSSO TIME',
]

const PRINT_CSS = `
  .preview-root { font-family: 'Inter', sans-serif; background: #f0f2f5; min-height: 100vh; padding: 20px 0; }
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 14mm 16mm 20mm;
    background: white;
    margin: 20px auto;
    position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  @media print {
    body { background: white !important; }
    .preview-root { background: white; padding: 0; }
    .page { margin: 0; box-shadow: none; page-break-after: always; }
    .page:last-child { page-break-after: avoid; }
    .no-print { display: none !important; }
  }
  @page { size: A4; margin: 0; }
  .font-cursive { font-family: 'Dancing Script', cursive; }
  .avatar { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid #1e3260; flex-shrink: 0; }
  .avatar-sm { width: 80px; height: 80px; }
  .avatar-placeholder { background: #d0d8ee; display: flex; align-items: center; justify-content: center; font-size: 28px; }
  .block-row { display: flex; gap: 14px; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #e0e8f0; }
  .block-row-rev { flex-direction: row-reverse; }
  .navy-footer { background: #162040; color: white; position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 16mm; display: flex; }
  .value-item { flex: 1; text-align: center; font-size: 8px; font-weight: 600; padding: 4px 6px; border-right: 1px solid rgba(255,255,255,0.3); }
  .value-item:last-child { border-right: none; }
  .sticky-note { background: #fffacd; border: 1px solid #f0e070; border-radius: 4px; padding: 14px 18px; margin-bottom: 16px; box-shadow: 3px 3px 8px rgba(0,0,0,0.12); }
  .family-card { background: #fffacd; border: 1px solid #f0e070; border-radius: 4px; padding: 12px; margin-bottom: 10px; box-shadow: 2px 2px 6px rgba(0,0,0,0.1); break-inside: avoid; }
`

async function getCarta(id: string): Promise<CartaComContribuicoes | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/cartas/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const carta = await getCarta(params.id)
  return { title: carta ? `Preview — ${carta.nome_colaborador}` : 'Preview' }
}

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const carta = await getCarta(params.id)
  if (!carta) notFound()

  const familyContribs = carta.contribuicoes.filter((c) => c.pagina === 2)

  const blocks = [
    { name: 'Mayra Luna', role: 'Diretora de Operações', message: carta.mensagem_admin, photo: '/images/mayra-luna.jpg' },
    { name: 'Túlio Cavalcanti', role: 'Diretor de Consultoria e Alocação', message: carta.mensagem_tulio, photo: '/images/tulio-cavalcanti.jpg' },
    { name: carta.pessoa1_nome, role: carta.pessoa1_cargo, message: carta.pessoa1_mensagem, photo: carta.pessoa1_foto_url },
    { name: carta.pessoa2_nome, role: carta.pessoa2_cargo, message: carta.pessoa2_mensagem, photo: carta.pessoa2_foto_url },
  ]

  return (
    <div className="preview-root">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <PrintButton />

      {/* PÁGINA 1 */}
      <div className="page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '3px solid #162040' }}>
          {carta.foto_colaborador_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={carta.foto_colaborador_url} alt={carta.nome_colaborador} className="avatar" />
          ) : (
            <div className="avatar avatar-placeholder">👤</div>
          )}
          <div style={{ flex: 1 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-apen.png" alt="Åpen Capital" style={{ height: '22px', marginBottom: '6px' }} />
            <div className="font-cursive" style={{ fontSize: '38px', color: '#162040', lineHeight: 1.1 }}>{carta.nome_colaborador}</div>
          </div>
        </div>

        <div className="sticky-note">
          <p style={{ fontSize: '11.5px', lineHeight: 1.7, color: '#444' }}>{carta.mensagem_saulo}</p>
        </div>

        {blocks.map((b, i) => (
          <div key={i} className={`block-row${i % 2 !== 0 ? ' block-row-rev' : ''}`}>
            {b.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.photo} alt={b.name} className="avatar avatar-sm" />
            ) : (
              <div className="avatar avatar-sm avatar-placeholder">👤</div>
            )}
            <div style={{ flex: 1 }}>
              <div className="font-cursive" style={{ fontSize: '18px', color: '#162040', marginBottom: '2px' }}>{b.name}</div>
              <div style={{ fontWeight: 700, textDecoration: 'underline', textDecorationColor: '#1e3260', fontSize: '12px', color: '#1e3260', marginBottom: '8px' }}>{b.role}</div>
              <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#333' }}>
                {b.message ?? <em style={{ color: '#999' }}>Mensagem ainda não enviada</em>}
              </p>
            </div>
          </div>
        ))}

        <div className="navy-footer">
          {APEN_VALUES.map((v, i) => (
            <div key={i} className="value-item">{v}</div>
          ))}
        </div>
      </div>

      {/* PÁGINA 2 */}
      <div className="page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '3px solid #162040' }}>
          {carta.foto_colaborador_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={carta.foto_colaborador_url} alt={carta.nome_colaborador} className="avatar avatar-sm" />
          ) : (
            <div className="avatar avatar-sm avatar-placeholder">👤</div>
          )}
          <div>
            <div className="font-cursive" style={{ fontSize: '32px', color: '#162040' }}>{carta.nome_colaborador}</div>
            <div style={{ fontSize: '12px', color: '#1e3260', marginTop: '4px', fontStyle: 'italic' }}>{FAMILY_PHRASE}</div>
          </div>
        </div>

        {familyContribs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontStyle: 'italic' }}>
            Ainda não há mensagens de família registradas.
          </div>
        ) : (
          <div style={{ columns: 2, gap: '12px', marginBottom: '24px' }}>
            {familyContribs.map((c) => (
              <div key={c.id} className="family-card">
                <div className="font-cursive" style={{ fontSize: '15px', color: '#162040', marginBottom: '6px' }}>{c.nome_remetente}</div>
                <p style={{ fontSize: '11px', lineHeight: 1.6, color: '#333' }}>{c.mensagem}</p>
              </div>
            ))}
          </div>
        )}

        {familyContribs.some((c) => c.fotos_familia_urls?.length) && (
          <div>
            <h3 className="font-cursive" style={{ fontSize: '18px', color: '#162040', marginBottom: '12px' }}>Fotos da Família</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
              {familyContribs.flatMap((c) => c.fotos_familia_urls ?? []).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt="Foto" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #1e3260' }} />
              ))}
            </div>
          </div>
        )}

        <div className="navy-footer">
          {APEN_VALUES.map((v, i) => (
            <div key={i} className="value-item">{v}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
