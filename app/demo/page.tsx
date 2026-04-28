import CartaColaborativa from '@/app/carta/[id]/CartaColaborativa'
import type { Carta, Contribuicao } from '@/lib/types'

const cartaDemo: Carta = {
  id: 'demo',
  nome_colaborador: 'Arthur Barbosa',
  foto_colaborador_url: null,
  nome_admin: 'Mayra Luna',
  cargo_admin: 'Diretora de Operações',
  mensagem_admin: 'Seja muito bem-vindo!',
  foto_admin_url: null,
  mensagem_saulo: 'Que alegria! Sejam muito bem-vindos. Contem comigo! Saulo Godoy',
  mensagem_tulio: 'O melhor começo de carreira é aquele que tem muito problema pra resolver. Vamos juntos!',
  pessoa1_nome: 'Natália Bunzen',
  pessoa1_cargo: 'Líder de Suporte a Cliente',
  pessoa1_foto_url: null,
  pessoa1_mensagem: null,
  pessoa2_nome: 'Pedro Guerra',
  pessoa2_cargo: 'Investidor',
  pessoa2_foto_url: null,
  pessoa2_mensagem: null,
  criado_em: new Date().toISOString(),
}

const contribuicoesDemo: Contribuicao[] = []

export default function DemoPage() {
  return (
    <CartaColaborativa
      carta={{ ...cartaDemo, contribuicoes: contribuicoesDemo }}
    />
  )
}
