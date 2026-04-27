export type Carta = {
  id: string
  nome_colaborador: string
  foto_colaborador_url: string | null
  nome_admin: string
  cargo_admin: string
  mensagem_admin: string
  foto_admin_url: string | null
  pessoa1_nome: string
  pessoa1_cargo: string
  pessoa1_foto_url: string | null
  pessoa1_mensagem: string | null
  pessoa2_nome: string
  pessoa2_cargo: string
  pessoa2_foto_url: string | null
  pessoa2_mensagem: string | null
  criado_em: string
}

export type Contribuicao = {
  id: string
  carta_id: string
  nome_remetente: string
  mensagem: string
  foto_remetente_url: string | null
  fotos_familia_urls: string[] | null
  pagina: 1 | 2
  criado_em: string
}

export type CartaComContribuicoes = Carta & {
  contribuicoes: Contribuicao[]
}
