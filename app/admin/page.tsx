'use client'

import { useState, useEffect, type FormEvent } from 'react'

type CartaResumo = {
  id: string
  nome_colaborador: string
  criado_em: string
  pessoa1_nome: string
  pessoa1_mensagem: string | null
  pessoa2_nome: string
  pessoa2_mensagem: string | null
  contribuicoes: { id: string; pagina: number; fotos_familia_urls: string[] | null }[]
}

const AUTH_KEY = 'apen_admin_authed'

export default function AdminListPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [cartas, setCartas] = useState<CartaResumo[]>([])
  const [loading, setLoading] = useState(false)

  // Verifica se já estava logada
  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === 'true') {
      setAuthed(true)
    }
  }, [])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setAuthError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) { setAuthError('Senha incorreta.'); return }
      localStorage.setItem(AUTH_KEY, 'true')
      setAuthed(true)
    } catch {
      setAuthError('Erro ao verificar senha.')
    }
  }

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch('/api/cartas')
      .then((r) => r.json())
      .then((data) => setCartas(data))
      .finally(() => setLoading(false))
  }, [authed])

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full card">
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-apen.png" alt="Åpen Capital" className="h-7" />
          </div>
          <h1 className="section-title text-center mb-6">Cartas iniciadas</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Senha de administrador</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            {authError && <p className="text-red-600 text-sm">{authError}</p>}
            <button type="submit" className="btn-primary w-full">Entrar</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-apen.png" alt="Åpen Capital" className="h-6 mb-2" />
            <h1 className="section-title text-2xl">Cartas iniciadas</h1>
          </div>
          <a href="/" className="btn-secondary text-sm py-2 px-4">+ Nova carta</a>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Carregando...</div>
        ) : cartas.length === 0 ? (
          <div className="card text-center text-gray-400 py-20">Nenhuma carta criada ainda.</div>
        ) : (
          <div className="space-y-3">
            {cartas.map((carta) => {
              const familyContribs = carta.contribuicoes.filter((c) => c.pagina === 2)
              const totalFotos = familyContribs.reduce(
                (acc, c) => acc + (c.fotos_familia_urls?.length ?? 0), 0
              )

              return (
                <div key={carta.id} className="card">
                  <div className="flex items-start justify-between gap-4">

                    {/* Info principal */}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-apen-dark text-lg leading-tight mb-3">
                        {carta.nome_colaborador}
                      </h2>

                      {/* Status dos internos */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <StatusBadge
                          nome={carta.pessoa1_nome}
                          enviou={!!carta.pessoa1_mensagem}
                        />
                        <StatusBadge
                          nome={carta.pessoa2_nome}
                          enviou={!!carta.pessoa2_mensagem}
                        />
                      </div>

                      {/* Família */}
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>
                          💬 <strong>{familyContribs.length}</strong> recado{familyContribs.length !== 1 ? 's' : ''} da família
                        </span>
                        {totalFotos > 0 && (
                          <span>
                            📷 <strong>{totalFotos}</strong> foto{totalFotos !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <a
                        href={`/preview/${carta.id}`}
                        target="_blank"
                        className="btn-primary text-sm py-2 px-4 text-center whitespace-nowrap"
                      >
                        🖨️ Gerar PDF
                      </a>
                      <a
                        href={`/admin/${carta.id}`}
                        className="btn-secondary text-sm py-2 px-4 text-center whitespace-nowrap"
                      >
                        Gerenciar
                      </a>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    Criada em {new Date(carta.criado_em).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ nome, enviou }: { nome: string; enviou: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
      enviou
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      {enviou ? '✓' : '○'} {nome}
    </span>
  )
}
