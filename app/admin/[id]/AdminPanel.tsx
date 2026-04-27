'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CartaComContribuicoes, Contribuicao } from '@/lib/types'

type Props = { carta: CartaComContribuicoes }

export default function AdminPanel({ carta: initialCarta }: Props) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [carta, setCarta] = useState(initialCarta)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [movingId, setMovingId] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setAuthError('Senha incorreta.')
        return
      }
      setAuthed(true)
    } catch {
      setAuthError('Erro ao verificar senha.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover esta contribuição?')) return
    setDeletingId(id)
    try {
      await fetch(`/api/contribuicoes/${id}`, { method: 'DELETE' })
      setCarta((prev) => ({
        ...prev,
        contribuicoes: prev.contribuicoes.filter((c) => c.id !== id),
      }))
    } finally {
      setDeletingId(null)
    }
  }

  async function handleMovePage(id: string, pagina: 1 | 2) {
    setMovingId(id)
    try {
      const res = await fetch(`/api/contribuicoes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagina }),
      })
      if (res.ok) {
        setCarta((prev) => ({
          ...prev,
          contribuicoes: prev.contribuicoes.map((c) =>
            c.id === id ? { ...c, pagina } : c
          ),
        }))
      }
    } finally {
      setMovingId(null)
    }
  }

  async function handleGeneratePDF() {
    setLoadingPdf(true)
    setPdfError('')
    try {
      const res = await fetch(`/api/pdf/${carta.id}`)
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Erro ao gerar PDF')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `carta-boas-vindas-${carta.nome_colaborador.replace(/\s+/g, '-').toLowerCase()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      setPdfError(err instanceof Error ? err.message : 'Erro ao gerar PDF')
    } finally {
      setLoadingPdf(false)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full card">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-apen-dark rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">Å</span>
            </div>
            <h1 className="text-xl font-bold text-apen-dark">Painel Administrativo</h1>
            <p className="text-sm text-gray-500 mt-1">Carta de {initialCarta.nome_colaborador}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Senha de acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="input-field"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-red-600 text-sm">{authError}</p>
            )}
            <button type="submit" className="btn-primary w-full">Entrar</button>
          </form>
        </div>
      </div>
    )
  }

  const p1Ok = !!carta.pessoa1_mensagem
  const p2Ok = !!carta.pessoa2_mensagem
  const contrib1 = carta.contribuicoes.filter((c) => c.pagina === 1)
  const contrib2 = carta.contribuicoes.filter((c) => c.pagina === 2)
  const cartaUrl = `${window.location.origin}/carta/${carta.id}`

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-apen-medium font-semibold uppercase tracking-widest mb-1">Åpen Capital — Painel Admin</div>
            <h1 className="section-title text-3xl">Carta de {carta.nome_colaborador}</h1>
          </div>
          <div className="flex gap-2">
            <a
              href={`/preview/${carta.id}`}
              target="_blank"
              className="btn-secondary text-sm py-2 px-4"
            >
              Preview
            </a>
            <button
              onClick={handleGeneratePDF}
              disabled={loadingPdf}
              className="btn-primary text-sm py-2 px-4"
            >
              {loadingPdf ? 'Gerando...' : 'Gerar PDF'}
            </button>
          </div>
        </div>

        {pdfError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {pdfError}
          </div>
        )}

        {/* Link compartilhável */}
        <div className="card">
          <h3 className="font-bold text-apen-dark mb-2">Link colaborativo</h3>
          <div className="flex gap-2">
            <input
              readOnly
              value={cartaUrl}
              className="input-field flex-1 text-sm bg-gray-50"
            />
            <button
              onClick={() => navigator.clipboard.writeText(cartaUrl)}
              className="btn-secondary text-sm py-2 px-4 flex-shrink-0"
            >
              Copiar
            </button>
          </div>
        </div>

        {/* Status de preenchimento */}
        <div className="card">
          <h3 className="font-bold text-apen-dark mb-4">Status de preenchimento</h3>
          <div className="space-y-3">
            <StatusItem label="Mayra Luna (Diretora de Operações)" done={!!carta.mensagem_admin} />
            <StatusItem label="Túlio Cavalcanti (mensagem fixa)" done={true} />
            <StatusItem label={`${carta.pessoa1_nome} (${carta.pessoa1_cargo})`} done={p1Ok} />
            <StatusItem label={`${carta.pessoa2_nome} (${carta.pessoa2_cargo})`} done={p2Ok} />
            <StatusItem label={`${carta.nome_admin} (${carta.cargo_admin})`} done={!!carta.mensagem_admin} />
          </div>
        </div>

        {/* Colaborador */}
        <div className="card">
          <h3 className="font-bold text-apen-dark mb-4">Dados do colaborador</h3>
          <div className="flex items-center gap-4">
            {carta.foto_colaborador_url && (
              <Image
                src={carta.foto_colaborador_url}
                alt={carta.nome_colaborador}
                width={64}
                height={64}
                className="avatar-circle w-16 h-16"
              />
            )}
            <div>
              <p className="font-cursive text-2xl text-apen-dark">{carta.nome_colaborador}</p>
            </div>
          </div>
        </div>

        {/* Contribuições página 1 */}
        <div className="card">
          <h3 className="font-bold text-apen-dark mb-1">Contribuições — Página 1 (Equipe Åpen)</h3>
          <p className="text-xs text-gray-500 mb-4">Mensagens que aparecem na página de boas-vindas da equipe</p>
          {contrib1.length === 0 ? (
            <p className="text-gray-400 text-sm italic">Nenhuma contribuição nesta página</p>
          ) : (
            <div className="space-y-3">
              {contrib1.map((c) => (
                <ContribCard
                  key={c.id}
                  contrib={c}
                  currentPage={1}
                  onDelete={handleDelete}
                  onMove={handleMovePage}
                  deletingId={deletingId}
                  movingId={movingId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contribuições página 2 */}
        <div className="card">
          <h3 className="font-bold text-apen-dark mb-1">Contribuições — Página 2 (Família)</h3>
          <p className="text-xs text-gray-500 mb-4">Mensagens e fotos de família</p>
          {contrib2.length === 0 ? (
            <p className="text-gray-400 text-sm italic">Nenhuma contribuição de família ainda</p>
          ) : (
            <div className="space-y-3">
              {contrib2.map((c) => (
                <ContribCard
                  key={c.id}
                  contrib={c}
                  currentPage={2}
                  onDelete={handleDelete}
                  onMove={handleMovePage}
                  deletingId={deletingId}
                  movingId={movingId}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function StatusItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${done ? 'bg-green-50' : 'bg-yellow-50'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-apen-medium' : 'bg-yellow-400'}`}>
        {done ? (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${done ? 'text-apen-dark font-medium' : 'text-yellow-800'}`}>
        {label}
        {!done && <span className="ml-2 text-xs font-normal">(pendente)</span>}
      </span>
    </div>
  )
}

function ContribCard({
  contrib,
  currentPage,
  onDelete,
  onMove,
  deletingId,
  movingId,
}: {
  contrib: Contribuicao
  currentPage: 1 | 2
  onDelete: (id: string) => void
  onMove: (id: string, pagina: 1 | 2) => void
  deletingId: string | null
  movingId: string | null
}) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-white">
      <div className="flex items-start gap-3">
        {contrib.foto_remetente_url && (
          <Image
            src={contrib.foto_remetente_url}
            alt={contrib.nome_remetente}
            width={48}
            height={48}
            className="avatar-circle w-12 h-12 flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-apen-dark">{contrib.nome_remetente}</p>
          <p className="text-sm text-gray-600 mt-1">{contrib.mensagem}</p>
          {contrib.fotos_familia_urls && contrib.fotos_familia_urls.length > 0 && (
            <p className="text-xs text-apen-medium mt-1">
              {contrib.fotos_familia_urls.length} foto(s) de família
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {new Date(contrib.criado_em).toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => onMove(contrib.id, currentPage === 1 ? 2 : 1)}
          disabled={movingId === contrib.id}
          className="text-xs border border-apen-medium text-apen-medium px-3 py-1.5 rounded hover:bg-apen-dark hover:text-white hover:border-apen-dark transition-colors disabled:opacity-50"
        >
          {movingId === contrib.id ? '...' : `Mover para pág. ${currentPage === 1 ? 2 : 1}`}
        </button>
        <button
          onClick={() => onDelete(contrib.id)}
          disabled={deletingId === contrib.id}
          className="text-xs border border-red-300 text-red-500 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-50 ml-auto"
        >
          {deletingId === contrib.id ? '...' : 'Remover'}
        </button>
      </div>
    </div>
  )
}
