'use client'

import { useState, useEffect } from 'react'

type CartaResumo = {
  id: string
  nome_colaborador: string
  criado_em: string
  contribuicoes: { id: string; pagina: number; fotos_familia_urls: string[] | null }[]
}

const AUTH_KEY = 'apen_admin_authed'

export default function AdminListClient({ cartas, debug }: { cartas: CartaResumo[]; debug?: string }) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === 'true') setAuthed(true)
  }, [])

  async function handleLogin(e: React.FormEvent) {
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

        <div className="flex items-center justify-between">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-apen.png" alt="Åpen Capital" className="h-6 mb-2" />
            <h1 className="section-title text-2xl">Cartas iniciadas</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary text-sm py-2 px-4"
            >
              🔄 Atualizar
            </button>
            <a href="/" className="btn-secondary text-sm py-2 px-4">+ Nova carta</a>
          </div>
        </div>

        {cartas.length === 0 ? (
          <div className="card text-center text-gray-400 py-20">
            Nenhuma carta criada ainda.
            {debug && <p className="text-xs mt-2 text-red-400">{debug}</p>}
          </div>
        ) : (
          <div className="space-y-3">
            {cartas.map((carta) => {
              const apenContribs = (carta.contribuicoes ?? []).filter((c) => c.pagina === 1)
              const familyContribs = (carta.contribuicoes ?? []).filter((c) => c.pagina === 2)
              const totalFotos = familyContribs.reduce(
                (acc, c) => acc + (c.fotos_familia_urls?.length ?? 0), 0
              )
              return (
                <div key={carta.id} className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-apen-dark text-lg leading-tight mb-3">
                        {carta.nome_colaborador}
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>🏢 <strong>{apenContribs.length}</strong> mensage{apenContribs.length !== 1 ? 'ns' : 'm'} do time Åpen</span>
                        <span>💬 <strong>{familyContribs.length}</strong> recado{familyContribs.length !== 1 ? 's' : ''} da família</span>
                        {totalFotos > 0 && <span>📷 <strong>{totalFotos}</strong> foto{totalFotos !== 1 ? 's' : ''}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <a href={`/preview/${carta.id}`} target="_blank" className="btn-primary text-sm py-2 px-4 text-center whitespace-nowrap">
                        🖨️ Gerar PDF
                      </a>
                      <a href={`/admin/${carta.id}`} className="btn-secondary text-sm py-2 px-4 text-center whitespace-nowrap">
                        Gerenciar
                      </a>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    Criada em {new Date(carta.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
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
