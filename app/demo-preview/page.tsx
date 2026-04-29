import PreviewContent from '@/app/preview/PreviewContent'
import type { CartaComContribuicoes } from '@/lib/types'

const cartaMock: CartaComContribuicoes = {
  id: 'demo',
  nome_colaborador: 'Arthur Barbosa',
  foto_colaborador_url: null,
  nome_admin: 'Mayra Luna',
  cargo_admin: 'Diretora de Operações',
  mensagem_admin:
    'Arthur, que alegria ter você no nosso time! Tenho certeza de que você vai agregar muito à Åpen. Seja muito bem-vindo, conte comigo sempre!',
  foto_admin_url: null,
  mensagem_saulo:
    'Que alegria! A sua chegada representa energia nova para uma empresa que há 6 anos vive o propósito de ser o braço direito dos clientes. Temos orgulho de ser a maior consultoria financeira do Norte e Nordeste e sabemos que isso se deve a todos os que estão aqui. Escolher cada um de vocês foi sentir que estamos construindo o futuro com ainda mais excelência, impacto e legado. Sejam muito bem-vindos. Contem comigo! Saulo Godoy',
  mensagem_tulio:
    'O melhor começo de carreira do mundo é aquele que tem muito problema pra resolver. Por isso, garanto: vocês estão no lugar certo! Sei o quanto a Åpen pode marcar a carreira de cada um de vocês, contem comigo nessa jornada... Tenho certeza de que a curiosidade intelectual e a vontade de trabalhar vão fazer toda a diferença para o crescimento de vocês lá na frente. Sejam muito bem-vindos. Vamos juntos! Abraços!',
  pessoa1_nome: 'Natália Bunzen',
  pessoa1_cargo: 'Líder de Suporte a Cliente',
  pessoa1_foto_url: null,
  pessoa1_mensagem:
    'Arthur, bem-vindo à família Åpen! Aqui você vai aprender muito e crescer muito. Pode contar comigo para o que precisar no dia a dia.',
  pessoa2_nome: 'Pedro Guerra',
  pessoa2_cargo: 'Investidor',
  pessoa2_foto_url: null,
  pessoa2_mensagem: null,
  criado_em: new Date().toISOString(),
  contribuicoes: [
    {
      id: '1',
      carta_id: 'demo',
      pagina: 2,
      nome_remetente: 'Ana Barbosa',
      mensagem:
        'Filho, estamos muito orgulhosos de você! Essa conquista é sua, fruto de muito esforço e dedicação. Que essa nova fase seja cheia de realizações. Te amamos muito!',
      foto_remetente_url: null,
      fotos_familia_urls: [],
      criado_em: new Date().toISOString(),
    },
    {
      id: '2',
      carta_id: 'demo',
      pagina: 2,
      nome_remetente: 'Carlos Barbosa',
      mensagem:
        'Meu filho, que orgulho! Você sempre soube onde queria chegar. Agora é só voar alto. Estaremos sempre torcendo por você!',
      foto_remetente_url: null,
      fotos_familia_urls: [],
      criado_em: new Date().toISOString(),
    },
    {
      id: '3',
      carta_id: 'demo',
      pagina: 2,
      nome_remetente: 'Mariana (melhor amiga)',
      mensagem:
        'Artur! Sabia que você ia arrasar. Você é incrível e merece tudo de bom. Vai com tudo nesse novo desafio!',
      foto_remetente_url: null,
      fotos_familia_urls: [],
      criado_em: new Date().toISOString(),
    },
  ],
}

export default function DemoPreviewPage() {
  return <PreviewContent carta={cartaMock} />
}
