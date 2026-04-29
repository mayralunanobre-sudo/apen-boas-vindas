'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import DropZone from './components/DropZone'

const DEFAULT_SAULO = `Que alegria! A sua chegada representa energia nova para uma empresa que há 6 anos vive o propósito de ser o braço direito dos clientes. Temos orgulho de ser a maior consultoria financeira do Norte e Nordeste e sabemos que isso se deve a todos os que estão aqui. Escolher cada um de vocês foi sentir que estamos construindo o futuro com ainda mais excelência, impacto e legado. Sejam muito bem-vindos. Contem comigo! Saulo Godoy`

const DEFAULT_TULIO = `O melhor começo de carreira do mundo é aquele que tem muito problema pra resolver. Por isso, garanto: vocês estão no lugar certo! Sei o quanto a Åpen pode marcar a carreira de cada um de vocês, contem comigo nessa jornada... Tenho certeza de que a curiosidade intelectual e a vontade de trabalhar vão fazer toda a diferença para o crescimento de vocês lá na frente. Sejam muito bem-vindos. Vamos juntos! Abraços!`

type FormState = {
  nome_colaborador: string
  mensagem_admin: string
  mensagem_saulo: string
  mensagem_tulio: string
}

export default function CriarCartaPage() {
  const [form, setForm] = useState<FormState>({
    nome_colaborador: '',
    mensagem_admin: '',
    mensagem_saulo: DEFAULT_SAULO,
    mensagem_tulio: DEFAULT_TULIO,
  })
  const [fotoColaborador, setFotoColaborador] = useState<File | null>(null)
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-apen.png" alt="Åpen Capital" className="h-10" />
          </div>
          <h1 className="font-montserrat text-4xl font-bold text-apen-dark mb-2">Nova Carta de Boas-Vindas</h1>
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
                <DropZone
                  id="foto-colab"
                  file={fotoColaborador}
                  onFile={setFotoColaborador}
                />
              </div>
            </div>
          </div>

          {/* Seção: Mensagem de Mayra */}
          <div className="card">
            <h2 className="text-lg font-bold text-apen-dark mb-1 flex items-center gap-2">
              <span className="w-7 h-7 bg-apen-dark text-white rounded-full text-sm flex items-center justify-center">2</span>
              Mensagem de Mayra Luna
            </h2>
            <p className="text-sm text-gray-500 mb-4">Diretora de Operações — sua mensagem aparecerá na carta com sua foto e nome fixos.</p>
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
          </div>

          {/* Seção: Mensagem de Saulo */}
          <div className="card">
            <h2 className="text-lg font-bold text-apen-dark mb-1 flex items-center gap-2">
              <span className="w-7 h-7 bg-apen-dark text-white rounded-full text-sm flex items-center justify-center">3</span>
              Mensagem de Saulo Godoy
            </h2>
            <p className="text-sm text-gray-500 mb-4">Sócio fundador — aparece no bilhetinho amarelo da carta. Edite se quiser personalizar.</p>
            <div>
              <label className="label">Mensagem *</label>
              <textarea
                name="mensagem_saulo"
                value={form.mensagem_saulo}
                onChange={handleChange}
                required
                rows={5}
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Seção: Mensagem de Túlio */}
          <div className="card">
            <h2 className="text-lg font-bold text-apen-dark mb-1 flex items-center gap-2">
              <span className="w-7 h-7 bg-apen-dark text-white rounded-full text-sm flex items-center justify-center">4</span>
              Mensagem de Túlio Cavalcanti
            </h2>
            <p className="text-sm text-gray-500 mb-4">Diretor de Consultoria e Alocação — mensagem fixa, mas editável se necessário.</p>
            <div>
              <label className="label">Mensagem *</label>
              <textarea
                name="mensagem_tulio"
                value={form.mensagem_tulio}
                onChange={handleChange}
                required
                rows={4}
                className="input-field resize-none"
              />
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
