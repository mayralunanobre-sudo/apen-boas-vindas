'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'

type FormState = {
  nome_colaborador: string
  nome_admin: string
  cargo_admin: string
  mensagem_admin: string
  pessoa1_nome: string
  pessoa1_cargo: string
  pessoa2_nome: string
  pessoa2_cargo: string
}

export default function CriarCartaPage() {
  const [form, setForm] = useState<FormState>({
    nome_colaborador: '',
    nome_admin: '',
    cargo_admin: '',
    mensagem_admin: '',
    pessoa1_nome: '',
    pessoa1_cargo: '',
    pessoa2_nome: '',
    pessoa2_cargo: '',
  })
  const [fotoColaborador, setFotoColaborador] = useState<File | null>(null)
  const [fotoAdmin, setFotoAdmin] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ id: string; url: string } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    if (fotoColaborador) data.append('foto_colaborador', fotoColaborador)
    if (fotoAdmin) data.append('foto_admin', fotoAdmin)

    try {
      const res = await fetch('/api/cartas', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erro ao criar carta')
      const url = `${window.location.origin}/carta/${json.id}`
      setResult({ id: json.id, url })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    if (!result) return
    navigator.clipboard.writeText(result.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full card text-center">
          <div className="w-16 h-16 bg-apen-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="section-title mb-2">Carta criada com sucesso!</h2>
          <p className="text-gray-600 mb-6">
            Compartilhe o link abaixo pelo WhatsApp com os colegas da Åpen e com a família do colaborador.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <p className="text-sm font-mono break-all text-apen-dark">{result.url}</p>
          </div>
          <div className="flex gap-3 justify-center mb-6">
            <button onClick={copyLink} className="btn-primary">
              {copied ? '✓ Copiado!' : 'Copiar link'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Acesse o link para enviar sua mensagem de boas-vindas: ${result.url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Enviar no WhatsApp
            </a>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-3">Painel do administrador:</p>
            <a
              href={`/admin/${result.id}`}
              className="text-apen-medium font-semibold hover:underline text-sm"
            >
              Acessar painel admin →
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-apen-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Å</span>
            </div>
            <span className="text-xl font-bold text-apen-dark">Åpen Capital</span>
          </div>
          <h1 className="section-title text-4xl mb-2">Nova Carta de Boas-Vindas</h1>
          <p className="text-gray-600">Preencha os dados para criar a carta do novo colaborador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Seção: Colaborador */}
          <div className="card">
            <h2 className="text-lg font-bold text-apen-dark mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-apen-dark text-white rounded-full text-sm flex items-center justify-center">1</span>
              Novo Colaborador
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Nome completo *</label>
                <input
                  name="nome_colaborador"
                  value={form.nome_colaborador}
                  onChange={handleChange}
                  required
                  placeholder="Ex: João da Silva"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Foto do colaborador</label>
                <div className="upload-area" onClick={() => document.getElementById('foto-colab')?.click()}>
                  {fotoColaborador ? (
                    <div className="flex items-center justify-center gap-2 text-apen-dark">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">{fotoColaborador.name}</span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <svg className="w-10 h-10 mx-auto mb-2 text-apen-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Clique para fazer upload da foto</p>
                    </div>
                  )}
                  <input id="foto-colab" type="file" accept="image/*" className="hidden"
                    onChange={(e) => setFotoColaborador(e.target.files?.[0] ?? null)} />
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Admin (Mayra Luna) */}
          <div className="card">
            <h2 className="text-lg font-bold text-apen-dark mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-apen-dark text-white rounded-full text-sm flex items-center justify-center">2</span>
              Seus dados (administrador)
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Seu nome *</label>
                  <input
                    name="nome_admin"
                    value={form.nome_admin}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Mayra Luna"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Seu cargo *</label>
                  <input
                    name="cargo_admin"
                    value={form.cargo_admin}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Diretora de Operações"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="label">Sua mensagem de boas-vindas *</label>
                <textarea
                  name="mensagem_admin"
                  value={form.mensagem_admin}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Escreva sua mensagem personalizada para o novo colaborador..."
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label className="label">Sua foto (opcional)</label>
                <div className="upload-area" onClick={() => document.getElementById('foto-admin')?.click()}>
                  {fotoAdmin ? (
                    <div className="flex items-center justify-center gap-2 text-apen-dark">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">{fotoAdmin.name}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Clique para fazer upload (opcional)</p>
                  )}
                  <input id="foto-admin" type="file" accept="image/*" className="hidden"
                    onChange={(e) => setFotoAdmin(e.target.files?.[0] ?? null)} />
                </div>
              </div>
            </div>
          </div>

          {/* Seção: Pessoa Extra 1 */}
          <div className="card">
            <h2 className="text-lg font-bold text-apen-dark mb-1 flex items-center gap-2">
              <span className="w-7 h-7 bg-apen-dark text-white rounded-full text-sm flex items-center justify-center">3</span>
              Colaborador Åpen — Pessoa 1
            </h2>
            <p className="text-sm text-gray-500 mb-4">Esta pessoa receberá o link e preencherá a foto e mensagem por conta própria.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nome *</label>
                <input
                  name="pessoa1_nome"
                  value={form.pessoa1_nome}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Cargo *</label>
                <input
                  name="pessoa1_cargo"
                  value={form.pessoa1_cargo}
                  onChange={handleChange}
                  required
                  placeholder="Cargo na empresa"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Seção: Pessoa Extra 2 */}
          <div className="card">
            <h2 className="text-lg font-bold text-apen-dark mb-1 flex items-center gap-2">
              <span className="w-7 h-7 bg-apen-dark text-white rounded-full text-sm flex items-center justify-center">4</span>
              Colaborador Åpen — Pessoa 2
            </h2>
            <p className="text-sm text-gray-500 mb-4">Mesma dinâmica da Pessoa 1 — preencherá via link.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nome *</label>
                <input
                  name="pessoa2_nome"
                  value={form.pessoa2_nome}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Cargo *</label>
                <input
                  name="pessoa2_cargo"
                  value={form.pessoa2_cargo}
                  onChange={handleChange}
                  required
                  placeholder="Cargo na empresa"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Criando carta...
              </span>
            ) : (
              'Criar carta e gerar link'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
