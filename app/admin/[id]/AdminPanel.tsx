'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Image from 'next/image'
import type { CartaComContribuicoes, Contribuicao } from '@/lib/types'

const AUTH_KEY = 'apen_admin_authed'

type Props = { carta: CartaComContribuicoes }

export default function AdminPanel({ carta: initialCarta }: Props) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [carta, setCarta] = useState(initialCarta)

  // Verifica se já estava logada e busca dados frescos
  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === 'true') {
      setAuthed(true)
      fetch(`/api/cartas/${initialCarta.id}?t=${Date.now()}`)
        .then((r) => r.json())
        .then((data) => setCarta(data))
    }
  }, [initialCarta.id])
  const [pdfTip, setPdfTip] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [movingId, setMovingId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [editingMessages, setEditingMessages] = useState(false)
  const [msgSaulo, setMsgSaulo] = useState(carta.mensagem_saulo ?? '')
  const [msgTulio, setMsgTulio] = useState(carta.mensagem_tulio ?? '')
  const [savingMessages, setSavingMessages] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function handleSaveMessages() {
    setSavingMessages(true)
    setSaveError('')
    try {
      const res = await fetch(`/api/cartas/${carta.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem_saulo: msgSaulo, mensagem_tulio: msgTulio }),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      setCarta((prev) => ({ ...prev, mensagem_admin: msgAdmin, mensagem_saulo: msgSaulo, mensagem_tulio: msgTulio }))
      setEditingMessages(false)
    } catch {
      setSaveError('Erro ao salvar. Tente novamente.')
    } finally {
      setSavingMessages(false)
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    try {
      const res = await fetch(`/api/cartas/${carta.id}`)
      if (res.ok) {
        const data = await res.json()
        setCarta(data)
      }
    } finally {
      setRefreshing(false)
    }
  }

  async function handleLogin(e: FormEvent) {
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
      localStorage.setItem(AUTH_KEY, 'true')
      setAuthed(true)
      // busca dados frescos ao autenticar
      const cartaRes = await fetch(`/api/cartas/${initialCarta.id}?t=${Date.now()}`)
      if (cartaRes.ok) {
        const data = await cartaRes.json()
        setCarta(data)
      }
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

  function handleGeneratePDF() {
    window.open(`/preview/${carta.id}`, '_blank')
    setPdfTip(true)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full card">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-apen.png" alt="Åpen Capital" className="h-8" />
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

  const contrib1 = carta.contribuicoes.filter((c) => c.pagina === 1)
  const contrib2 = carta.contribuicoes.filter((c) => c.pagina === 2)
  const cartaUrl = `${window.location.origin}/carta/${carta.slug ?? carta.id}`

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-apen.png" alt="Åpen Capital" className="h-6" />
              <a href="/admin" className="text-sm text-apen-medium hover:text-apen-dark transition-colors flex items-center gap-1">
                ← Todas as cartas
              </a>
            </div>
            <h1 className="section-title text-3xl">Carta de {carta.nome_colaborador}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary text-sm py-2 px-4"
              title="Atualizar status"
            >
              {refreshing ? '...' : '🔄 Atualizar'}
            </button>
            <a
              href={`/preview/${carta.id}`}
              target="_blank"
              className="btn-secondary text-sm py-2 px-4"
            >
              Preview
            </a>
            <button
              onClick={handleGeneratePDF}
              className="btn-primary text-sm py-2 px-4"
            >
              🖨️ Gerar PDF
            </button>
          </div>
        </div>

        {pdfTip && (
          <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-4 text-sm flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="font-semibold mb-1">O preview foi aberto em uma nova aba!</p>
              <p>Na aba de preview, pressione <kbd className="bg-white border border-gray-300 rounded px-1.5 py-0.5 font-mono text-xs">Ctrl+P</kbd> (Windows) ou <kbd className="bg-white border border-gray-300 rounded px-1.5 py-0.5 font-mono text-xs">⌘+P</kbd> (Mac), selecione <strong>&quot;Salvar como PDF&quot;</strong> como destino e clique em Salvar.</p>
            </div>
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
            <StatusItem label="Saulo Godoy (Sócio Fundador)" done={true} />
            <StatusItem label="Mayra Luna (Diretora de Operações)" done={!!carta.mensagem_admin} />
            <StatusItem label="Túlio Cavalcanti (mensagem fixa)" done={true} />
            <StatusItem
              label={`Time Åpen — ${contrib1.length} mensage${contrib1.length !== 1 ? 'ns' : 'm'} recebida${contrib1.length !== 1 ? 's' : ''} via link`}
              done={contrib1.length > 0}
            />
          </div>
        </div>

        {/* Edição de mensagens fixas */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-apen-dark">Mensagens fixas</h3>
            {!editingMessages ? (
              <button onClick={() => setEditingMessages(true)} className="btn-secondary text-sm py-1.5 px-3">
                ✏️ Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setEditingMessages(false); setSaveError('') }} className="btn-secondary text-sm py-1.5 px-3">
                  Cancelar
                </button>
                <button onClick={handleSaveMessages} disabled={savingMessages} className="btn-primary text-sm py-1.5 px-3">
                  {savingMessages ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[
              { label: 'Saulo Godoy', value: msgSaulo, onChange: setMsgSaulo },
              { label: 'Túlio Cavalcanti', value: msgTulio, onChange: setMsgTulio },
            ].map(({ label, value, onChange }) => (
              <div key={label}>
                <label className="label">{label}</label>
                {editingMessages ? (
                  <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={4}
                    className="input-field resize-y text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">{value || <em className="text-gray-400">Sem mensagem</em>}</p>
                )}
              </div>
            ))}
          </div>

          {saveError && <p className="text-red-600 text-sm mt-3">{saveError}</p>}
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
