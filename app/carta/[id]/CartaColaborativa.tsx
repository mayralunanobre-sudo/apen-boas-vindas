'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import type { Carta, Contribuicao } from '@/lib/types'
import DropZone from '@/app/components/DropZone'

type Props = {
  carta: Carta & { contribuicoes: Contribuicao[] }
}

type SenderType = 'pessoa1' | 'pessoa2' | 'familia'

export default function CartaColaborativa({ carta }: Props) {
  const [senderType, setSenderType] = useState<SenderType | ''>('')
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [fotoRemetente, setFotoRemetente] = useState<File | null>(null)
  const [fotosFamilia, setFotosFamilia] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [contribuicoes, setContribuicoes] = useState(carta.contribuicoes)

  const pessoa1Preenchida = !!carta.pessoa1_mensagem
  const pessoa2Preenchida = !!carta.pessoa2_mensagem

  function handleSenderChange(type: SenderType) {
    setSenderType(type)
    if (type === 'pessoa1') setNome(carta.pessoa1_nome)
    else if (type === 'pessoa2') setNome(carta.pessoa2_nome)
    else setNome('')
    setFotoRemetente(null)
    setFotosFamilia([])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!senderType) {
      setError('Por favor, selecione quem você é.')
      setLoading(false)
      return
    }
    if (!mensagem.trim()) {
      setError('Por favor, escreva uma mensagem.')
      setLoading(false)
      return
    }
    if ((senderType === 'pessoa1' || senderType === 'pessoa2') && !fotoRemetente) {
      setError('Colaboradores da Åpen precisam enviar uma foto.')
      setLoading(false)
      return
    }
    if (senderType === 'familia' && !nome.trim()) {
      setError('Por favor, informe seu nome.')
      setLoading(false)
      return
    }

    const data = new FormData()
    data.append('carta_id', carta.id)
    data.append('sender_type', senderType)
    data.append('nome_remetente', nome || 'Anônimo')
    data.append('mensagem', mensagem)
    if (fotoRemetente) data.append('foto_remetente', fotoRemetente)
    fotosFamilia.forEach((f) => data.append('fotos_familia', f))

    try {
      const res = await fetch('/api/contribuicoes', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erro ao enviar')
      setSuccess(true)
      if (json.contribuicao) {
        setContribuicoes((prev) => [...prev, json.contribuicao])
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header com dados do colaborador */}
        <div className="card mb-6 text-center">
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-apen.png" alt="Åpen Capital" className="h-7" />
          </div>
          <div className="flex justify-center mb-4">
            {carta.foto_colaborador_url ? (
              <Image
                src={carta.foto_colaborador_url}
                alt={carta.nome_colaborador}
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-apen-dark w-28 h-28"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-apen-dark bg-apen-dark flex items-center justify-center text-white text-4xl font-bold">
                {carta.nome_colaborador.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="section-title text-3xl mb-1">
            Boas-vindas, {carta.nome_colaborador}!
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Deixe sua mensagem de boas-vindas para o novo membro do time 💙
          </p>
        </div>

        {/* Mensagens já enviadas */}
        {contribuicoes.length > 0 && (
          <div className="card mb-6">
            <h3 className="font-bold text-apen-dark mb-3 text-sm uppercase tracking-wide">
              Mensagens recebidas ({contribuicoes.length})
            </h3>
            <div className="space-y-2">
              {contribuicoes.map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-apen-dark text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {c.nome_remetente.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-apen-dark">{c.nome_remetente}</p>
                    <p className="text-xs text-gray-500 truncate">{c.mensagem}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário de envio */}
        {success ? (
          <div className="card text-center py-10">
            <div className="w-16 h-16 bg-apen-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="section-title text-2xl mb-2">Mensagem enviada!</h2>
            <p className="text-gray-600">
              Obrigado pelo carinho. Sua mensagem foi registrada na carta de boas-vindas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-5">
            <h2 className="font-bold text-apen-dark text-lg">Enviar mensagem</h2>

            {/* Seleção de perfil */}
            <div>
              <label className="label">Quem é você? *</label>
              <div className="space-y-2">
                {!pessoa1Preenchida && (
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${senderType === 'pessoa1' ? 'border-apen-dark bg-blue-50' : 'border-gray-200 hover:border-apen-medium'}`}>
                    <input
                      type="radio"
                      name="sender"
                      value="pessoa1"
                      checked={senderType === 'pessoa1'}
                      onChange={() => handleSenderChange('pessoa1')}
                      className="accent-apen-dark"
                    />
                    <div>
                      <p className="font-semibold text-sm text-apen-dark">{carta.pessoa1_nome}</p>
                      <p className="text-xs text-gray-500">{carta.pessoa1_cargo} — Åpen Capital</p>
                    </div>
                  </label>
                )}
                {pessoa1Preenchida && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-blue-200 bg-blue-50 opacity-60">
                    <svg className="w-5 h-5 text-apen-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-sm text-apen-dark">{carta.pessoa1_nome}</p>
                      <p className="text-xs text-apen-medium">Já enviou a mensagem</p>
                    </div>
                  </div>
                )}
                {!pessoa2Preenchida && (
                  <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${senderType === 'pessoa2' ? 'border-apen-dark bg-blue-50' : 'border-gray-200 hover:border-apen-medium'}`}>
                    <input
                      type="radio"
                      name="sender"
                      value="pessoa2"
                      checked={senderType === 'pessoa2'}
                      onChange={() => handleSenderChange('pessoa2')}
                      className="accent-apen-dark"
                    />
                    <div>
                      <p className="font-semibold text-sm text-apen-dark">{carta.pessoa2_nome}</p>
                      <p className="text-xs text-gray-500">{carta.pessoa2_cargo} — Åpen Capital</p>
                    </div>
                  </label>
                )}
                {pessoa2Preenchida && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-blue-200 bg-blue-50 opacity-60">
                    <svg className="w-5 h-5 text-apen-medium" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-sm text-apen-dark">{carta.pessoa2_nome}</p>
                      <p className="text-xs text-apen-medium">Já enviou a mensagem</p>
                    </div>
                  </div>
                )}
                <label className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${senderType === 'familia' ? 'border-apen-dark bg-blue-50' : 'border-gray-200 hover:border-apen-medium'}`}>
                  <input
                    type="radio"
                    name="sender"
                    value="familia"
                    checked={senderType === 'familia'}
                    onChange={() => handleSenderChange('familia')}
                    className="accent-apen-dark"
                  />
                  <div>
                    <p className="font-semibold text-sm text-apen-dark">💬 Familiar ou amigo(a)</p>
                    <p className="text-xs text-gray-500">Envie uma mensagem e fotos especiais</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Nome */}
            {senderType === 'familia' && (
              <div>
                <label className="label">Seu nome *</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  placeholder="Como você quer ser identificado(a)"
                  className="input-field"
                />
              </div>
            )}

            {/* Foto do remetente — só para colaboradores pré-selecionados */}
            {(senderType === 'pessoa1' || senderType === 'pessoa2') && (
              <div>
                <label className="label">Sua foto *</label>
                <DropZone
                  id="foto-rem"
                  file={fotoRemetente}
                  onFile={setFotoRemetente}
                  capture="user"
                  label="Arraste sua foto aqui ou clique para selecionar"
                />
              </div>
            )}

            {/* Mensagem */}
            {senderType && (
              <div>
                <label className="label">Sua mensagem *</label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  required
                  rows={4}
                  placeholder="Escreva um recado especial de boas-vindas..."
                  className="input-field resize-none"
                />
              </div>
            )}

            {/* Bloco de fotos — só para família, sem limite */}
            {senderType === 'familia' && (
              <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                <div>
                  <p className="font-semibold text-sm text-apen-dark">📸 Fotos</p>
                  <p className="text-xs text-gray-500 mt-0.5">Envie quantas fotos quiser — elas aparecerão na carta</p>
                </div>
                <DropZone
                  id="fotos-fam"
                  multiple
                  files={fotosFamilia}
                  onFiles={(novas) => setFotosFamilia((prev) => [...prev, ...novas])}
                  label="Arraste as fotos aqui ou clique para selecionar"
                />
                {fotosFamilia.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {fotosFamilia.map((f, i) => (
                      <div key={i} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(f)}
                          alt={f.name}
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setFotosFamilia((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {senderType && (
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar mensagem 💚'
                )}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
